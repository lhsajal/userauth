import winston from 'winston';

declare global {
    var loggerG: winston.Logger;
}