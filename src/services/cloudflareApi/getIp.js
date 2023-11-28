import axios from 'axios';

const apiUrl = 'https://api.cloudflare.com/cdn-cgi/trace';

async function getIp() {
    try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
            const match = response.data.match(/ip=([^\s]+)/);

            if (match) {
                return match[1];
            } else {
                throw new Error('IP not found in the response.');
            }
        } else {
            throw new Error(`Error getting data from ${apiUrl}. Status: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
}

export { getIp };