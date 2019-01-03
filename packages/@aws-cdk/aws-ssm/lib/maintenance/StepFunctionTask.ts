import { StateMachine } from "@aws-cdk/aws-stepfunctions";
import { cloudformation } from "../ssm.generated";
import { Task, TaskType } from "./task";

export interface StepFunctionParameters {
  input: string;
  name: string;
}

export class StepFunctionTask extends Task<StepFunctionParameters> {
  constructor(stateMachine: StateMachine, params?: StepFunctionParameters) {
    super(stateMachine.stateMachineArn, params);
  }

  public renderParameters(): cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowStepFunctionsParametersProperty | undefined {
    if (this.params) {
      return {
        input: this.params.input,
        name: this.params.name
      } as cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowStepFunctionsParametersProperty;
    }
    return undefined;
  }

  public renderTaskType() {
    return TaskType.StepFunction;
  }
}
