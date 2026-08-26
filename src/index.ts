import { validateConfig, config } from './config';
import { sendMessage } from './services/discord';
import { updateDns, createDns, getDnsData, getIp } from './services/cloudflareApi';

function log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

async function syncDns(isStartup = false): Promise<void> {
  try {
    const currentIp = await getIp();
    const dnsData = await getDnsData();

    if (!dnsData) {
      log(
        'INFO',
        `No '${config.cloudflare.dnsType}' record found for ${config.cloudflare.subdomain}. Creating record automatically on Cloudflare...`
      );
      await createDns(currentIp);

      await sendMessage(
        `>>> ## :plus: Registro DNS creado automáticamente: \`${config.cloudflare.subdomain}\` (${config.cloudflare.dnsType})\n` +
          `## :white_check_mark: IP asignada: \`${currentIp}\``
      );
      return;
    }

    const dnsIp = dnsData.content;

    log('INFO', `Current Public IP (${config.cloudflare.dnsType}): ${currentIp} | Cloudflare DNS IP: ${dnsIp}`);

    if (dnsIp !== currentIp) {
      log('INFO', `IP mismatch detected. Updating Cloudflare DNS record (${dnsIp} -> ${currentIp})...`);
      await updateDns(currentIp);

      await sendMessage(
        `>>> ## :arrows_counterclockwise: El servidor cambió de IP: \`${currentIp}\`\n` +
          `## :white_check_mark: \`${config.cloudflare.subdomain}\` (${config.cloudflare.dnsType}) actualizado correctamente`
      );
    } else {
      if (isStartup) {
        log('INFO', `DNS record (${config.cloudflare.dnsType}) is up to date (${currentIp}). No action required.`);
      }
    }
  } catch (error) {
    log('ERROR', `DNS sync failed: ${(error as Error).message}`);
  }
}

async function main(): Promise<void> {
  try {
    validateConfig();
    log('INFO', 'Starting Dynamic DNS Cloudflare service...');
    log('INFO', `Domain: ${config.cloudflare.domain} | Subdomain: ${config.cloudflare.subdomain} | Type: ${config.cloudflare.dnsType}`);
    log('INFO', `Check interval: ${config.cloudflare.updateIntervalMinutes} minutes`);

    await sendMessage('# :warning: El servidor se ha iniciado / reiniciado.');
    await syncDns(true);

    const timer = setInterval(() => {
      syncDns(false);
    }, config.cloudflare.updateIntervalMs);

    const shutdown = (signal: string) => {
      log('INFO', `Received ${signal}. Shutting down gracefully...`);
      clearInterval(timer);
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    log('ERROR', `Initialization error: ${(err as Error).message}`);
    process.exit(1);
  }
}

main();
