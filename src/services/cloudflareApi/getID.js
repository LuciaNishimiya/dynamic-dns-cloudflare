import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const cloudflareAPIKey = process.env.CLOUDFLARE_API_KEY;
const apiUrl = 'https://api.cloudflare.com/client/v4'
const subdomain = process.env.CLOUDFLARE_SUBDOMAIN;
const domain = process.env.CLOUDFLARE_DOMAIN;
const headers = {
    'Authorization': `Bearer ${cloudflareAPIKey}`,
    'Content-Type': 'application/json',
};

const idCache = {};

async function getID(args) {
    try {
        // Check if the result is already in the cache
        if (idCache[args]) {
            console.log(`Using cached result for ${args}: ${idCache[args]}`);
            return idCache[args];
        }
        // Make a request if not in cache
        const response = await axios.get(`${apiUrl}${args}`, { headers });

        if (response.status === 200) {
            const dataId = response.data.result[0].id;
            console.log(`${args} id was successfully get ${dataId}`);

            // Store the result in the cache
            idCache[args] = dataId;

            return dataId;
        } else {
            console.error(`Failed to retrieve on get id of ${args}`);
        }
    } catch (error) {
        console.error(`An error occurred on get id of ${args}:`, error.message);
    }
}

async function getZoneID() {
    const ZoneID = await getID(`/zones/?name=${domain}`)
    return ZoneID
}

async function getRecordID() {
    const zoneID = await getZoneID();
    const recordID = await getID(`/zones/${zoneID}/dns_records?name=${subdomain}`);
    return recordID;
}

export { getID, getZoneID, getRecordID }