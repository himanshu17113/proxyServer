
const axios = require('axios');

 function hello() {
    let data = JSON.stringify({
        "phone": "+918770780874",
        "device_id": "newDevice122"
    });

    function handle({ method, url, headers, data }) {
        return {
            method,
            maxBodyLength: Infinity,
            url,
            headers,
            data
        };
    }
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://dev.service.auth.boldrides.com/api/v1/customers/login-phone',
  headers: {
    connection: 'keep-alive',
 
    'sec-ch-ua-platform': '"macOS"',
    authorization: 'Bearer',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    accept: 'application/json',
    'sec-ch-ua': '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
    'content-type': 'application/json; charset=utf-8',
    'sec-ch-ua-mobile': '?0',
    'sec-gpc': '1',
    'accept-language': 'en-GB,en;q=0.7',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'accept-encoding': 'gzip, deflate, br, zstd'
  },
  data: '{"phone":"+918770780874","device_id":"newDevice122"}'
}

    axios.request(handle(config))
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}


hello()