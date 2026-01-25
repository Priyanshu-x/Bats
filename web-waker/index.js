import fs from 'fs';
import fetch from 'node-fetch';
import chalk from 'chalk';

const SITES_FILE = 'sites.json';

async function loadSites() {
  try {
    const data = fs.readFileSync(SITES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red(`Error reading ${SITES_FILE}: ${error.message}`));
    return [];
  }
}

async function pingSite(url) {
  const startTime = Date.now();
  try {
    const response = await fetch(url);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.ok) {
      console.log(
        chalk.green(`[SUCCESS]`) + 
        ` ${url} ` + 
        chalk.gray(`(${response.status}) - ${duration}ms`)
      );
    } else {
      console.log(
        chalk.yellow(`[WARNING]`) + 
        ` ${url} ` + 
        chalk.gray(`(${response.status}) - ${duration}ms`)
      );
    }
  } catch (error) {
    console.log(
      chalk.red(`[ERROR]`) + 
      ` ${url} ` + 
      chalk.gray(`- ${error.message}`)
    );
  }
}

async function main() {
  console.log(chalk.bold.blue(`\nStarting Ping Tool...`));
  console.log(chalk.gray(`Time: ${new Date().toLocaleString()}\n`));

  const sites = await loadSites();

  if (sites.length === 0) {
    console.log(chalk.yellow('No sites found in sites.json'));
    return;
  }

  // Ping all sites in parallel
  await Promise.all(sites.map(site => pingSite(site)));

  console.log(chalk.bold.blue(`\nDone!`));
}

main();
