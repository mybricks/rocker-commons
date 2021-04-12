export abstract class _Logger {
  public implement: string;

  trace(message: any, error?: Error): void {
    //override
  }

  debug(message: any, error?: Error): void {
    //override
  }

  info(message: any, error?: Error): void {
    //override
  }

  warn(message: any, error?: Error): void {
    //override
  }

  error(message: any, error?: Error): void {
    //override
  }

  fatal(message: any, error?: Error): void {
    //override
  }
}

export abstract class _Tracelocal {
  get id(): string {
    return undefined;
  }

  set(key: string, value: any): void {
    throw new Error(`No implement for Tracelocal's set.`);
  }

  get(key: string): any {
    throw new Error(`No implement for Tracelocal's get.`);
  }

  /**
   * Complete the whole tracelocal
   */
  complete() {
    throw new Error(`No implement for Tracelocal's complete.`);
  }
}