const { API_PREPAID } = require('../config/prepaid')
const MD5 = require('crypto-js/md5')

exports.topup = async(req, res) => {
    const { code, idpel } = req.body
    const sign = process.env.USER_NAME + process.env.API_KEY + 'KS0001'

    var request = {
        "commands" : "topup",
        "username" : process.env.USER_NAME,
        "ref_id"     : "KS0001",
        "hp"         : idpel,
	    "pulsa_code" : code,
        "sign"     : MD5(sign).toString()
    }

    const {
            data: { data },
        } = await API_PREPAID.post('/legacy/index', request) 
    
    res.send(data)
}

exports.status= async(req, res) => {
    const {ref_id} = req.params
    const signature = process.env.USER_NAME + process.env.API_KEY + ref_id

    var request = {
        "commands" : "inquiry",
        "username" : process.env.USER_NAME,
        "ref_id"   : ref_id,
        "sign"     : MD5(signature).toString()
    }

    const {
        data: { data },
    } = await API_PREPAID.post('/legacy/index', request) 

    res.send(data)
}