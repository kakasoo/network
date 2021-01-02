import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import loginRouter from './routes/login.js';
import usersRouter from './routes/users.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use([
    logger('tiny'),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(),
    express.static(path.join(__dirname, 'public')),
]);

app.use([compression(), helmet(), cors()]);

app.use('/login', loginRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send(`STATUS_CODE : ${err.status} ERROR, MESSAGE : ${err.message}`);
});

export default app;
