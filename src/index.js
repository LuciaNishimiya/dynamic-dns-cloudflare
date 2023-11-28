import { sendMessage } from "./services/discord";
import { updateDns, getDnsData, getIp } from "./services/cloudflareApi";
import dotenv from 'dotenv';
dotenv.config();

const subdomain = process.env.CLOUDFLARE_SUBDOMAIN;
const TimeToUpdateDNS = process.env.TIME_TO_UPDATE_DNS;

async function setIP(ip) {

    await updateDns(ip)
    sendMessage(
        `>>> ## :arrows_counterclockwise: El servidor cambió de IP: \`${ip}\`\n` +
        `## :white_check_mark: \`${subdomain}\` actualizado correctamente`
    );
}
async function onRestart() {
    try {
        await sendMessage('# :warning: El servidor se ha reiniciado.');
        const newIp = await getIp();
        const dnsData = await getDnsData();
        const dnsIp = dnsData.content;

        if (dnsIp !== newIp) {
            setIP(newIp);
        }
    } catch (error) {
        console.error('Error during restart: ' + error.message);
    }
}
onRestart()

setInterval(async () => {

    try {
        const newIp = await getIp();
        const dnsData = await getDnsData()
        const dnsIp = dnsData.content;

        if (dnsIp !== newIp) {
            setIP(newIp);
        }

    } catch (error) {
        console.error('Error getting IP: ' + error.message);
    }
}, TimeToUpdateDNS * 60 * 1000);
