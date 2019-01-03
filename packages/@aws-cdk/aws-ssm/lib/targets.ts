import * as ec2 from "@aws-cdk/aws-ec2";

export interface TagTarget {
  tag: string;
  values: string[];
}

export type InstanceTargets = ec2.cloudformation.InstanceResource[];

export type Targets = TagTarget[] | InstanceTargets;

export function renderTargetTags(targets: TagTarget[]) {
  const renderedTargets: Array<{ key: string; values: string[]; }> = [];
  targets.forEach((target: TagTarget) => {
    renderedTargets.push({
      key: `tag:${target.tag}`,
      values: target.values
    });
  });
  return renderedTargets;
}

export function renderTargetInstances(targets: InstanceTargets) {
  const renderedTargets: Array<{ key: string; values: string[]; }> = [];
  renderedTargets.push({
    key: 'instanceids',
    values: targets.map((instance) => instance.instanceId)
  });
  return renderedTargets;
}

export function renderTargets(targets: Targets) {
  if (isTargetArray(targets)) {
    return renderTargetTags(targets);
  } else {
    return renderTargetInstances(targets);
  }
}

function isTargetArray(targets: any): targets is TagTarget[] {
  const target = targets[0];
  return target.tag !== undefined && target.values !== undefined;
}
