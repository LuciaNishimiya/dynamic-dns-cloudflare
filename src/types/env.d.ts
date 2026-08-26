declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLOUDFLARE_API_KEY?: string;
      CLOUDFLARE_DOMAIN?: string;
      CLOUDFLARE_SUBDOMAIN?: string;
      DNS_TYPE?: string;
      DNS_PROXIED?: string;
      TIME_TO_UPDATE_DNS?: string;
      DISCORD_TOKEN?: string;
      DISCORD_CHANNEL_ID?: string;
      DISCORD_WEBHOOK_URL?: string;
    }
  }

  var process: {
    on(arg0: string, arg1: () => void): unknown;
    exit(arg0: number): unknown;
    env: NodeJS.ProcessEnv;
  };
}

export {};

