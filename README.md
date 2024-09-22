
# CMS Project

This is a CMS (Content Management System) built using Next.js for Coconut Pudding Project, `pnpm` as the package manager, and MUI (Material-UI) for the UI components. The project follows a CI/CD pipeline using GitHub Actions for pull request approvals to the development and master branches.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [GitHub Actions](#github-actions)
- [Contributing](#contributing)
- [License](#license)

## Features
- Modern CMS site built with Next.js
- Styled using Material-UI (MUI)
- CI/CD pipeline with GitHub Actions
- Efficient package management with `pnpm`
- Pull request approval workflows

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **UI Library**: [MUI](https://mui.com/)
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites
- Node.js (>= 16.x)
- `pnpm` (Installation: `npm install -g pnpm`)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/doni404/coding-cms-nextjs.git
   cd your-repo
   ```
2. Install dependencies using `pnpm`:
   ```bash
   pnpm install
   ```

### Development
To start the development server, run:
```bash
pnpm dev
```
The project will be available at `http://localhost:7002`.

### Building for Production
To build the project for production, run:
```bash
pnpm build
```
You can then start the production server with:
```bash
pnpm start
```
The project will be available at `http://localhost:7000`.

## GitHub Actions
This project uses GitHub Actions for CI/CD with the following workflow:
- Pull requests to the `development` and `master` branches require approval.
- The `development` branch is for ongoing work, while the `master` branch is for production-ready code.

### Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes using [Conventional Commits](https://www.conventionalcommits.org/).
3. Push your branch and open a pull request to the `development` branch.
4. Upon approval, merge into `development`.
5. When ready for production, open a pull request from `development` to `master`.

### CI/CD Configuration
The workflow file `.github/workflows/dev.yml` manages the following tasks:
- Checks out the repository code using actions/checkout.
- Copies the private key and connects to the server.
- Switches to the development branch on the EC2 instance.
- Pulls the latest code from the development branch.
- Installs dependencies using pnpm install --frozen-lockfile.
- Checks if the application is already running with PM2:
If running, it restarts the app.
If not, it starts the app using pm2.

The workflow utilizes GitHub Secrets to store sensitive information:
PRIVATE_KEY: The SSH private key used to connect to the EC2 instance.
HOSTNAME: The hostname of the EC2 instance.
USER: The SSH username for the EC2 instance.

You can find the workflow configuration in `.github/workflows/dev.yml`

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License
This project is licensed under the [MIT License](LICENSE).
