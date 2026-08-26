import { config } from '../../config';

export type IpVersion = 'v4' | 'v6' | 'A' | 'AAAA';

function isIPv4(ip: string): boolean {
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip);
}

function isIPv6(ip: string): boolean {
  return ip.includes(':');
}

function parseCloudflareTrace(text: string): string | null {
  const match = text.match(/ip=([^\s]+)/);
  return match && match[1] ? match[1].trim() : null;
}

export async function getIp(version?: IpVersion): Promise<string> {
  const targetVersion = (version || config.cloudflare.dnsType || 'A').toUpperCase();
  const isV6Target = targetVersion === 'V6' || targetVersion === 'AAAA';

  // Cloudflare infrastructure trace endpoints with valid TLS certificates
  const cloudflareEndpoints = isV6Target
    ? [
        'https://one.one.one.one/cdn-cgi/trace',
        'https://cloudflare.com/cdn-cgi/trace',
        'https://api.cloudflare.com/cdn-cgi/trace',
      ]
    : [
        'https://1.1.1.1/cdn-cgi/trace',
        'https://1.0.0.1/cdn-cgi/trace',
        'https://one.one.one.one/cdn-cgi/trace',
        'https://api.cloudflare.com/cdn-cgi/trace',
      ];

  const validateIp = (ip: string): boolean => {
    return isV6Target ? isIPv6(ip) : isIPv4(ip);
  };

  for (const url of cloudflareEndpoints) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        const extractedIp = parseCloudflareTrace(text);
        if (extractedIp && validateIp(extractedIp)) {
          return extractedIp;
        }
      }
    } catch (err) {
      console.warn(
        `Cloudflare ${isV6Target ? 'IPv6' : 'IPv4'} lookup failed (${url}): ${(err as Error).message}`
      );
    }
  }

  throw new Error(
    `Unable to retrieve public ${isV6Target ? 'IPv6' : 'IPv4'} address directly from Cloudflare servers.`
  );
}


