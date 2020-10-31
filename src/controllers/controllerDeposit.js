const midtransClient = require('midtrans-client')
const dayjs = require('dayjs')
const { user, deposit, wallet } = require('../models')

exports.snap = async(req, res) => {
    try{
	const {id} = req.user
	const User = await user.findOne({where:{id}})
    let trxId = await deposit.count('id', {where:{userId:req.user.id}})
	let tgl = dayjs().format('YYMMDD')
	const order_id = trxId+1
	console.log(order_id)
    var str = "" + order_id
    var pad = "0000"
    var ans = pad.substring(0, pad.length - str.length) + order_id
    const trxcode = "Q" + req.user.id + tgl + ans
	
    let snap = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.SERVER_KEY,
        clientKey : process.env.CLIENT_KEY
    });
 
    let parameter = {
        "transaction_details": {
            "order_id": trxcode,
            "gross_amount": req.body.nominal
        }, 
		"credit_card":{
            "secure" : true
        },
		"customer_details": {
			"first_name": User.fullName,
			"email": User.email,
			"phone": User.phone,
			"billing_address": {
			  "first_name": User.fullName,
			  "email": User.email,
			  "phone": User.phone,
			  "address": User.address
			},
		}
	}
 
    snap.createTransaction(parameter)
    .then(async(transaction)=>{
        let transactionToken = transaction.token;
        res.send({data:{token:{tokenKey:transactionToken,clientKey:process.env.CLIENT_KEY}}})
    })
       
    }catch(err){
        console.log(err)
    }
}

exports.pay = async(req, res) => {
    try{
    const {id} = req.user
	const create = await deposit.create({...req.body, userId:id})
	const created = await deposit.findOne({
        include:{
            model:user,
            attributes:{
                exclude:['id','password','role']
            }
        },
        attributes:{
          exclude:['id','userId']
        },
        where:{id:create.id}
    })
        res.send({data:{deposit:created}})
    
    }catch(err){
        console.log(err)
    }
}

exports.status = async(req, res) => {
    try{
	const id = req.user.id
	const order_id = req.body.order_id
	
    let apiClient = new midtransClient.Snap({
        isProduction : false,
        serverKey : process.env.SERVER_KEY,
        clientKey : process.env.CLIENT_KEY
    });
 
	apiClient.transaction.status(order_id)
	
    .then(async(response)=>{
		if(response.transaction_status === "settlement" || response.transaction_status === "capture"){
			await deposit.update({transaction_status:response.transaction_status,status_message:response.status_message }, {where:{order_id:response.order_id}})
			await wallet.create({userId:id,type:"K",gross_amount:response.gross_amount,transaction_status:response.transaction_status})
		}
        
		const created = await deposit.findAll({
        include:{
            model:user,
            attributes:{
                exclude:['id','password','role']
            }
        },
        attributes:{
          exclude:['id','userId']
        },
		order: [
			['createdAt','DESC']
		],
        where:{userId:id}
		})
        res.send({data:{deposit:created}})
    });
        
    
    }catch(err){
        console.log(err)
    }
}


exports.history = async(req, res) => {
    try{
    const id = req.user.id
	const created = await deposit.findAll({
        include:{
            model:user,
            attributes:{
                exclude:['id','password','role']
            }
        },
        attributes:{
          exclude:['id','userId']
        },
		order: [
			['createdAt','DESC']
		],
        where:{userId:id}
    })
        res.send({data:{deposit:created}})
    
    }catch(err){
        console.log(err)
    }
}