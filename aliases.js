const path = require('path');
const moduleAlias = require('module-alias');

moduleAlias.addAliases({
  '@root': path.resolve(__dirname),
  '@handlers': path.resolve(__dirname, 'bot/handlers'),
  '@helpers': path.resolve(__dirname, 'bot/helpers'),
  '@schemas': path.resolve(__dirname, 'bot/database/schemas'),
  '@bot': path.resolve(__dirname, 'bot'),
  '@structures': path.resolve(__dirname, 'bot/structures')
});
