import * as aws from "aws-sdk";
import * as util from "util";
import IStorage from "./storage";

export default class DynamoDbStorage implements IStorage {
  private dynamoDb: aws.DynamoDB.DocumentClient;

  constructor() {
    if (process.env.NODE_DEV === "dev") {
      this.dynamoDb = new aws.DynamoDB.DocumentClient({
        endpoint: "http://dev.local:8000",
        region: "us-east-1"
      });
    } else {
      this.dynamoDb = new aws.DynamoDB.DocumentClient();
    }
  }

  public async set(key: string, value: any) {
    const params = {
      Item: {
        id: key,
        value
      },
      TableName: process.env.DYNAMODB_TABLE || ""
    };

    await util.promisify(this.dynamoDb.put).bind(this.dynamoDb)(params);
  }

  public async get(key: string) {
    const params = {
      Key: {
        id: key
      },
      TableName: process.env.DYNAMODB_TABLE || ""
    };

    const result = await util.promisify(this.dynamoDb.get).bind(this.dynamoDb)(params);

    return result.Item ? result.Item.value : null;
  }
}
