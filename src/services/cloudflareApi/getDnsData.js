import axios from 'axios';
import dotenv from 'dotenv';
import { getZoneID, getRecordID } from './getID';

dotenv.config();

const cloudflareAPIKey = process.env.CLOUDFLARE_API_KEY;

const apiUrl = `https://api.cloudflare.com/client/v4`;

const headers = {
    'Authorization': `Bearer ${cloudflareAPIKey}`,
    'Content-Type': 'application/json',
};

const getDnsData = async () => {
    const zoneID = await getZoneID()
    const recordID = await getRecordID()

    axios.get(`${apiUrl}/zones/${zoneID}/dns_records/${recordID}`, { headers })
        .then(response => {
            return response.data.result;

        })
        .catch(error => {
            console.error('Error fetching dns data:', error);
        });
}

export { getDnsData }