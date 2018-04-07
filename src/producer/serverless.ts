import * as awilix from "awilix";
import * as dotenv from "dotenv";
import { LoggerInstance } from "winston";
import DynamoDbStorage from "../shared/storage/dynamoDb";
import TranslationsStorage from "../shared/translations/translations";
import createContainer from "./container";
import GoogleSheets from "./google/sheets";
import ITransformer from "./transformer/transformer";

dotenv.config();

const container = createContainer(undefined, {
  storage: awilix.asClass(DynamoDbStorage)
});

process.on("uncaughtException", err => {
  container.resolve<LoggerInstance>("logger").error(err.toString());
  process.exit(1);
});

process.on("unhandledRejection", err => {
  container.resolve<LoggerInstance>("logger").error(err.toString());
  process.exit(1);
});

async function main() {
  const spreadsheetData = await container.resolve<GoogleSheets>("googleSheets").fetchSpreadsheet();

  const transformedData = await container.resolve<ITransformer>("transformer").transform(spreadsheetData);

  container.resolve<TranslationsStorage>("translationsStorage").setTranslations(transformedData);
}

export const handler = async (event: any, context: any) => {
  try {
    await main();
  } catch (error) {
    return {
      body: error.message || "Internal server error",
      statusCode: error.statusCode || 500
    };
  }

  return {
    body: JSON.stringify({ result: "ok" }),
    statusCode: 200
  };
};
