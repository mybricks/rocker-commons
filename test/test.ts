import {Logger, _Logger, init} from '..';

class T extends _Logger {
  public implement: string = 'T';

  info(message: string): void {
    console.log(message);
  }

  fatal(message: string, error?: Error): void {
    console.log(message);
  }
}

init({
  Logger: () => {
    return new T();
  }
})

Logger.info(222);
Logger.info(Logger.implement);
