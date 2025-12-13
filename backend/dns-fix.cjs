// This file sets Google DNS for Node.js to fix MongoDB Atlas SRV lookup issues
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('DNS servers set to Google DNS');
