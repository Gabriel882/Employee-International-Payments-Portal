const https = require('https');
const fs = require('fs');
const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH)
};


// Create HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log('✅ Secure server running at https://localhost');
});
