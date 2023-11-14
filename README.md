# Dynamic IP Updater for Cloudflare Domains.

This project provides a simple solution to automatically update dynamic IP addresses associated with your domain's DNS records on Cloudflare. Additionally, it includes the ability to send messages to Discord when the server restarts or changes its IP. It's useful for keeping the server's IP up-to-date when it changes dynamically.

## Features

- Automatically updates the server's IP address in Cloudflare DNS records.
- Sends notifications to Discord when the server restarts or changes its IP.

## Requirements

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Cloudflare API Credentials](https://developers.cloudflare.com/api)
- Discord Bot Token.

## Configuration

 Clone this repository:

```bash
git clone https://github.com/LuciaNishimiya/dynamic-dns-cloudflare.git
cd dynamic-dns-cloudflare
```

 Install dependencies:
```bash
npm install
```

 Copy and rename the .env.example file.

 Open the .env file in a text editor and provide the required information.

# Usage

```bash
npm run start
```