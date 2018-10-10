const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const _ = require('lodash')
const jwt = require('jsonwebtoken');




router.post('/signup', async (req, res) => {


    try {
        const users = await UserModel.findOne({
            email: req.body.email
        });

        if (users) {
            res.status(409).json({
                message: 'user already existed'
            });
        } else {
            const user = new UserModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                contact: req.body.contact,

            });

            try {
                const result = await user.save();
                const data = _.pick(result, ['_id', 'firstname', 'lastname', 'contact', 'email', 'role'])

                return res.status(200).json({
                    message: 'You are register successfully',
                    user: data
                })
            } catch (err) {
                res.status(500).json({
                    message: 'signup failed',
                    error: err
                })

            }

        }

    } catch (err) {
        res.status(500).json({
            message: 'signup failed',
            err: err
        })
    }
})

// user login


router.post('/login', async (req, res) => {

    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })
        if (!user) {
            return res.status(403).json({
                message: 'you are not register'
            });
        } else if (!bcrypt.compareSync( req.body.password,user.password)) {
            return res.status(501).json({
                message: 'wrong credential'
            })
        } else 
        {

            const result = _.pick(user, ['role', '_id', 'firstname', 'lastname', 'email'])
            const token = jwt.sign({
                user: result
            }, 'aloksingh', {
                expiresIn: 10000
            });
            return res.status(200).json({
                token: token,
                user: result
            })
        }


    } catch (err) {
        res.status(501).json({
            message:'not login',
            err:err
        })
    }






})







module.exports = router;