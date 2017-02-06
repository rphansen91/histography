const http = require('http');
const app = require('./src/app');
const PORT = process.env.PORT || 8155

const server = http.createServer(app);

server.listen(PORT, () => console.log('Server running at http://127.0.0.1:' + PORT + '/'));