const { API_POSTPAID } = require('../config/postpaid')

const axios = require('axios')
exports.station = async(req, res) => {
    var request = {
        "commands" : "station-list",
        "username" : "085156060297",
        "sign"     : "e84b6ec531ad186194446d4f818667c4"
    }


    const {
        data: { data },
    } = await API_POSTPAID.post('/tiketv2', request) 

    console.log(data)
    // const newData = data.map(obj =>
    //     obj.pulsa_code ? { ...obj, pulsa_price: obj.pulsa_price + 50} : obj
    // );

    res.send(data)
}

