"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var child_process_1 = require("child_process");
// * PROGRAM START
// 1. CHECK FOR PROJECT NAME
var projectName = process.argv.slice(2).join('-');
if (projectName)
    createProject(projectName);
else
    console.log('Please provide a project name:\n\tcreate-node-project [directory] [project-name]');
function shellCommand(command, options) {
    return __awaiter(this, void 0, void 0, function () {
        var verboseMode;
        return __generator(this, function (_a) {
            options = options || {};
            if (options.verboseMode) {
                delete options.verboseMode;
                verboseMode = true;
            }
            return [2 /*return*/, new Promise(function (resolve) {
                    child_process_1.exec(command, options, function (error, stdout, stderr) {
                        if (error || stderr)
                            console.error(error, stderr);
                        if (verboseMode && stdout)
                            console.log(stdout);
                        resolve(stdout ? stdout : stderr);
                    });
                })];
        });
    });
}
function createProject(projectName) {
    return __awaiter(this, void 0, void 0, function () {
        function executeShellCommands(arrayOfCommands, options) {
            return __awaiter(this, void 0, void 0, function () {
                var i, _a, message, command, fn, verboseMode, projectDirectory;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = options || {};
                            i = 0;
                            _b.label = 1;
                        case 1:
                            if (!(i < arrayOfCommands.length)) return [3 /*break*/, 6];
                            _a = arrayOfCommands[i], message = _a.message, command = _a.command, fn = _a.fn, verboseMode = _a.verboseMode;
                            console.log("[" + (i + 1) + "/" + arrayOfCommands.length + "] " + message + "..."); // [1/7] Cloning Repo...
                            projectDirectory = path.resolve(__dirname, '../..', projectName);
                            if (!fn) return [3 /*break*/, 3];
                            return [4 /*yield*/, fn()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, shellCommand(command, {
                                cwd: projectDirectory,
                                verboseMode: options.verboseMode || verboseMode
                            })];
                        case 4:
                            _b.sent();
                            _b.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        function cloneRepo() {
            return __awaiter(this, void 0, void 0, function () {
                var workingDirectory;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            workingDirectory = path.resolve(__dirname, '../..');
                            return [4 /*yield*/, shellCommand("gh repo clone mattdanielmurphy/create-node-project " + projectName, { cwd: workingDirectory })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function getRemoveInstallerFilesCommand() {
            var installerFiles = ['src', 'package.json', 'yarn.lock', 'readme.md'];
            return "rm -r " + installerFiles.join(' ');
        }
        var commands;
        return __generator(this, function (_a) {
            commands = [
                {
                    message: "Cloning repo into folder '" + projectName + "'",
                    fn: cloneRepo
                },
                {
                    message: 'Removing installer files',
                    command: getRemoveInstallerFilesCommand()
                },
                // { message: 'Moving root files', command: 'mv project-root/* .; rm -r project-root' },
                {
                    message: 'Creating readme',
                    command: "touch readme.md; echo \"# " + projectName + "\" >> readme.md"
                },
                { message: 'Removing remote origin', command: 'git remote remove origin' },
                {
                    message: 'Creating GitHub repo',
                    command: "gh repo create " + projectName + " -y --public"
                },
                { message: 'Initializing yarn project', command: 'yarn init -y' },
                {
                    message: 'Pushing first commit',
                    command: 'git add .; git commit -m "initial commit"; git push -u origin main'
                },
                {
                    message: 'Making node_modules.nosync',
                    command: 'mkdir node_modules.nosync; ln -s node_modules.nosync node_modules'
                },
                {
                    message: 'Installing packages',
                    command: 'yarn'
                },
                {
                    message: 'Opening project folder in VS Code',
                    command: 'code .'
                },
            ];
            executeShellCommands(commands);
            return [2 /*return*/];
        });
    });
}
