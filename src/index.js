import dotenv from "dotenv";
import { updateDns } from "./services/cloudflareApi";
import { getIp } from './services/getIpApi';
import { ping } from "./services/ping";
dotenv.config();
let ip;
setInterval(async () => {

    try {
        const serverPing = await ping(ip)
        if (!serverPing) {
            const newIp = await getIp();
            if (newIp !== ip) {
                ip = newIp;
                await updateDns(ip)
            }
        }

    } catch (error) {
        console.error('Error getting IP: ' + error.message);
    }
}, 1 * 60 * 1000);
