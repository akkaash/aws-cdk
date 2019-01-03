import { Construct } from "@aws-cdk/cdk";
import { cloudformation } from "../ssm.generated";

export interface MaintenanceWindowProps {
  name: string;
  description?: string;
  allowUnassociatedTargets: boolean;
  schedule: string;
  duration: number;
  cutoff: number;
  startDate?: Date;
  endDate?: Date;
  scheduleTimezone?: string;
}

export class MaintenanceWindow extends Construct {
  public resourceRef: string;
  constructor(parent: Construct, name: string, props: MaintenanceWindowProps) {
    super(parent, name);

    this.validateInteger(props.duration, props.cutoff);

    const resourceProps: cloudformation.MaintenanceWindowResourceProps = {
      name: props.name,
      description: props.description,
      allowUnassociatedTargets: props.allowUnassociatedTargets,
      schedule: props.schedule,
      duration: props.duration,
      cutoff: props.cutoff,
      startDate: this.convertDateToISO(props.startDate),
      endDate: this.convertDateToISO(props.endDate),
      scheduleTimezone: props.scheduleTimezone
    };

    const resource = new cloudformation.MaintenanceWindowResource(this, 'Resource', resourceProps);
    this.resourceRef = resource.ref;
  }

  private validateInteger(...numbers: number[]) {
    numbers.forEach((num: number) => {
      if (!Number.isInteger(num)) {
        throw new RangeError(`${JSON.stringify(num)} should be an integer`);
      }
    });
  }

  private convertDateToISO(date?: Date) {
    return date !== undefined ? date.toISOString() : undefined;
  }
}
