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


export function createTemplateFiles(templateDir, yamlData, outputDir) {
    const files = fs.readdirSync(templateDir);
    files.forEach(file => {
        const filePath = path.join(templateDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const nestedOutputDir = path.join(outputDir, file);
            if (!fs.existsSync(nestedOutputDir)) {
                fs.mkdirSync(nestedOutputDir, { recursive: true });
            }
            createTemplateFiles(filePath, yamlData, nestedOutputDir);
        } else {
            const content = fs.readFileSync(filePath, 'utf8');
            const rendered = wrapKeywords(content, yamlData.input);
            const outputFilePath = path.join(outputDir, file.replace('template.', ''));
            fs.writeFileSync(outputFilePath, rendered);
        }
    });
}


// if data is not flat, flatten it but name space the keys
export function flattenObject(ob, prefix = '', objectSeperator = '_') {
    let result = {};
    for (const i in ob) {
        if (typeof ob[i] === 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
            const temp = flattenObject(ob[i], prefix + i + objectSeperator);
            result = { ...result, ...temp };
        } else {
            result[prefix + i] = ob[i];
        }
    }
    return result;
}

export function readYamlFiles(directory) {
    const files = fs.readdirSync(directory);
    const data = {};
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const yamlData = yaml.load(content);
        data[path.basename(file, path.extname(file))] = yamlData

        const flattenedYamlData = flattenObject(yamlData);
        data[path.basename(file, path.extname(file))] = flattenedYamlData;
    });
    return data;
}

export function renderTemplates(templateDir, yamlData, outputDir) {
    const files = fs.readdirSync(templateDir);
    files.forEach(file => {
        const filePath = path.join(templateDir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const nestedOutputDir = path.join(outputDir, file);
            if (!fs.existsSync(nestedOutputDir)) {
                fs.mkdirSync(nestedOutputDir, { recursive: true });
            }
            renderTemplates(filePath, yamlData, nestedOutputDir);
        } else {
            const content = fs.readFileSync(filePath, 'utf8');
            const rendered = nunjucks.renderString(content, yamlData.input);
            const outputFilePath = path.join(outputDir, file.replace('template.', ''));
            fs.writeFileSync(outputFilePath, rendered);
        }
    });
}
