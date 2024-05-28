# Ways CLI Tool

## Overview

**Ways** is a simple CLI tool for generating project structures effortlessly. It provides commands to initialize and build projects, making it easier for developers to get started quickly.

## Installation

To install Ways, you can use npm:

```bash
npm install -g ways
```

## Usage

After installation, you can use the `ways` command followed by options or commands.

```bash
ways [options] [command]
```

## Options

- `-V, --version`  
  Output the version number of the Ways CLI tool.

- `-h, --help`  
  Display help for the Ways CLI tool.

## Commands

- `init`  
  Initialize a new project.

- `build`  
  Build the project.

- `help [command]`  
  Display help for a specific command.

## Examples

### Display Version

To display the version of the Ways CLI tool, use:

```bash
ways --version
```

### Display Help

To display help information for the Ways CLI tool, use:

```bash
ways --help
```

### Initialize a New Project

To initialize a new project, use:

```bash
ways init
```

This command generates a default structure that will guide the build process:

```json
[
  {
    "templates": [
      "hello"
    ],
    "options": [
      {
        "name": "world"
      }
    ]
  }
]
```

- **templates**: Lists the templates that will be used to generate the code.
- **options**: Contains the variables that will be substituted in the templates.

### Build a Project

To build the project, use:

```bash
ways build
```

### Help for Specific Command

To display help information for a specific command, use:

```bash
ways help [command]
```

For example, to get help for the `init` command:

```bash
ways help init
```

## Custom Templates

You can create your own templates to use with the Ways CLI tool. To do this, create a directory named `.ways` in your home directory. Inside this directory, create subdirectories with the names of your templates, and place the files that each template will generate in these subdirectories.

For example, on a Unix-based system:

```bash
mkdir -p ~/.ways/my-template
cd ~/.ways/my-template
# Add your template files here
```

When you use the `ways init` command, it will look for templates in the `~/.ways` directory and use them to initialize your project.

## Contributing

If you would like to contribute to the Ways CLI tool, please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Feel free to further customize this README to fit any additional details or features of your CLI tool.
