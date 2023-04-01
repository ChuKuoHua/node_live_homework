import http from 'http';
import app from '../app';
const server: http.Server = http.createServer(app);
const port = process.env.PORT || '3005';
server.listen(port);
