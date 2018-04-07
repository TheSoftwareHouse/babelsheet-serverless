import * as awilix from "awilix";
import * as dotenv from "dotenv";
import * as serverless from "serverless-http";
import { LoggerInstance } from "winston";
import DynamoDbStorage from "../shared/storage/dynamoDb";
import createContainer from "./container";
import Server from "./server/server";

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

const server = container.resolve<Server>("server").getApp();

export const handler = serverless(server);
