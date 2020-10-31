const midtransClient = require('midtrans-client')
const dayjs = require('dayjs')
const { wallet, user } = require('../models')

exports.read= async(req, res) => {
    try{
        const history = await wallet.findAll({
            include:{
                model:user,
                attributes:{
                    exclude:['id','password','role']
                }
            },
            attributes:{
                exclude:['id','userId']
            }
        })
        res.send({data:{wallet:{history:history}}})
    }catch(err){
        console.log(err)
    }
}

exports.amount= async(req, res) => {
    try{
        let credit = await wallet.sum('gross_amount',{where:{type:'K',userId:req.user.id}})
        let discharge = await wallet.sum('gross_amount',{where:{type:'D',userId:req.user.id}})
        credit ? credit=credit : credit=0
        discharge ? discharge=discharge : discharge=0
        const amount = credit - discharge

        if(!amount) return res.send({data:{wallet:{amount:0}}})

        res.send({data:{wallet:{amount:amount}}})
    }catch(err){
        console.log(err)
    }
}


exports.update = async(req, res) => {
    try{
        const {trxcode} = req.params
        const update = await wallet.update(req.body, {where:{trxCode:trxcode}})
        if(!update) return res.status(400).send({error:{message:"Update failed!"}})
        const updated= await wallet.findOne({
            include:{
                model:user,
                attributes:{
                    exclude:['id','password','role']
                }
            },
            attributes:{
                exclude:['id','userId']
            },
            where:{trxcode:trxcode}
        })
        res.send({data:{wallet:{update:updated}}})
    }catch(err){
        console.log(err)
    }
}
