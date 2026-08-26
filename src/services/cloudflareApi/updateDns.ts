import { config } from '../../config';
import { getZoneId, getRecordId } from './getId';
import { cloudflareFetch } from './client';
import { DnsRecord, UpdateDnsRecordPayload } from '../../types/cloudflare';

export async function updateDns(newIp: string): Promise<DnsRecord> {
  const zoneId = await getZoneId();
  const recordId = await getRecordId();

  const payload: UpdateDnsRecordPayload = {
    type: config.cloudflare.dnsType,
    name: config.cloudflare.subdomain,
    content: newIp,
    proxied: config.cloudflare.proxied,
    ttl: 1,
  };

  const updatedRecord = await cloudflareFetch<DnsRecord>(
    `/zones/${zoneId}/dns_records/${recordId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    }
  );

  console.log(`DNS record successfully updated: ${updatedRecord.content}`);
  return updatedRecord;
}
