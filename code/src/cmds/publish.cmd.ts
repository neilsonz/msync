import {
  log,
  loadSettings,
  exec,
  listr,
  IListrOptions,
  constants,
  IModule,
  elapsed,
  inquirer,
  semver,
  plural,
} from '../common';
import { printTable } from './ls.cmd';

export const name = 'publish';
export const alias = ['p', 'pub'];
export const description = 'Publishes all modules that are ahead of NPM.';
export const args = {};

/**
 * CLI command.
 */
export async function cmd(args?: { params: string[]; options: {} }) {
  await publish({});
}

export async function publish(options: {} = {}) {
  // Retrieve settings.
  const settings = await loadSettings({ npm: true, spinner: true });
  if (!settings) {
    log.warn.yellow(constants.CONFIG_NOT_FOUND_ERROR);
    return;
  }

  // Filter on modules that require publishing.
  const modules = settings.modules.filter(pkg => isPublishRequired(pkg));
  printTable(modules);

  const total = modules.length;
  if (total === 0) {
    log.info.gray(`✨✨  No modules need to be published.\n`);
    return;
  }

  // Prompt the user if they want to continue.
  if (
    !(await promptYesNo(
      `Publish ${total} ${plural('module', total)} to NPM now?`,
    ))
  ) {
    log.info();
    return;
  }

  // Publish.
  log.info.gray(`Publishing to NPM:\n`);
  const startedAt = new Date();

  // [Slow] Full install and sync mode.
  const publishCommand = (pkg: IModule) => {
    const install = pkg.engine === 'YARN' ? 'yarn install' : 'npm install';
    return `${install} && npm publish && msync sync`;
  };
  const publishResult = await runCommand(modules, publishCommand, {
    concurrent: false,
    exitOnError: true,
  });

  if (publishResult.success) {
    log.info(`\n✨✨  Done ${log.gray(elapsed(startedAt))}\n`);
  } else {
    log.info.yellow(`\n💩  Something went wrong while publishing.\n`);
    log.error(publishResult.error);
  }
}

const runCommand = async (
  modules: IModule[],
  cmd: (pkg: IModule) => string,
  options: IListrOptions,
) => {
  const task = (pkg: IModule) => {
    return {
      title: `${log.cyan(pkg.name)} ${log.magenta(cmd(pkg))}`,
      task: async () => {
        const command = `cd ${pkg.dir} && ${cmd(pkg)}`;
        return exec.run(command, { silent: true });
      },
    };
  };
  const tasks = modules.map(pkg => task(pkg));
  const runner = listr(tasks, options);
  try {
    await runner.run();
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error }; // Fail.
  }
};

async function promptYesNo(message: string) {
  const confirm = {
    type: 'list',
    name: 'answer',
    message,
    choices: [{ name: 'Yes', value: 'true' }, { name: 'No', value: 'false' }],
  };
  const res = (await inquirer.prompt(confirm)) as { answer: string };
  const answer = res.answer;
  return answer === 'true' ? true : false;
}

const isPublishRequired = (pkg: IModule) =>
  pkg.npm ? semver.gt(pkg.version, pkg.npm.latest) : false;
