const crypto = require('crypto');

// Gera uma chave aleatória de 32 bytes (256 bits)
const key = crypto.randomBytes(32);

// Gera um vetor de inicialização (IV) aleatório de 16 bytes (128 bits)
const initVector = crypto.randomBytes(16);

// Converta a chave e o IV para strings base64 para armazenamento ou transmissão
const keyBase64 = key.toString('base64');
const initVectorBase64 = initVector.toString('base64');

console.log('Key:', keyBase64);
console.log('Initialization Vector:', initVectorBase64);
