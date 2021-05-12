const http = require('http');

const server = http.createServer((req, res) => {});

server.listen(process.env.port || 3000);