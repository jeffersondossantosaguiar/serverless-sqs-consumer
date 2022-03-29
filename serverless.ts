import type { AWS } from '@serverless/typescript';
import * as dotenv from "dotenv";

dotenv.config({ path: __dirname + '/.env' });

const serverlessConfiguration: AWS = {
  service: 'aws-sqs-consumer',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
  },
  // import the function via paths
  functions: {
    jobs: {
      handler: "src/functions/jobs.handler",
      events: [
        {
          sqs: {
            arn: {
              "Fn::GetAtt": ["queue", "Arn"]
            },
            batchSize: 1
          }
        }
      ]
    }
  },
  resources: {
    Resources: {
      queue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: `${ process.env.QUEUE_NAME }`
        }
      }
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
