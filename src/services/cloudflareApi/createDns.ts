import { config } from '../../config';
import { getZoneId, clearIdCache } from './getId';
import { cloudflareFetch } from './client';
import { DnsRecord, UpdateDnsRecordPayload } from '../../types/cloudflare';

export async function createDns(ip: string): Promise<DnsRecord> {
  const zoneId = await getZoneId();

  const payload: UpdateDnsRecordPayload = {
    type: config.cloudflare.dnsType,
    name: config.cloudflare.subdomain,
    content: ip,
    proxied: config.cloudflare.proxied,
    ttl: 1,
  };

  const newRecord = await cloudflareFetch<DnsRecord>(`/zones/${zoneId}/dns_records`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  console.log(`DNS record created successfully on Cloudflare: ${newRecord.name} (${newRecord.type}) -> ${newRecord.content}`);
  clearIdCache();
  return newRecord;
}
