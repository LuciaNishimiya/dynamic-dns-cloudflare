export interface CloudflareError {
  code: number;
  message: string;
}

export interface CloudflareResponse<T> {
  success: boolean;
  errors: CloudflareError[];
  messages: string[];
  result: T;
}

export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX' | 'NS' | 'SRV' | string;

export interface DnsRecord {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: DnsRecordType;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  created_on: string;
  modified_on: string;
}

export interface UpdateDnsRecordPayload {
  type: DnsRecordType;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

export interface CloudflareZone {
  id: string;
  name: string;
  status: string;
}
