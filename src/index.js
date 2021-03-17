#!/usr/bin/env node

// Imports
const { exec } = require('child_process')
const path = require('path')
const chalk = require('chalk')

// * PROGRAM START *

// 1. CHECK FOR PROJECT NAME

const projectName = process.argv.slice(2).join('-')

if (projectName) createProject(projectName)
else
	logError(
		'Please provide a project name:\n\tcreate-node-project [directory] [project-name]',
	)

// FUNCTIONS

function log() {
	return console.log
}
function logError(message) {
	log(chalk.bold.red(message))
}
function execLog(message) {
	log(chalk.yellow(message))
}

function shell(command, options = {}) {
	let verboseMode
	if (options.verboseMode) {
		delete options.verboseMode
		verboseMode = true
	}
	return new Promise((resolve, reject) => {
		exec(command, options, (error, stdout, stderr) => {
			if (error) logError(error)
			if (verboseMode && stdout) {
				log(chalk.bold(`[${command}]`))
				execLog(stdout)
			}
			resolve(stdout ? stdout : stderr)
		})
	})
}

async function createProject(projectName) {
	async function cloneRepo() {
		const workingDirectory = path.resolve(__dirname, '../..')
		const projectDirectory = path.resolve(projectName)
		return await shell(
			`gh repo clone mattdanielmurphy/create-node-project ${projectName}`,
			{ cwd: workingDirectory },
		)
	}

	function removeInstallerFiles() {
		const installerFiles = ['src', 'package.json', 'yarn.lock', 'readme.md']
		return `rm -r ${installerFiles.join(' ')}`
	}

	async function executeShellCommands(arrayOfCommands) {
		for (let i = 0; i < arrayOfCommands.length; i++) {
			const { message, command, fn, verboseMode } = arrayOfCommands[i]

			log(`[${i + 1}/${arrayOfCommands.length}] ${message}...`) // [1/7] Cloning Repo...

			const projectDirectory = path.resolve(__dirname, '../..', projectName)

			if (fn) {
				await fn()
			} else {
				await shell(command, {
					cwd: projectDirectory,
					verboseMode,
				})
			}
		}
	}

	const commands = [
		{
			message: `Cloning repo into folder '${projectName}'`,
			fn: cloneRepo,
		},
		{ message: 'Removing installer files', command: removeInstallerFiles() },
		{
			message: 'Creating readme',
			command: `touch readme.md; echo "# ${projectName}" >> readme.md`,
		},
		{ message: 'Removing remote origin', command: 'git remote remove origin' },
		{
			message: 'Creating GitHub repo',
			command: `gh repo create ${projectName} -y --public`,
		},
		{ message: 'Initializing yarn project', command: 'yarn init -y' },
		{
			message: 'Pushing first commit',
			command:
				'git add .; git commit -m "initial commit"; git push -u origin main',
		},
		{
			message: 'Making node_modules.nosync',
			command:
				'mkdir node_modules.nosync; ln -s node_modules.nosync node_modules',
		},
		{
			message: 'Opening project folder in VS Code',
			command: 'code .',
		},
	]

	executeShellCommands(commands)
}
