const { required } = require('@hapi/joi')
const express = require('express')
const route = express.Router()
const { auth } = require('../middleware/auth')


const {
    login,
    register
} = require('../controllers/controllerAuth')

const {
    read:readWallet,
    amount:amountWallet,
} = require('../controllers/controllerWallet')

const {
	product:listProduct,
	category:categoryProduct,
    price:priceProduct,
    inquiry
} = require('../controllers/controllerProducts')

const {
    station:stationTrains
} = require('../controllers/controllerTrain')

const {
    topup,
    status:statusTopup
} = require('../controllers/controllerTransaction')



const {
    snap,
	pay,
	history,
	status
} = require('../controllers/controllerDeposit')

//Deposit
route.post('/deposit/snap', auth, snap)
route.post('/deposit/pay', auth, pay)
route.get('/deposit/history', auth, history)
route.post('/deposit/status', auth, status)

//Product
route.get('/product/prepaid', listProduct)
route.get('/product/prepaid/:type', categoryProduct)
route.get('/product/prepaid/price/:type/:operator', priceProduct)
route.get('/product/train/station', stationTrains)
route.post('/product/postpaid/:code', inquiry)

//Wallet
route.get('/wallet/amount', auth, amountWallet)

// Transaction
route.post('/transaction/prepaid/topup', auth, topup)
route.get('/transaction/prepaid/status/:ref_id', auth, statusTopup)

route.post('/login', login)
route.post('/register', register)

module.exports = route