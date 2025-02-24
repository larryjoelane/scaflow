import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Command } from 'commander';
import nunjucks from 'nunjucks';
import { createTemplateFiles, readYamlFiles, renderTemplates } from './utility.js';

const program = new Command();
program.option('-w, --wrap', 'wrap keywords in the output files');

program
    .requiredOption('-t, --templates <directory>', 'directory of template files')
    .requiredOption('-y, --yaml <directory>', 'directory of yaml files')
    .requiredOption('-o, --output <directory>', 'directory to output the rendered files');

program.parse(process.argv);

const options = program.opts();



// const debug = parseTerraformFiles(options.templates);
const yamlData = readYamlFiles(options.yaml);

if (options.wrap) {
    createTemplateFiles(options.templates, yamlData, options.output);
} else {
    renderTemplates(options.templates, yamlData, options.output);
}

