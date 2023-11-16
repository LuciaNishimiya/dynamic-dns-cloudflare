import { sendMessage } from "./services/discord";
import { updateDns } from "./services/cloudflareApi";
import { getIp } from './services/getIpApi';
import dotenv from 'dotenv';
import { getDnsData } from "./services/cloudflareApi/getDnsData";
dotenv.config();

const subdomain = process.env.CLOUDFLARE_SUBDOMAIN;
const TimeToUpdateDNS = process.env.TIME_TO_UPDATE_DNS;

async function setIP(ip) {
    // this is only used to add styles to the discord message
    const backticks = '`'
    //
    await updateDns(ip)
    await sendMessage(
        `>>> ## :arrows_counterclockwise:  El servidor cambió de IP: ${backticks}${ip}${backticks}\n
## :white_check_mark: ${backticks}${subdomain}${backticks} actualizado correctamente`
    )
}
async function onRestart() {
    await sendMessage(
        '# :warning:  El servidor se ha reiniciado.'
    )
    const newIp = await getIp();
    const dnsData = await getDnsData()
    const dnsIp = dnsData.content;

    if (dnsIp !== newIp) {
        setIP(newIp);
    }
}
onRestart()

setInterval(async () => {

    try {
        const newIp = await getIp();
        const dnsData = await getDnsData()
        const dnsIp = dnsData.content;

        if (dnsIp !== newIp) {
                ip = newIp;
            setIP(newIp);
        }

    } catch (error) {
        console.error('Error getting IP: ' + error.message);
    }
}, TimeToUpdateDNS * 60 * 1000);
