import dotenv from 'dotenv';
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID;
import axios from 'axios';

async function sendMessage(mensaje) {
    const url = `https://discord.com/api/v10/channels/${channelId}/messages`;

    await axios.post(url, {
        content: mensaje,
    }, {
        headers: {
            'Authorization': `Bot ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            console.log('Message successfully sent to discord');
        })
        .catch(error => {
            console.error('Error sending message to discord:', error);
        });

}

export { sendMessage }