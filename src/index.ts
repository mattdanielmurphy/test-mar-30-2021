import * as path from 'path'

import { exec } from 'child_process'

// * PROGRAM START

// 1. CHECK FOR PROJECT NAME

const projectName = process.argv.slice(2).join('-')

if (projectName) createProject(projectName)
else
	console.log(
		'Please provide a project name:\n\tcreate-node-project [directory] [project-name]',
	)

// FUNCTIONS

interface Options {
	[key: string]: unknown
}

async function shellCommand(command, options?: Options) {
	options = options || {}

	let verboseMode
	if (options.verboseMode) {
		delete options.verboseMode
		verboseMode = true
	}

	return new Promise((resolve) => {
		exec(command, options, (error, stdout, stderr) => {
			if (error || stderr) console.error(error, stderr)
			if (verboseMode && stdout) console.log(stdout)
			resolve(stdout ? stdout : stderr)
		})
	})
}

async function createProject(projectName) {
	async function executeShellCommands(arrayOfCommands, options?: Options) {
		options = options || {}
		for (let i = 0; i < arrayOfCommands.length; i++) {
			const { message, command, fn, verboseMode } = arrayOfCommands[i]

			console.log(`[${i + 1}/${arrayOfCommands.length}] ${message}...`) // [1/7] Cloning Repo...

			const projectDirectory = path.resolve(__dirname, '../..', projectName)

			if (fn) {
				await fn()
			} else {
				await shellCommand(command, {
					cwd: projectDirectory,
					verboseMode: options.verboseMode || verboseMode,
				})
			}
		}
	}

	async function cloneRepo() {
		const workingDirectory = path.resolve(__dirname, '../..')
		await shellCommand(
			`gh repo clone mattdanielmurphy/create-node-project ${projectName}`,
			{ cwd: workingDirectory },
		)
	}

	function getRemoveInstallerFilesCommand() {
		const installerFiles = ['src', 'package.json', 'yarn.lock', 'readme.md']
		return `rm -r ${installerFiles.join(' ')}`
	}

	const commands = [
		{
			message: `Cloning repo into folder '${projectName}'`,
			fn: cloneRepo,
		},
		{
			message: 'Removing installer files',
			command: getRemoveInstallerFilesCommand(),
		},
		// { message: 'Moving root files', command: 'mv project-root/* .; rm -r project-root' },
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
			message: 'Installing packages',
			command: 'yarn',
		},
		{
			message: 'Opening project folder in VS Code',
			command: 'code .',
		},
	]

	executeShellCommands(commands)
}
