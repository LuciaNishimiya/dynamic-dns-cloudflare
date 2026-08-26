import { config } from '../../config';
import { getZoneId } from './getId';
import { cloudflareFetch } from './client';
import { DnsRecord } from '../../types/cloudflare';

export async function getDnsData(): Promise<DnsRecord | null> {
  const zoneId = await getZoneId();
  const subdomain = config.cloudflare.subdomain;
  const targetType = config.cloudflare.dnsType.toUpperCase();

  if (!subdomain) {
    throw new Error('CLOUDFLARE_SUBDOMAIN is not configured.');
  }

  const endpoint = `/zones/${zoneId}/dns_records?name=${encodeURIComponent(subdomain)}`;
  const records = await cloudflareFetch<DnsRecord[]>(endpoint);

  const matchingRecord = records.find(r => r.type.toUpperCase() === targetType);
  return matchingRecord || null;
}
