import command from 'command-interface';
const chalk = require('chalk');

// tslint:disable-next-line: no-console
console.log(chalk.green('✅🧞 NEILSONZ MSYNC 😸✅'));
command(`${__dirname}/**/*.cmd.js`);
