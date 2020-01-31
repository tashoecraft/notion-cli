import { execSync, spawnSync } from 'child_process';
// import { output } from './utilities/output';
import { writeFileSync } from 'fs';
import * as yargsParser from 'yargs-parser';
import * as inquirer from 'inquirer';
import * as path from 'path';
import { dirSync } from 'tmp';

// const packageManager = determinePackageManager();

enum ProjectTypes {
  Node = 'node',
  Browser = 'browser'
}

const presetOptions = [
  {
    value: ProjectTypes.Node,
    name: 'Node based notion workspace'
  },
  {
    value: ProjectTypes.Browser,
    name: 'Browser based notion project'
  }
];

const parsedArgs = yargsParser(process.argv, {
  string: ['cli', 'preset', 'appName'],
  alias: {
    appName: 'app-name'
  },
  boolean: ['help']
});

inquirer
  .prompt([
    {
      name: 'Project',
      message: `What type of project would you like to create?`,
      default: 'empty',
      type: 'list',
      choices: presetOptions
    },
    {
      name: 'ProjectName',
      message: `Project name (e.g., First_Notion_App)`,
      type: 'string'
    }
  ])
  .then((a: { Preset: any }) => {
    a.Preset
  }).catch(e => {
    console.log('error', e);
  });

// function determinePackageManager() {
//   let packageManager = 'npm';
//   if (packageManager === 'npm' || isPackageManagerInstalled(packageManager)) {
//     return packageManager;
//   }
//
//   if (isPackageManagerInstalled('yarn')) {
//     return 'yarn';
//   }
//
//   if (isPackageManagerInstalled('pnpm')) {
//     return 'pnpm';
//   }
//
//   return 'npm';
// }
//
// function isPackageManagerInstalled(packageManager: string) {
//   let isInstalled = false;
//   try {
//     execSync(`${packageManager} --version`, {
//       stdio: ['ignore', 'ignore', 'ignore']
//     });
//     isInstalled = true;
//   } catch (e) {
//     /* do nothing */
//   }
//   return isInstalled;
// }
//
// function determineProjectName(parsedArgs: any): Promise<string> {
//   const ProjectName: string = parsedArgs._[2];
//
//   if (ProjectName) {
//     return Promise.resolve(ProjectName);
//   }
//
//   return inquirer
//     .prompt([
//       {
//         name: 'ProjectName',
//         message: `Project name (e.g., First_Notion_App)    `,
//         type: 'string'
//       }
//     ])
//     .then(a => {
//       // if (!a.ProjectName) {
//       //   // output.error({
//       //   //   title: 'Invalid project name',
//       //   //   bodyLines: [`Project name cannot be empty`]
//       //   // });
//       //   process.exit(1);
//       // }
//       return a.ProjectName;
//     }).catch(e => {
//       console.log(e, 'error');
//     });
// }
//
// function determineProject(parsedArgs: any): Promise<ProjectTypes> {
//   return inquirer
//     .prompt([
//       {
//         name: 'Project',
//         message: `What type of project would you like to create?`,
//         default: 'empty',
//         type: 'list',
//         choices: ProjectTypes
//       }
//     ])
//     .then((a: { Preset: any }) => {
//       a.Preset
//     }).catch(e => {
//       console.log('error', e);
//     });
// }
//
// function createSandbox(
//   packageManager: string,
//   cli: { package: string; version: string }
// ) {
//   const cwd = process.cwd();
//   const { status, stderr, stdout, error } = spawnSync('npm', ['init'], {
//     stdio: 'pipe',
//     shell: true,
//     encoding: 'utf8',
//     cwd
//   });
//
//   if (status !== 0) {
//     let errorMessage = (
//       (error && error.message) ||
//       stderr ||
//       stdout ||
//       ''
//     ).trim();
//     if (errorMessage) {
//       errorMessage += '\n';
//     }
//     throw new Error(
//       errorMessage +
//         `Package install failed${errorMessage ? ', see above' : ''}.`
//     );
//   }
//
//   // logger.info(
//   //   colors.green(`Installed packages for tooling via ${packageManager}.`)
//   // );
//   const tmpDir = dirSync().name;
//   writeFileSync(
//     path.join(tmpDir, 'package.json'),
//     JSON.stringify({
//       dependencies: {
//         '@neurosity/notion': '4.2.5',
//         dotenv: '8.2.0'
//       },
//       license: 'MIT'
//     })
//   );
//
//   execSync(`${packageManager} install --silent`, {
//     cwd: tmpDir,
//     stdio: [0, 1, 2]
//   });
//
//   return tmpDir;
// }
