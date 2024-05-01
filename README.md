# Mastermind: Read the Computer's RAM 🤖

Mastermind is a game where a player tries to guess a combination of numbers. The computer gives feedback on the number of digits that are correct, and the number of digits in the correct position. The player has 10 chances to guess correctly.

## Run Locally

### Installing Node and NPM

Node is a server-side runtime environment for JavaScript, and Node Package Manager (npm) installs the dependencies to run the project. For this project, Node version 18.19.0 and npm version 10.2.3 were used. You can check which version you have with these two commands in your VSCode terminal for macOS:

```bash
  $ node -v
  $ npm -v
```

If these don't exist, then you can install Node and npm using Node Version Manager (nvm) which will allow you to set which versions of Node and NPM are used. You can check if your machine has nvm using the following command on macOS:

```bash
  $ nvm --version
```

Or for Windows:

```bash
  $ nvm version
```

If you don't have nvm, you can install it with the following command for macOS:

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Or for Windows, follow the instruction for nvm installation on their GitHub [here](https://github.com/coreybutler/nvm-windows).

You can install the latest version of Node for macOS using:

```bash
$ nvm install node
```

or, specifically, version 18.19.0 using this command:
```bash
$ nvm install 18.19.0
```

Then use the specific version of Node:
```bash
$ nvm use 18.19.0
```

When you install Node, it automatically installs the latest version of node package manager (npm).

Confirm you have installed nvm, node and npm with the following commands on macOS:

```bash
$ node -v
$ npm -v
$ nvm --version
```

### Cloning and Running Mastermind

A prerequisite for cloning this repository is having Git installed. Git can be installed with this [guide](https://github.com/git-guides/install-git).

Since this project is not deployed for production, you can run the game locally on your machine. If you are using VSCode, you can open the Explorer to a directory to which the project will be cloned, and then clone the repository using the following command in the terminal, which will create a folder named "mastermind" in the current working directory with the contents of the project inside:

```bash
$ git clone https://github.com/starfishpanda/mastermind.git
```

Navigate to the folder using:

```bash
$ cd mastermind
```

Install the dependencies with node package manager:
```bash
$ npm install
```

### Setting Up the Environment

In the project root folder, "mastermind", create a file called ".env" and add to it the following variables

```bash
DATABASE_URI=
SESSION_SECRET=
```

The `DATABASE_URI` is the URI given for your specific MongoDB instance and is how the application stores user information.  It will be stored securely on your local machine in the .env file. You can create a MongoDB instance on Atlas at this [link](https://www.mongodb.com/products/platform/atlas-database) for free and it will provide a URI for you based on your login information and a secure password you create.

The `SESSION_SECRET` is a secret alphanumeric passkey which will be used to create an express session ID on your MongoDB instance. It will be stored securely on your local machine in the .env file.

Once the environment is setup, you can start playing by running:
```bash
npm run dev
```
And navigating to the URL `http://localhost:8081/` in your browser.

## Running Tests
Some tests for fetching numbers and server routes, which are still a work in progress, can be run using:
```bash
npm test
```