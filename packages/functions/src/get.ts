import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const params = {
    TableName: Resource.Notes.name,
    //'Key' defines the partition key and sort key of the item to be retreived
    Key: {
      userId: "123", //id of author
      noteId: event?.pathParameters?.id, //id of note from path
    },
  };

  const result = await dynamoDb.send(new GetCommand(params));
  if(!result.Item){
    throw new Error("Item not found.");
  }

  //Return the retrieved item
  return JSON.stringify(result.Item);
})