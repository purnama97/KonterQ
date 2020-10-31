const axios = require('axios')

exports.API_PREPAID = axios.create({
    baseURL: "https://testprepaid.mobilepulsa.net/v1",
});