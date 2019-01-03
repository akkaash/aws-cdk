export abstract class AbstractTask<T> {
  public arn: string;
  public params: T | undefined;
  constructor(arn: string, params?: T) {
    this.arn = arn;
    this.params = params;
  }
  public abstract renderParameters(): any | undefined;
  public abstract renderTaskType(): TaskType;
}

export enum TaskType {
  RunCommand = 'RUN_COMMAND',
  Automation = 'AUTOMATION',
  Lambda = 'LAMBDA',
  StepFunction = 'STEP_FUNCTION'
}
