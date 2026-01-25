import inquirer from 'inquirer';
import open from 'open';
import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(__dirname, 'projects.json');

// Load Projects
async function loadProjects() {
    try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red(`Error loading projects.json: ${error.message}`));
        return [];
    }
}

async function main() {
    console.log(chalk.bold.magenta('\n🚀 Dev-Launcher: Context Switcher\n'));

    const projects = await loadProjects();

    if (projects.length === 0) {
        console.log(chalk.yellow('No projects found in projects.json'));
        return;
    }

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'project',
            message: 'Which project are you working on?',
            choices: projects.map(p => p.name)
        }
    ]);

    const selectedProject = projects.find(p => p.name === answer.project);

    if (!selectedProject) return;

    console.log(chalk.green(`\nSwitching to: ${selectedProject.name}...\n`));

    // 1. Open Editor
    if (selectedProject.editorCommand) {
        console.log(chalk.blue(`> Opening Editor (${selectedProject.editorCommand})...`));
        exec(selectedProject.editorCommand, { cwd: selectedProject.path }, (err) => {
            if (err) console.error(chalk.red(`Failed to open editor: ${err.message}`));
        });
    }

    // 2. Open URLs
    if (selectedProject.urls && selectedProject.urls.length > 0) {
        console.log(chalk.blue(`> Opening ${selectedProject.urls.length} Tabs...`));
        for (const url of selectedProject.urls) {
            await open(url);
        }
    }

    // 3. Run Scripts (in new terminal windows)
    if (selectedProject.scripts && selectedProject.scripts.length > 0) {
        console.log(chalk.blue(`> Starting Terminal Scripts...`));
        for (const script of selectedProject.scripts) {
            // Windows-specific: using 'start' to open a new cmd/powershell window
            // syntax: start "Title" cmd /k "command"
            const command = `start "${selectedProject.name} - ${script}" cmd /k "cd /d ${selectedProject.path} && ${script}"`;
            exec(command);
        }
    }

    console.log(chalk.bold.green('\nDone! Happy Coding! 💻\n'));

    // Keep window open briefly so user sees checks
    await new Promise(r => setTimeout(r, 2000));
}

main();
