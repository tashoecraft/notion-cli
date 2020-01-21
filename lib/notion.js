"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var child_process_1 = require("child_process");
var inquirer_1 = require("inquirer");
var utilities_1 = require("@cli/utilities");
var packageManager = determinePackageManager();
var ProjectTypes;
(function (ProjectTypes) {
    ProjectTypes["Node"] = "node";
    ProjectTypes["Browser"] = "browser";
})(ProjectTypes || (ProjectTypes = {}));
function determinePackageManager() {
    var packageManager = 'npm';
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
function isPackageManagerInstalled(packageManager) {
    var isInstalled = false;
    try {
        child_process_1.execSync(packageManager + " --version", {
            stdio: ['ignore', 'ignore', 'ignore']
        });
        isInstalled = true;
    }
    catch (e) {
        /* do nothing */
    }
    return isInstalled;
}
function determineWorkspaceName(parsedArgs) {
    var workspaceName = parsedArgs._[2];
    if (workspaceName) {
        return Promise.resolve(workspaceName);
    }
    return inquirer_1.inquirer
        .prompt([
        {
            name: 'ProjectName',
            message: "Project name (e.g., First_Notion_App)    ",
            type: 'string'
        }
    ])
        .then(function (a) {
        if (!a.WorkspaceName) {
            utilities_1.output.error({
                title: 'Invalid project name',
                bodyLines: ["Project name cannot be empty"]
            });
            process.exit(1);
        }
        return a.WorkspaceName;
    });
}
function determineProject(parsedArgs) {
    if (parsedArgs.preset) {
        if (Object.values(ProjectTypes).indexOf(parsedArgs.preset) === -1) {
            utilities_1.output.error({
                title: 'Invalid projcet type',
                bodyLines: __spreadArrays([
                    "It must be one of the following:",
                    ''
                ], Object.values(ProjectTypes))
            });
            process.exit(1);
        }
        else {
            return Promise.resolve(parsedArgs.preset);
        }
    }
    return inquirer_1.inquirer
        .prompt([
        {
            name: 'Project',
            message: "What type of project would you like to create?",
            "default": 'empty',
            type: 'list',
            choices: ProjectTypes
        }
    ])
        .then(function (a) { return a.Preset; });
}
function createSandbox(packageManager, cli) {
    var cwd = process.cwd();
    var _a = child_process_1.spawnSync('npm', ['init'], {
        stdio: 'pipe',
        shell: true,
        encoding: 'utf8',
        cwd: cwd
    }), status = _a.status, stderr = _a.stderr, stdout = _a.stdout, error = _a.error;
    if (status !== 0) {
        var errorMessage = ((error && error.message) ||
            stderr ||
            stdout ||
            '').trim();
        if (errorMessage) {
            errorMessage += '\n';
        }
        throw new Error(errorMessage +
            ("Package install failed" + (errorMessage ? ', see above' : '') + "."));
    }
    logger.info(colors.green("Installed packages for tooling via " + packageManager + "."));
    var tmpDir = dirSync().name;
    writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({
        dependencies: {
            '@neurosity/notion': '4.2.5',
            dotenv: '8.2.0'
        },
        license: 'MIT'
    }));
    child_process_1.execSync(packageManager + " install --silent", {
        cwd: tmpDir,
        stdio: [0, 1, 2]
    });
    return tmpDir;
}
