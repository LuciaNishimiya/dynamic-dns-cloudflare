import { config } from '../../config';
import { cloudflareFetch } from './client';
import { CloudflareZone, DnsRecord } from '../../types/cloudflare';

let cachedZoneId: string | null = null;
let cachedRecordId: string | null = null;

export async function getZoneId(): Promise<string> {
  if (cachedZoneId) {
    return cachedZoneId;
  }

  const domain = config.cloudflare.domain;
  if (!domain) {
    throw new Error('CLOUDFLARE_DOMAIN is not configured.');
  }

  const endpoint = `/zones?name=${encodeURIComponent(domain)}`;
  const zones = await cloudflareFetch<CloudflareZone[]>(endpoint);

  const zone = zones[0];
  if (!zone || !zone.id) {
    throw new Error(`No zone ID found for domain: ${domain}`);
  }

  console.log(`Zone ID successfully retrieved for ${domain}: ${zone.id}`);
  cachedZoneId = zone.id;
  return zone.id;
}

export async function getRecordId(): Promise<string> {
  if (cachedRecordId) {
    return cachedRecordId;
  }

  const zoneId = await getZoneId();
  const subdomain = config.cloudflare.subdomain;
  const targetType = config.cloudflare.dnsType.toUpperCase();

  if (!subdomain) {
    throw new Error('CLOUDFLARE_SUBDOMAIN is not configured.');
  }

  const endpoint = `/zones/${zoneId}/dns_records?name=${encodeURIComponent(subdomain)}`;
  const records = await cloudflareFetch<DnsRecord[]>(endpoint);

  if (records.length === 0) {
    throw new Error(`No DNS record found for subdomain: ${subdomain}`);
  }

  const matchingRecord = records.find(r => r.type.toUpperCase() === targetType);
  if (!matchingRecord || !matchingRecord.id) {
    const existingTypes = records.map(r => r.type).join(', ');
    throw new Error(
      `No DNS record ID found for subdomain '${subdomain}' with type '${targetType}'. Found type(s): [${existingTypes}].`
    );
  }

  console.log(`DNS record ID successfully retrieved for ${subdomain} (${targetType}): ${matchingRecord.id}`);
  cachedRecordId = matchingRecord.id;
  return matchingRecord.id;
}

export function clearIdCache(): void {
  cachedZoneId = null;
  cachedRecordId = null;
}
