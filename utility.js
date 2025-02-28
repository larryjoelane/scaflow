import fs from 'fs';
import yaml from 'js-yaml';
import nunjucks from 'nunjucks';
import path from 'path';
import { fileURLToPath } from 'url';

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

export function getOutputDirectories(outputDir) {
    return path.resolve(outputDir);
}

export function walkDir(dirPath, fileList = [], dirList = []) {
    try {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                dirList.push(fullPath);
                walkDir(fullPath, fileList, dirList); // Recursive call for subdirectories
            } else if (entry.isFile()) {
                fileList.push(fullPath);
            }
        }
    } catch (err) {
        console.error("Error reading directory:", err);
    }

    return { files: fileList, directories: dirList };
}

export function renderTemplates(templateDir, templateData, outputDir, createTemplates) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const currentInputPath = path.join(__dirname, templateDir);
    const currentOutputPath = getOutputDirectories(outputDir);

    const directories = walkDir(currentInputPath)
        .directories.map(dir => ({
            input: dir,
            output: dir.replace(currentInputPath, currentOutputPath)
        }));
    const files = walkDir(currentInputPath)
        .files.map(file => ({
            input: file,
            output: file.replace(currentInputPath, currentOutputPath)
        }));

    directories.forEach(dir => {
        if (!fs.existsSync(dir.output)) {
            fs.mkdirSync(dir.output, { recursive: true });
        }
    });

    files.forEach(file => {
        let rendered = null;
        const content = fs.readFileSync(file.input, 'utf8');
        if (createTemplates) {
            rendered = wrapKeywords(content, templateData);
        } else {
            rendered = nunjucks.renderString(content, templateData);
        }
        fs.writeFileSync(file.output, rendered);
    });
}
