import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import * as utility from '../utility.js';

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
        test: "test"
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
});