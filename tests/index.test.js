import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import * as utility from '../utility.js';

describe('utility.js tests', () => {

  it('should read YAML files', () => {
    const data = utility.readYamlFiles('tests/data');

    assert.deepStrictEqual(data, {
      input: {
        heading: "Hello",
        paragraphText: "This is a web app template",
        title: "Example web app template",
        buttonText: "Click this button",
        alertText: "Hello World",
      }
    });
  });
});