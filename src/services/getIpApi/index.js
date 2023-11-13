import axios from 'axios';

const apiUrl = 'https://api.ipify.org/?format=json';

function getIp() {
    return new Promise((resolve, reject) => {
        axios.get(apiUrl)
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    resolve(response.data.ip);
                } else {
                    console.error(`Error getting data from ${apiUrl}`);
                    reject(new Error(`Error getting data from ${apiUrl}`));
                }
            })
            .catch(error => {
                console.error(`Error connecting to ${apiUrl}: ${error.message}`);
                reject(error);
            });
    });
}

export { getIp };
