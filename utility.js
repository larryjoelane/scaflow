import fs from 'fs';
import yaml from 'js-yaml';
import nunjucks from 'nunjucks';
import path from 'path';
import os from 'os';

export function wrapKeywords(text, data) {
    for (const [key, value] of Object.entries(data)) {
        const escapedValue = escapeRegex(value);
        const regex = new RegExp(`\\b${escapedValue}\\b`, 'g');
        text = text.replace(regex, `{{${key}}}`);
    }
    return text;
}

export function escapeRegex(string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function flattenObject({ prefix = '', objectSeperator = '_', ...ob } = {}) {
    let result = {};
    for (const i in ob) {
        if (typeof ob[i] === 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
            const temp = flattenObject({ ...ob[i], prefix: prefix + i + objectSeperator, objectSeperator });
            result = { ...result, ...temp };
        } else {
            result[prefix + i] = ob[i];
        }
    }
    return result;
}

export function readYamlFiles(directory, canEscapeRegex) {
    const files = fs.readdirSync(directory);
    let yamlData = {};
    let data = {};
    files.forEach(file => {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let escapeContent = content.replaceAll("\\", "\\\\");

        yamlData = yaml.load(escapeContent);

        const flattenedYamlData = flattenObject(yamlData);
        data = { ...data, ...flattenedYamlData };
    });
    return data;
}

export function getOutputDirectories(outputDir) {
    return path.resolve(outputDir);
}

export function generateDirectoryStructure(inputDir, outputDir) {
    const structure = { directories: [] };

    function walkDirectory(currentInputDir, currentOutputDir) {
        const entries = fs.readdirSync(currentInputDir, { withFileTypes: true });
        const directory = { source: currentInputDir, dest: currentOutputDir, files: [] };

        for (const entry of entries) {
            const inputPath = path.join(currentInputDir, entry.name);
            const outputPath = path.join(currentOutputDir, entry.name);

            if (entry.isDirectory()) {
                walkDirectory(inputPath, outputPath);
            } else if (entry.isFile()) {
                directory.files.push({ source: inputPath, dest: outputPath });
            }
        }

        structure.directories.push(directory);
    }

    walkDirectory(inputDir, outputDir);
    return structure;
}


export function renderTemplates(templateDir, templateData, outputDir, createTemplates) {

    const plaftform = os.platform();

    let pathSeparator = '';

    if (plaftform === 'win32') {
        pathSeparator = '\\';
    } else {
        pathSeparator = '/';
    }

    const cleanTemplateData = modifyObjectValues(templateData, excapeBackSlash);
    const directories = generateDirectoryStructure(templateDir, outputDir).directories;

    directories.forEach(dir => {
        if (!fs.existsSync(dir.dest)) {
            fs.mkdirSync(dir.dest, { recursive: true });
        }

        dir.files.forEach(file => {
            let rendered = null;
            const content = fs.readFileSync(file.source, 'utf8');
            if (createTemplates) {
                rendered = wrapKeywords(content, cleanTemplateData);
            } else {
                rendered = nunjucks.renderString(content, cleanTemplateData);
            }
            fs.writeFileSync(file.dest, unencodeBackSlash(rendered));
        });
    });
}

function modifyObjectValues(obj, modificationFunction) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            obj[key] = modificationFunction(obj[key]);
        }
    }
    return obj;
}

function excapeBackSlash(value) {
    return value.replaceAll("\\", "\\\\");
}

function unencodeBackSlash(value) {
    return value.replaceAll("&#92;", "\\");
}
