#!/usr/bin/env node

import { Command } from 'commander';
import { readYamlFiles, renderTemplates, generateDirectoryStructure } from './utility.js';

const program = new Command();
program.option('-w, --wrap', 'wrap keywords in the output files');

program
    .requiredOption('-t, --templates <directory>', 'directory of template files')
    .requiredOption('-y, --yaml <directory>', 'directory of yaml files')
    .requiredOption('-o, --output <directory>', 'directory to output the rendered files');

program.parse(process.argv);

const options = program.opts();

let yamlData = {};

if (options.wrap) {
    yamlData = readYamlFiles(options.yaml, true);
} else {
    yamlData = readYamlFiles(options.yaml, false);
}

const currentDirectory = process.cwd();
console.log(currentDirectory);
process.chdir(currentDirectory);

if (options.wrap) {
    renderTemplates(options.templates, yamlData, options.output, true);
} else {
    renderTemplates(options.templates, yamlData, options.output, false);
}

