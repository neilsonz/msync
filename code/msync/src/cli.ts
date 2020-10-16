import { log } from './common';
import command from 'command-interface';

log.info(' MSYNC ');
command(`${__dirname}/**/*.cmd.js`);
