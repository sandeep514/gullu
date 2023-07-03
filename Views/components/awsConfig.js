import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'YOUR_AWS_REGION',
  credentials: {
    accessKeyId: 'YOUR_AWS_ACCESS_KEY_ID',
    secretAccessKey: 'YOUR_AWS_SECRET_ACCESS_KEY',
  },
});
