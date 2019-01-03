import { Role } from "@aws-cdk/aws-iam";
import { Topic } from "@aws-cdk/aws-sns";
import { Document } from "../document";
import { S3OutputLocation } from "../S3OutputLocation";
import { cloudformation } from "../ssm.generated";
import { Task, TaskType } from "./task";

export enum CommandStatus {
  All = 'All',
  InProgress = 'InProgress',
  Success = 'Success',
  TimedOut = 'TimedOut',
  Cancelled = 'Cancelled',
  Failed = 'Failed'
}

export interface NotificationConfig {
  notificationTopic: Topic;
  notificationType: 'Command' | 'Invocation';
  notificationEvents: CommandStatus[];
}

export interface RunCommandTaskParameters {
  timeoutSeconds: number;
  comment: string;
  s3OutputLocation: S3OutputLocation;
  parameters: object;
  serviceRole: Role;
  notificationConfig: NotificationConfig;
  documentHashType: 'SHA-256' | 'SHA-1';
  documentHash: string;
}

export class RunCommandTask extends Task<RunCommandTaskParameters> {
  public params: RunCommandTaskParameters | undefined;
  constructor(document: Document, params?: RunCommandTaskParameters) {
    super(document.resourceRef, params);
  }

  public renderParameters(): cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty | undefined {
    if (this.params) {
      return {
        timeoutSeconds: this.params.timeoutSeconds,
        comment: this.params.comment,
        parameters: this.params.parameters,
        serviceRoleArn: this.params.serviceRole.roleArn,
        notificationConfig: {
          notificationArn: this.params.notificationConfig.notificationTopic.topicArn,
          notificationType: this.params.notificationConfig.notificationType,
          notificationEvents: this.params.notificationConfig.notificationEvents
        },
        outputS3KeyPrefix: this.params.s3OutputLocation.keyPrefix,
        outputS3BucketName: this.params.s3OutputLocation.bucket.bucketName,
        documentHash: this.params.documentHash,
        documentHashType: this.params.documentHashType
      } as cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty;
    }
    return undefined;
  }

  public renderTaskType() {
    return TaskType.RunCommand;
  }
}
