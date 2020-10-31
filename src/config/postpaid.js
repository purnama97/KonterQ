const axios = require('axios')

exports.API_POSTPAID = axios.create({
    baseURL: "https://testpostpaid.mobilepulsa.net/api/v1/bill/check",
});