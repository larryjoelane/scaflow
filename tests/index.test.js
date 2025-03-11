import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import * as utility from '../utility.js';
import os from 'node:os';
import fs from 'node:fs';

describe('utility.js readYamlFiles(pathToYamlFolder) tests', () => {

  it('should read YAML files', () => {
    const data = utility.readYamlFiles('tests/data');

    assert.deepStrictEqual(data,
      {
        heading: "Hello",
        paragraphText: "This is a web app template",
        title: "Example web app template",
        buttonText: "Click this button",
        alertText: "Hello World",
        test: "test",
        working_directory: "home\\\\ubuntu"
      }
    );
  });

  it('should flatten YAML objects one level deep, utility.flattenObject(object)', () => {
    const data = utility.flattenObject({
      html: {
        heading: "Hello",
        paragraphText: "This is a web app template",
        title: "Example web app template",
        buttonText: "Click this button",
        alertText: "Hello World",
      }
    });

    assert.deepStrictEqual(data,
      {
        html_heading: "Hello",
        html_paragraphText: "This is a web app template",
        html_title: "Example web app template",
        html_buttonText: "Click this button",
        html_alertText: "Hello World",
      }
    );
  });

  it('should flatten YAML objects one level deep with a custom seperator -- , utility.flattenObject(object,objectSeperator="--")', () => {
    const data = utility.flattenObject({
      prefix: '',
      objectSeperator: '--',
      html: {
        heading: "Hello",
        paragraphText: "This is a web app template",
        title: "Example web app template",
        buttonText: "Click this button",
        alertText: "Hello World"
      },
    });

    assert.deepStrictEqual(data,
      {
        "html--heading": "Hello",
        "html--paragraphText": "This is a web app template",
        "html--title": "Example web app template",
        "html--buttonText": "Click this button",
        "html--alertText": "Hello World"
      }
    );
  });

  it('should flatten YAML objects one level deep with a custom seperator . , utility.flattenObject(object,objectSeperator=".")', () => {
    const data = utility.flattenObject({
      prefix: '',
      objectSeperator: '.',
      html: {
        heading: "Hello",
        paragraphText: "This is a web app template",
        title: "Example web app template",
        buttonText: "Click this button",
        alertText: "Hello World"
      },
    });

    assert.deepStrictEqual(data,
      {
        "html.heading": "Hello",
        "html.paragraphText": "This is a web app template",
        "html.title": "Example web app template",
        "html.buttonText": "Click this button",
        "html.alertText": "Hello World"
      }
    );
  });

  // todo: write a better test for this
  // it('should return all the input directories and files, generateDirectoryStructure(inputDir, outputDir))', () => {
  //   const data = utility.generateDirectoryStructure('templates/mulesoft', 'templates/mulesoft');
  //   console.log(JSON.stringify(data, null, 2));

  //   fs.writeFileSync('tests/data.json', JSON.stringify(data, null, 2));

  //   const osType = os.type();

  //   // windows
  //   const paths = {
  //     "directories": [
  //       {
  //         "source": "templates\\mulesoft\\test\\test-nested",
  //         "dest": "templates\\mulesoft\\test\\test-nested",
  //         "files": [
  //           {
  //             "source": "templates\\mulesoft\\test\\test-nested\\index2.yml",
  //             "dest": "templates\\mulesoft\\test\\test-nested\\index2.yml"
  //           }
  //         ]
  //       },
  //       {
  //         "source": "templates\\mulesoft\\test",
  //         "dest": "templates\\mulesoft\\test",
  //         "files": [
  //           {
  //             "source": "templates\\mulesoft\\test\\index.yml",
  //             "dest": "templates\\mulesoft\\test\\index.yml"
  //           }
  //         ]
  //       },
  //       {
  //         "source": "templates/mulesoft",
  //         "dest": "templates/mulesoft",
  //         "files": [
  //           {
  //             "source": "templates\\mulesoft\\test.yml",
  //             "dest": "templates\\mulesoft\\test.yml"
  //           }
  //         ]
  //       }
  //     ]
  //   };

  //   if (osType === 'Linux') {
  //     paths.directories = paths.directories.map(dir => dir.replace(/\\/g, '/'));
  //     paths.files = paths.files.map(file => file.replace(/\\/g, '/'));
  //   }

  //   assert.deepStrictEqual(data,
  //     paths
  //   );
  // });

  it('should create a template with variable tokens, utility.wrapKeywords(text, data)', () => {
    const data = utility.readYamlFiles('tests/data');
    const input = "test Hello, This is a web app template, Example web app template, Click this button, Hello World, test, home\\\\ubuntu";
    const output = "{{test}} {{heading}}, {{paragraphText}}, {{title}}, {{buttonText}}, {{heading}} World, {{test}}, {{working_directory}}";
    const template = utility.wrapKeywords(input, data);

    assert.deepStrictEqual(template,
      output
    );
  });

  it('should escape regular expression characters, utility.escapeRegex(text)', () => {
    const input = "Hello, This is a web app template, Example web app template, Click this button, Hello World, test, home/ubuntu, user\home";
    const output = "Hello, This is a web app template, Example web app template, Click this button, Hello World, test, home\/ubuntu, userhome";
    const escaped = utility.escapeRegex(input);

    assert.deepStrictEqual(escaped,
      output
    );
  });


});