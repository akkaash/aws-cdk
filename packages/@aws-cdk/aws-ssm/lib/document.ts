import { Construct, Tag } from "@aws-cdk/cdk";
import { cloudformation } from "./ssm.generated";

export interface DocumentProps {
  content: object;
  documentType: string;
  tags: Tag[]
}

export class Document extends Construct {
  public readonly resourceRef: string;

  constructor(parent: Construct, name: string, props: DocumentProps) {
    super(parent, name);

    const resource = new cloudformation.DocumentResource(this, 'Resource', {
      content: props.content,
      documentType: props.documentType,
      tags: props.tags
    });

    this.resourceRef = resource.ref;
  }
}
