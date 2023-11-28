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

async function getID(endpoint) {
    try {
        // Check if the result is already in the cache
        if (idCache[endpoint]) {
            return idCache[endpoint];
        }
        // Make a request if not in cache
        const response = await axios.get(`${apiUrl}${endpoint}`, { headers });
            const dataId = response.data.result[0].id;
        console.log(`${endpoint} id was successfully get ${dataId}`);
            // Store the result in the cache
        idCache[endpoint] = dataId;

        return dataId;
    } catch (error) {
        throw new Error(`An error occurred on get id of ${endpoint}:`, error);
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