import express, { Request, Response, NextFunction } from 'express';
import userRoutes from './routes/user';
import { ApiResponse, ApiStatusConstant } from './customTypes/allTypes';
import bodyParser from 'body-parser';
import 'dotenv/config';
import swaggerDocs from './swagger'
import Database from './database/connection';
import winston from 'winston';
import path from 'path';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, '../logs/combined.log') }),
    ],
});

global.loggerG = logger;//access loggerG globally now.


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const response: ApiResponse = { status: ApiStatusConstant.FAILED, message: err, data: {} };
    res.status(500).json(response)
});


app.use('/user', userRoutes);

const conn = Database.get();
conn.then((res) => {
    //console.log(`connection response got `);
    app.listen(process.env.PORT, () => {
        console.log(`Server connected to http://localhost:${process.env.PORT}`);
    });
    swaggerDocs(app);
}).catch(ex => {
    console.log(`Issue while connecting with the server `, ex);
});
