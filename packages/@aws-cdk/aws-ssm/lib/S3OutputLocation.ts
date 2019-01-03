import { Bucket } from "@aws-cdk/aws-s3";
export interface S3OutputLocation {
  bucket: Bucket;
  keyPrefix?: string;
}
