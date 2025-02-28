import fs from 'fs';
import yaml from 'js-yaml';
import nunjucks from 'nunjucks';
import path from 'path';

export function wrapKeywords(text, data) {
    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`\\b${value}\\b`, 'g');
        text = text.replace(regex, `{{${key}}}`);
    }
    return text;
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

export function readYamlFiles(directory) {
    const files = fs.readdirSync(directory);
    let data = {};
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const yamlData = yaml.load(content);
        const flattenedYamlData = flattenObject(yamlData);
        data = { ...data, ...flattenedYamlData };
    });
    return data;
}

// todo: refactor this to make it easier to test
export function renderTemplates(templateDir, templateData, outputDir, createTemplates) {
    const directory = fs.readdirSync(templateDir);
    const files = [];
    const directories = [];

    directory.forEach(file => {
        const filePath = path.resolve(templateDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const nestedOutputDir = path.resolve(outputDir, file);
            directories.push(nestedOutputDir);
            if (!fs.existsSync(nestedOutputDir)) {
                fs.mkdirSync(nestedOutputDir, { recursive: true });
            }
            renderTemplates(filePath, templateData, nestedOutputDir, createTemplates);
        }

        if (stat.isFile()) {
            files.push(file);
        }
    });

    files.forEach(file => {
        let rendered = null;
        const filePath = path.resolve(templateDir, file);
        const outputFilePath = path.resolve(outputDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        if (createTemplates) {
            rendered = wrapKeywords(content, templateData);
        } else {
            rendered = nunjucks.renderString(content, templateData);
        }
        fs.writeFileSync(outputFilePath, rendered);
    });
}
