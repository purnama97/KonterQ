const { user } = require("../models");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Nexmo = require('nexmo');
const otpGenerator = require('otp-generator')

exports.login = async(req, res) =>{

    try {

        const schema = Joi.object({
            email: Joi.string().email().min(6).required(),
            password: Joi.string().min(6).required(),
        });
        
        const { error } = schema.validate(req.body);
      
        if (error)
            res.status(400).send({
              error: {
                message: error.details[0].message,
              },
            });

        const {email, password} = req.body;
        const User = await user.findOne({
            where: {email},
        });

        if (!User) return res.status(400).send({error: {message: "Invalid Login"}});
        const validPass = await bcrypt.compare(password,User.password);
        if(!validPass) return res.status(400).send({error: {message: "Invalid Login"}});
        var token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);
        
        res.status(200).send({
            data:{
                login: {
                    email,
                    token
                }
            }
        })   
    }catch(error){
        console.log(error);
    }
}

exports.register = async(req,res) => {
	
	const nexmo = new Nexmo({
	  apiKey: process.env.NEXMO_API_KEY,
	  apiSecret: process.env.NEXMO_API_SECRET,
	});

	console.log(nexmo)
    try {

        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com','id'] } }).required(),
            password: Joi.string().min(6).required(),
            fullName: Joi.string().min(3).max(30).required(),
            gender: Joi.string().min(4).max(6).required(),
            phone: Joi.number().required(),
            address: Joi.string().min(20).max(150).required()
        });
        
        const { error } = schema.validate(req.body);
    
        if (error) {
            res.status(400).send({
                error: {
                    message: error.details[0].message,
                },
            });

        }else{
			
            const { email, password } = req.body;
			const Cek = await user.findOne({
				where: {email},
			});
			
			if (Cek) return res.status(400).send({error: {message: "Email has been used"}});
			
            const hashedPassword = await bcrypt.hash(password, 10);
            const User = await user.create({ ...req.body, password: hashedPassword });
            const token = jwt.sign({ id: User.id }, process.env.SECRET_KEY);
			if(!User) {
				res.status(410).send({
					error: {message:"Login Field"},
				});
			}
			const verifikasiCode = otpGenerator.generate(4, { alphabets:false, upperCase: false, specialChars: false });
			
			const from = 'KonterQ';
			const to = req.body.phone;
			const text = 'Gunakan ' + verifikasiCode +' sebagai verifikasi layanan KonterQ.';

			const send = await nexmo.message.sendSms(from, to, text, (err, responseData) => {
				if (err) {
					console.log(err);
				} else {
					if(responseData.messages[0]['status'] === "0") {
						console.log("Message sent successfully.");
					} else {
						console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
					}
				};
			})
			
            res.status(200).send({
                data: {
                    register:{
                        email,
                        token,
                    }
                },
            });
        }
        
    } catch (error) {
        console.log(error);
    }
}