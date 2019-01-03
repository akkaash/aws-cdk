import { Document } from "../document";
import { cloudformation } from "../ssm.generated";
import { Task, TaskType } from "./task";

export interface AutomationTaskParameters {
  parameters: object;
  documentVersion: string;
}

export class AutomationTask extends Task<AutomationTaskParameters> {
  constructor(document: Document, params?: AutomationTaskParameters) {
    super(document.resourceRef, params);
  }
  public renderParameters(): cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty | undefined {
    if (this.params) {
      return {
        documentVersion: this.params.documentVersion,
        parameters: this.params.parameters
      } as cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty;
    }
    return undefined;
  }

  public renderTaskType() {
    return TaskType.Automation;
  }
}
