Sure, here's an updated README file with the additions you requested:

````markdown
# Project Name

![App Logo](link_to_logo)

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/travis/username/repo.svg)](https://travis-ci.org/username/repo)
[![Dependencies Status](https://img.shields.io/david/username/repo.svg)](https://david-dm.org/username/repo)
[![Test Coverage](https://img.shields.io/codecov/c/github/username/repo.svg)](https://codecov.io/gh/username/repo)

This project is a [brief description of your project].

## Requirements

Before running this project, ensure you have the following requirements:

- Node.js installed on your machine (vX.X.X)
- MongoDB installed and running on your system
- [Other dependencies, if any]

## Dependencies Installation

You can install dependencies using one of the following package managers:

### Using npm:

```bash
npm install
```
````

### Using Yarn:

```bash
yarn install
```

### Using pnpm:

```bash
pnpm install
```

## Starting the Project

To start the project in development mode, run the following command:

```bash
yarn start:dev
```

## Environment Variables

Ensure you have a `.env` file in the root directory of the project with the following variables:

```dotenv
PORT=8080
# Add other environment variables here
```

## Docker Compose (Optional)

You can also run the project using Docker Compose. Ensure you have Docker installed on your system.

To start the project with Docker Compose, run the following command:

```bash
docker-compose up
```

For more information on installing Docker Compose, refer to the [official installation guide](https://docs.docker.com/compose/install/).

## APIs

[API documentation link]

## Test Cases

To run test cases, use the following command:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## Contributors

- [Your Name](https://github.com/your-username)

Feel free to contribute by opening issues or creating pull requests. Any feedback is welcome!

```

Replace `[API documentation link]` with the link to your API documentation.

For badges, replace `username` and `repo` with your GitHub username and repository name, respectively. Ensure to replace `link_to_logo` with the link to your app logo.

This README includes badges for license, build status, dependencies status, and test coverage. It also includes sections for requirements, dependencies installation, starting the project, environment variables, Docker Compose, APIs, test cases, and contributors.
```
