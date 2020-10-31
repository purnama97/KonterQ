const { API_PREPAID } = require('../config/prepaid')
const { API_POSTPAID } = require('../config/postpaid')
const MD5 = require('crypto-js/md5')

exports.product = async(req, res) => {
    var products = [
		{product_name:"Pulsa Isi Ulang",product_type:"pulsa", icon:"https://src.kioser.com/img/icon-produk/Pulsa-Isi-Ulang.png"},
        {product_name:"Paket Data",product_type:"data", icon:"https://src.kioser.com/img/icon-produk/Paket%20Internet.png"},
		{product_name:"Token Listrik",product_type:"pln",icon:"https://src.kioser.com/img/icon-produk/Token%20Listrik.png"},
		{product_name:"E-Toll",product_type:"etoll",icon:"https://src.kioser.com/img/icon-produk/Saldo%20E-MONEY.png"},
		{product_name:"Game",product_type:"game", icon:"https://src.kioser.com/img/icon-produk/Voucher%20Game.png"},
		{product_name:"Voucher",product_type:"voucher", icon:"https://src.kioser.com/img/icon-produk/Voucher%20Game.png"},
    ]

    res.status(200).send({data:{product:products}})
}

exports.category = async(req, res) => {
	const {type} = req.params
    var request = {
        "commands" : "pricelist",
	    "username" : process.env.USER_NAME,
	    "sign"     : process.env.SIGN_KEY,
        "status"   : "all"
    }

    const {
        data: { data },
    } = await API_PREPAID.post(`/legacy/index/${type}`, request) 

	let groupBy = (element, key) => {
	  return element.reduce((value, x) => {
		  (value[x[key]] = value[x[key]] || []).push(x);
		return value;
	  }, {});
	};


	const newData = groupBy(data, 'pulsa_type');
	//console.log(newData)

    res.status(200).send({data:{product:data}})
}

exports.price = async(req, res) => {
    const {type,operator} = req.params

    var request = {
        "commands" : "pricelist",
	    "username" : process.env.USER_NAME,
	    "sign"     : process.env.SIGN_KEY,
        "status"   : "all"
    }

    const {
        data: { data },
    } = await API_PREPAID.post(`/legacy/index/${type}/${operator}`, request) 

    const newData = data.map(obj =>
        obj.pulsa_code ? { ...obj, pulsa_price: obj.pulsa_price + 50} : obj
    );

    res.send(newData)
}

exports.inquiry = async(req, res) => {
    try {
    const {code} = req.params
    const signature = process.env.USER_NAME + process.env.API_KEY + '091283746512'

    var request = {
        "commands" : "inq-pasca",
        "username" : process.env.USER_NAME,
        "code"     : code,
        "hp"       : req.body.IDPEL,
        "ref_id"   : "091283746512",
        "sign"     : MD5(signature).toString(),
        "month"    : "2"
    }

    const { 
        data: { data }
        } = await API_POSTPAID.post('/bill/check', request) 

    // const newData = data.map(obj =>
    //     obj.pulsa_code ? { ...obj, pulsa_price: obj.pulsa_price + 50} : obj
    // );
    res.send(data)
    }catch (err) {
        console.log(err)
    }
}