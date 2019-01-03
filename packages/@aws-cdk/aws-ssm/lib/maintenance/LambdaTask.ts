import * as lambda from "@aws-cdk/aws-lambda";
import { cloudformation } from "../ssm.generated";
import { Task, TaskType } from "./task";

export interface LambdaParameters {
  clientContext: string;
  qualifier: string;
  payload: string;
}

export class LambdaTask extends Task<LambdaParameters> {
  constructor(pLambda: lambda.Function, params?: LambdaParameters) {
    super(pLambda.functionArn, params);
  }

  public renderParameters(): cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty | undefined {
    if (this.params) {
      return {
        clientContext: this.params.clientContext,
        payload: this.params.payload,
        qualifier: this.params.qualifier
      } as cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty;
    }
    return undefined;
  }

  public renderTaskType() {
    return TaskType.Lambda;
  }
}
