import { S3Client } from "@aws-sdk/client-s3";
const s3Client = new S3Client({
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-key',
  },
  endpoint: 'your-s3-endpoint',
  region: 'your-region',
  forcePathStyle: true,
})
export default s3Client