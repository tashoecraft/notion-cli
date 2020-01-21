import { execSync, spawnSync } from 'child_process';
import { inquirer } from 'inquirer';
import { output } from '@cli/utilities';

const packageManager = determinePackageManager();

enum ProjectTypes {
  Node = 'node',
  Browser = 'browser'
}

function determinePackageManager() {
  let packageManager = 'npm';
  if (packageManager === 'npm' || isPackageManagerInstalled(packageManager)) {
    return packageManager;
  }

  if (isPackageManagerInstalled('yarn')) {
    return 'yarn';
  }

  if (isPackageManagerInstalled('pnpm')) {
    return 'pnpm';
  }

  return 'npm';
}

function isPackageManagerInstalled(packageManager: string) {
  let isInstalled = false;
  try {
    execSync(`${packageManager} --version`, {
      stdio: ['ignore', 'ignore', 'ignore']
    });
    isInstalled = true;
  } catch (e) {
    /* do nothing */
  }
  return isInstalled;
}

function determineWorkspaceName(parsedArgs: any): Promise<string> {
  const workspaceName: string = parsedArgs._[2];

  if (workspaceName) {
    return Promise.resolve(workspaceName);
  }

  return inquirer
    .prompt([
      {
        name: 'ProjectName',
        message: `Project name (e.g., First_Notion_App)    `,
        type: 'string'
      }
    ])
    .then(a => {
      if (!a.WorkspaceName) {
        output.error({
          title: 'Invalid project name',
          bodyLines: [`Project name cannot be empty`]
        });
        process.exit(1);
      }
      return a.WorkspaceName;
    });
}

function determineProject(parsedArgs: any): Promise<ProjectTypes> {
  if (parsedArgs.preset) {
    if (Object.values(ProjectTypes).indexOf(parsedArgs.preset) === -1) {
      output.error({
        title: 'Invalid projcet type',
        bodyLines: [
          `It must be one of the following:`,
          '',
          ...Object.values(ProjectTypes)
        ]
      });
      process.exit(1);
    } else {
      return Promise.resolve(parsedArgs.preset);
    }
  }

  return inquirer
    .prompt([
      {
        name: 'Project',
        message: `What type of project would you like to create?`,
        default: 'empty',
        type: 'list',
        choices: ProjectTypes
      }
    ])
    .then((a: { Preset: Preset }) => a.Preset);
}
function createSandbox(
  packageManager: string,
  cli: { package: string; version: string }
) {
  const cwd = process.cwd();
  const { status, stderr, stdout, error } = spawnSync('npm', ['init'], {
    stdio: 'pipe',
    shell: true,
    encoding: 'utf8',
    cwd
  });

  if (status !== 0) {
    let errorMessage = (
      (error && error.message) ||
      stderr ||
      stdout ||
      ''
    ).trim();
    if (errorMessage) {
      errorMessage += '\n';
    }
    throw new Error(
      errorMessage +
        `Package install failed${errorMessage ? ', see above' : ''}.`
    );
  }

  logger.info(
    colors.green(`Installed packages for tooling via ${packageManager}.`)
  );
  const tmpDir = dirSync().name;
  writeFileSync(
    path.join(tmpDir, 'package.json'),
    JSON.stringify({
      dependencies: {
        '@neurosity/notion': '4.2.5',
        dotenv: '8.2.0'
      },
      license: 'MIT'
    })
  );

  execSync(`${packageManager} install --silent`, {
    cwd: tmpDir,
    stdio: [0, 1, 2]
  });

  return tmpDir;
}
