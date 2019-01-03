import { Construct } from "@aws-cdk/cdk";
import { S3OutputLocation } from "./S3OutputLocation";
import { cloudformation } from "./ssm.generated";
import { renderTargets, Targets } from "./targets";

export interface InstanceAssociationOutputLocation {
  s3OutputLocation: S3OutputLocation;
}

export interface AssociationProps {
  associationName?: string;
  documentVersion?: string;
  instanceId?: string;
  documentName: string;
  outputLocation: InstanceAssociationOutputLocation;
  parameters: {[key: string]: string[]};
  schedule?: string;
  targets: Targets;
}

/**
 * The AWS::SSM::Association resource associates an SSM document in AWS Systems Manager with EC2 instances
 * that contain a configuration agent to process the document.
 */
export class Association extends Construct {
  constructor(parent: Construct, name: string, props: AssociationProps) {
    super(parent, name);

    const resourceProps: cloudformation.AssociationResourceProps = {
      associationName: props.associationName,
      documentVersion: props.documentVersion,
      name: props.documentName,
      outputLocation: {
        s3Location: {
          outputS3BucketName: props.outputLocation.s3OutputLocation.bucket.bucketName,
          outputS3KeyPrefix: props.outputLocation.s3OutputLocation.keyPrefix
        }
      },
      parameters: this.renderParameters(props.parameters),
      scheduleExpression: props.schedule
    };

    this.renderAssociationTargets(props, resourceProps);

    new cloudformation.AssociationResource(this, 'Resource', resourceProps);
  }

  private renderParameters(params: {[key: string]: string[]}) {
    return Object.keys(params).reduce((previous, key: string) => {
      previous[key] = {
        parameterValues: params[key]
      };
      return previous;
    }, {} as { [key: string]: cloudformation.AssociationResource.ParameterValuesProperty });
  }

  private renderAssociationTargets(props: AssociationProps, resourceProps: cloudformation.AssociationResourceProps) {
    if (props.targets.length === 0 && props.instanceId === undefined) {
      throw new Error("You must specify the InstanceId or Targets property.");
    } else {
      if (props.instanceId) {
        resourceProps.instanceId = props.instanceId;
      } else {
        resourceProps.targets = renderTargets(props.targets);
      }
    }
  }
}
