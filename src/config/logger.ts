import winston, { Logger as WinstonLogger } from 'winston';

const env = process.env.NODE_ENV || 'development';
export class Logger {
  private static enumerateErrorFormat: any = winston.format((info): any => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });

  public logger: WinstonLogger = winston.createLogger({
    level: env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      Logger.enumerateErrorFormat(),
      env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
      winston.format.splat(),
      winston.format.printf(({ level, message }): string => `${level}: ${message}`)
    ),
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
      }),
    ],
  });
}

export default new Logger().logger;
