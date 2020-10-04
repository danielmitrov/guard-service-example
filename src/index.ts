import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';

import middleware from './middleware';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())


app.get('/', middleware.authenticate, (req, res) => {
    res.send(`Hello ${req.username}!`);
});


server.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});

export default {
    app,
    port,
};
