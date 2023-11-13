import axios from 'axios';
import dotenv from 'dotenv';
import { getZoneID, getRecordID } from './getID';

dotenv.config();

const cloudflareAPIKey = process.env.CLOUDFLARE_API_KEY;

const subdomain = process.env.CLOUDFLARE_SUBDOMAIN;

const apiUrl = `https://api.cloudflare.com/client/v4`;

const headers = {
    'Authorization': `Bearer ${cloudflareAPIKey}`,
    'Content-Type': 'application/json',
};

const updateDns = async (newIP) => {
    const zoneID = await getZoneID()
    const recordID = await getRecordID()

    const newDnsRecordData = {
        type: 'A',
        name: subdomain,
        content: newIP,
        proxied: false,
        ttl: 1,
    };

    axios.put(`${apiUrl}/zones/${zoneID}/dns_records/${recordID}`, newDnsRecordData, { headers })
        .then(response => {
            console.log('DNS record successfully updated:', response.data.result.content);
            return response.data.result
        })
        .catch(error => {
            console.error('Error updating DNS record:', error);
        });
}

export { updateDns }