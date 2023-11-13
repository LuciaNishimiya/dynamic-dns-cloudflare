import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const PORT_TO_PING = process.env.CLOUDFLARE_SUBDOMAIN;
async function ping(ip) {
    try {
        await axios.get(`http://${ip}:${PORT_TO_PING}`);
        return true;
    } catch (error) {
        return;
    }
}

export { ping };