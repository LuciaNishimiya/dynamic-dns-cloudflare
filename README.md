# ⚡ Dynamic DNS Cloudflare

A fast, reliable, and lightweight Dynamic DNS (DDNS) updater service for Cloudflare domains with integrated Discord notifications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-black.svg)](https://bun.sh)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- **⚡ IPv4 & IPv6 Support**: Easily switch between `A` (IPv4) and `AAAA` (IPv6) record types via `DNS_TYPE`.
- **🔒 100% Cloudflare Infrastructure**: Fetches public IP directly from Cloudflare's Anycast infrastructure without relying on third-party IP lookup services.
- **🛠️ Automatic DNS Record Creation**: Automatically creates missing `A` or `AAAA` records in Cloudflare if they don't already exist.
- **🔔 Discord Notifications**: Flexible alert system supporting both **Discord Webhooks** and **Discord Bot Tokens**.
- **⏱️ Configurable Intervals**: Custom check interval for DNS status synchronization.
- **🛡️ Type-Safe Architecture**: Written from the ground up in strict TypeScript for optimal performance and reliability with **Bun** or **Node.js**.

---

## 📋 Requirements

- **Bun** (recommended) or **Node.js** v18+
- A domain managed on **Cloudflare**
- A **Cloudflare API Token** (with `Zone.DNS` edit permissions)
- *(Optional)* A **Discord Webhook URL** or **Bot Token** for notifications

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/LuciaNishimiya/dynamic-dns-cloudflare.git
cd dynamic-dns-cloudflare
```

### 2. Install dependencies

Using **Bun**:
```bash
bun install
```

Or using **npm**:
```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to create your local `.env` configuration file:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `CLOUDFLARE_API_KEY` | **Yes** | - | Cloudflare API Token (`Zone.DNS` edit permissions) |
| `CLOUDFLARE_DOMAIN` | **Yes** | - | Main domain name on Cloudflare (e.g. `example.com`) |
| `CLOUDFLARE_SUBDOMAIN` | **Yes** | - | Subdomain FQDN (e.g. `mc.example.com` or `example.com`) |
| `DNS_TYPE` | No | `A` | DNS record type: `A` (IPv4) or `AAAA` (IPv6) |
| `DNS_PROXIED` | No | `false` | Enable Cloudflare proxy (`true` / `false`) |
| `TIME_TO_UPDATE_DNS` | No | `20` | Check interval in minutes |
| `DISCORD_WEBHOOK_URL` | No | - | Discord Webhook URL for status notifications |
| `DISCORD_TOKEN` | No | - | Discord Bot Token *(Alternative to Webhook)* |
| `DISCORD_CHANNEL_ID` | No | - | Discord Channel ID *(Used with Bot Token)* |

---

## 🏃 Running the Service

### Development Mode (with Watch Mode)

```bash
bun run dev
```

### Production Mode

Using **Bun**:
```bash
bun run start
```

Using **Node.js**:
```bash
npm run start
```

### Type Checking

```bash
bun run typecheck
```

---

## 🛠️ How It Works

1. **IP Retrieval**: Requests your public IPv4 or IPv6 address using Cloudflare's Anycast trace endpoints (`https://one.one.one.one/cdn-cgi/trace`).
2. **DNS Check**: Queries your Cloudflare zone for the record matching `CLOUDFLARE_SUBDOMAIN` and `DNS_TYPE`.
3. **Auto-Creation / Sync**: 
   - If the record does not exist on Cloudflare, it creates a new record automatically.
   - If the current IP differs from Cloudflare's DNS record, it updates the record.
4. **Discord Alert**: Sends rich notification messages to your Discord channel whenever the IP changes or the service starts up.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.