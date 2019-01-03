import { Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/cdk";
import { cloudformation } from "../ssm.generated";
import { Targets, renderTargets } from "../targets";
import { AbstractTask, TaskType } from "./AbstractTask";
import { MaintenanceWindow } from "./window";

export interface MaintenanceWindowTaskProps {
  maxErrors: number;
  description?: string;
  serviceRole: Role;
  priority: number;
  maxConcurrency: number;
  targets: Targets
  name?: string;
  task: AbstractTask<any>;
  window?: MaintenanceWindow;

}

export class MaintenanceWindowTask extends Construct {
  constructor(parent: Construct, name: string, props: MaintenanceWindowTaskProps) {
    super(parent, name);

    const resourceProps: cloudformation.MaintenanceWindowTaskResourceProps = {
      maxErrors: `${props.maxErrors}`,
      serviceRoleArn: props.serviceRole.roleArn,
      priority: props.priority,
      maxConcurrency: `${props.maxConcurrency}`,
      targets: renderTargets(props.targets),
      taskArn: props.task.arn,
      taskType: props.task.renderTaskType(),
      windowId: props.window ? props.window.resourceRef : undefined,
      description: props.description,
      name: props.name,
    };

    switch (props.task.renderTaskType()) {
      case TaskType.RunCommand:
        resourceProps.taskInvocationParameters = { maintenanceWindowRunCommandParameters: props.task.renderParameters() };
        break;
      case TaskType.Automation:
        resourceProps.taskInvocationParameters = { maintenanceWindowAutomationParameters: props.task.renderParameters() };
        break;
      case TaskType.Lambda:
        resourceProps.taskInvocationParameters = { maintenanceWindowLambdaParameters: props.task.renderParameters() };
        break;
      case TaskType.StepFunction:
        resourceProps.taskInvocationParameters = { maintenanceWindowStepFunctionsParameters: props.task.renderParameters() };
        break;
      default:
        break;
    }

    new cloudformation.MaintenanceWindowTaskResource(this, 'Resource', resourceProps);
  }
}
