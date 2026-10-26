const crypto = require('crypto');

// Gera uma string aleatória de 32 bytes
const generateCookieSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Exibe a string gerada
console.log(generateCookieSecret());
