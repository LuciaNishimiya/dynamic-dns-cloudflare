export interface Config {
  cloudflare: {
    apiKey: string;
    domain: string;
    subdomain: string;
    dnsType: string;
    proxied: boolean;
    updateIntervalMinutes: number;
    updateIntervalMs: number;
  };
  discord: {
    webhookUrl?: string;
    botToken?: string;
    channelId?: string;
  };
}

function loadConfig(): Config {
  const apiKey = process.env.CLOUDFLARE_API_KEY?.trim() || ''; 
  const domain = process.env.CLOUDFLARE_DOMAIN?.trim() || '';
  const subdomain = process.env.CLOUDFLARE_SUBDOMAIN?.trim() || '';

  const dnsType = process.env.DNS_TYPE?.trim() || 'A';
  const proxied = process.env.DNS_PROXIED?.trim().toLowerCase() === 'true';

  const rawMinutes = parseInt(process.env.TIME_TO_UPDATE_DNS || '20', 10);
  const updateIntervalMinutes = isNaN(rawMinutes) || rawMinutes <= 0 ? 20 : rawMinutes;

  return {
    cloudflare: {
      apiKey,
      domain,
      subdomain,
      dnsType,
      proxied,
      updateIntervalMinutes,
      updateIntervalMs: updateIntervalMinutes * 60 * 1000,
    },
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL?.trim(),
      botToken: process.env.DISCORD_TOKEN?.trim(),
      channelId: process.env.DISCORD_CHANNEL_ID?.trim(),
    },
  };
}

export const config = loadConfig();

export function validateConfig(): void {
  const missing: string[] = [];
  if (!config.cloudflare.apiKey) missing.push('CLOUDFLARE_API_KEY');
  if (!config.cloudflare.domain) missing.push('CLOUDFLARE_DOMAIN');
  if (!config.cloudflare.subdomain) missing.push('CLOUDFLARE_SUBDOMAIN');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
