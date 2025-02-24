# templatizer
Scaffold your projects using your own templates

## Installation

To install `templatizer`, you can use `npm`:

```sh
npm install -g templatizer
```
## Usage

To create a new project using a template, run:

**Create templates based on your input variables.**
```sh
templatizer --wrap -t <path-to-templates> -y <path-to-folder-with-yaml-files> -o <output-directory-path>
```
**Scaffold new projects based on your templates and input variables.**
```sh
templatizer -t <path-to-templates> -y <path-to-folder-with-yaml-files> -o <output-directory-path>
```
**Example input YAML files can be found [here](https://github.com/larryjoelane/templatizer/tree/main/variables.webapp).**

**Example templates can be found [here](https://github.com/larryjoelane/templatizer/tree/main/templates/webapp/assets).**


## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub. Please make sure you includes tests in the tests folder.

## License

This project is licensed under the MIT License.
