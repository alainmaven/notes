import * as uuid from "uuid";
import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  let data ={
    content: "",
    attachement: "",
  };

  //Resquest bod is passed in as a  JSON encoded string in 'event.body'
  if (event.body != null) {
    data = JSON.parse(event.body);

  }
    const params = {
      TableName: Resource.Notes.name,
      Item: {
        //the attribute of the item to be created
        userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId, //id of author
        noteId: uuid.v1(), //unique uuid
        content: data.content, //parsed from request bod
        attachement: data.attachement, //parse from request bod
        createdAt: Date.now(), //current unix timestamp
      },
    };

    await dynamoDb.send(new PutCommand(params));

    return  JSON.stringify(params.Item);
});