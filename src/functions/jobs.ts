import { SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = (event) => {

  console.log(event);
  console.log("AGORA VAI!");

};