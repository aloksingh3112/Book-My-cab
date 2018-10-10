const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminRoute = require('../middleware/admin');
const validRoute = require('../middleware/valid');
const User = require('../model/user');
const Tarif = require('../model/tarif');
const AdminDetails = require('../model/admindetail');
const bcrypt = require('bcrypt');
const DriverDetails=require('../model/driverdetail');










router.post('/tarifs', [validRoute, adminRoute], async (req, res) => {
    let adminDetails;

    const tarif = new Tarif({
        cartype: req.body.cartype,
        normalhourrate: req.body.normalhourrate,
        peakhourrate: req.body.peakhourrate,
        startpeaktime: req.body.startpeaktime,
        endpeaktime: req.body.endpeaktime,
    })






    try {

        const token = jwt.decode(req.headers.token);


        const user = await User.findOne({
            email: token.user.email
        });

        if (user.admin.length == 0) {
            adminDetails = new AdminDetails();
            adminDetails.tarifplan.push(tarif);
            user.admin.push(adminDetails);
        } else {
            const id = user.admin[0]
            adminDetails = await AdminDetails.findById(id);
            adminDetails.tarifplan.push(tarif);


        }





        const tarifResult = await tarif.save();
        const adminResult = await adminDetails.save();
        const userResult = await user.save();
        console.log(adminResult);

        return res.status(200).json({
            tarif: tarifResult,
            message: 'added succesfully'
        })


    } catch (err) {
        res.status(501).json({
            message: 'error occured',
            err: err
        })
    }



})


router.get('/tarif', [validRoute, adminRoute], async (req, res) => {
    const token = jwt.decode(req.headers.token);
    console.log(token)
    try {
        const user = await User.findOne({
            email: token.user.email
        }).populate({
            path: 'admin',
            populate: {
                path: 'tarifplan',
                model: 'TarifModel'
            }

        });
        console.log(user.admin)

        if (user.admin.length == 0) {
            return res.status(200).json({
                islength: 0
            })
        } else {
            return res.status(200).json({
                user: user,
                islength: 1

            })
        }
    } catch (err) {
        res.status(501).json({
            err: err
        })
    }




})


router.delete('/tarif/:id', [validRoute, adminRoute], async (req, res) => {
    try {
        const data = await Tarif.deleteOne({
            _id: req.params.id
        });
        const uid = await AdminDetails.findOne({
            tarifplan: {
                _id: req.params.id
            }
        });
        const index = uid.tarifplan.indexOf(req.params.id);
        console.log("index is ", index);
        console.log("admin uid is ", uid);
        console.log(data);
        if (!data) {
            return res.status(501).json({
                result: 'bad request'
            })
        } else {
            uid.tarifplan.splice(index, 1);
            const plan = await uid.save();
            return res.status(200).json({
                data: data,
                message: 'tarid deleted'
            })
        }


    } catch (err) {
        res.status(501).json({
            message: 'error occured'
        })
    }
})


// tarif update

router.put('/tarif/:id', [validRoute, adminRoute], async (req, res) => {
    const newData = {
        $set: {
            cartype: req.body.cartype,
            normalhourrate: req.body.normalhourrate,
            peakhourrate: req.body.peakhourrate,
            startpeaktime: req.body.startpeaktime,
            endpeaktime: req.body.endpeaktime,
        }
    }
    try {
        const tarif = await Tarif.updateOne({
            _id: req.body._id
        }, newData);
        if (!tarif) {
            return res.status(501).json({
                message: 'tarif not found'
            })
        } else {
            return res.status(200).json({
                message: 'updated Succefully',
                tarif: tarif
            })
        }

    } catch (err) {
        res.status(501).json({
            message: "something went wrong"
        })

    }
})


// add driver

router.post('/driver', [validRoute, adminRoute], async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        if (user) {
            return res.status(401).json({
                message: "email already exist"
            })
        }
        else{
         
        const driver = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            contact: req.body.contact,
            role:1
        })
   
        const driverDetails=new DriverDetails({
            address:req.body.address,
            licenceno:req.body.licenceno,
            cartype:req.body.cartype,
            carmodel:req.body.carmodel,
            carname:req.body.carname

        })

        const tarif=await Tarif.findOne({cartype:req.body.cartype});
         console.log("tarif is ",tarif);
        if(!tarif){
            return res.status(501).json({
                message:'something went wrong'
            })
        }
        const decode=jwt.decode(req.headers.token);
        console.log("decode is ",decode);
        driver.driver.push(driverDetails);
        driverDetails.plan=tarif;
        const admin=await User.findOne({email:decode.user.email});

         console.log("admin is ",admin);
     

        const ref=admin.admin[0];

        console.log('ref is ',ref);
        const adminDetail=await AdminDetails.findById(ref);

        console.log("admin details is ",adminDetail)
        adminDetail.driverDetails.push(driver);



        const driverResult=await driver.save();
        console.log("driver result is",driverResult)
        const driverDetailsResult=await driverDetails.save();

        console.log("driver details result",driverDetailsResult);

        const adminResult=await admin.save();


        console.log("admin Result ", adminResult)

        const admindetailresult=await adminDetail.save();
     
        const finalResult=await User.findOne({email:decode.user.email}).populate({
            path:'admin',
            populate:{
                path:'driverDetails',
                model:'UserModel',
                populate:{
                    path:'driver',
                    model:'DriverDetailsModel',
                    populate:{
                        path:'plan',
                        model:'TarifModel'
                    }
                }
            }
        })

        console.log("final result is ",finalResult)

        return res.status(200).json({
            message :'driver created succefully',
            result:finalResult
        })

     }
    }
    
    catch (err) {
       return res.status(501).json({
           err:err,
           message:"something went wrong in error "
       })
    }

})



// ****** router for getting driver *********

router.get('/driver',[validRoute,adminRoute], async (req,res)=>{
   const decode = jwt.decode(req.headers.token);
   try{
    const driverData =await User.findOne({email:decode.user.email}).populate({
        path:'admin',
        populate:{
            path:'driverDetails',
            model:'UserModel',
            populate:{
                path:'driver',
                model:'DriverDetailsModel',
                populate:{
                    path:'plan',
                    model:'TarifModel'
                }
            }
        }
    });

    return res.status(200).json({
        data:driverData,
        message:'succesfull'
    })

   }
   catch(err){
      res.status(501).json({
          message:'something went wrong',
          err:err
      })
   }
})



// router for deleting driver

router.delete('/driver/:id',[validRoute,adminRoute],async (req,res)=>{
    try{
    const id = req.params.id;

    //  driver id in user schema
    const driver = await User.findById(id);

    console.log("driver is ",driver);

    const driverDetailId=driver.driver[0];

    console.log("id is ",driverDetailId);
    
    // id of driver schema

    const driverDetails=await DriverDetails.findById(driverDetailId);
    console.log("driver details ",driverDetails);

    // id of admin Schema
    const adminDetail= await AdminDetails.findOne();

    console.log("admin details ",adminDetail);
    const adminDetailId=adminDetail.driverDetails.indexOf(id);
     
    console.log("admin id is ",adminDetailId);

    // deletetion start
    const driverDelete=await User.deleteOne({_id:id});
    const driverDetailDelete=await DriverDetails.deleteOne({_id:driverDetailId})

    adminDetail.driverDetails.splice(adminDetailId,1);
    const adminDriverDelete=await adminDetail.save();



    return res.status(200).json({
        message:'driver deleted',
        
    })
}catch(err){
   return res.status(501).json({
       message:"something went wrong"
   })
}
    
})




router.put('/driver/:id',[validRoute,adminRoute],async (req,res)=>{
    try{
    const driver=await User.findByIdAndUpdate(req.params.id,{
        $set:{
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            contact:req.body.contact

        }
    }, {new: true})

    const plan=await Tarif.findOne({cartype:req.body.cartype})

    const driverDetail= await DriverDetails.findByIdAndUpdate(req.body.driverDetailId,{
        $set:{
            address:req.body.address,
            licenceno:req.body.licenceno,
            cartype:req.body.cartype,
            carmodel:req.body.carmodel,
            carname:req.body.carname,
            plan:plan
        }
    }, {new: true});



    const result=await User.findById(req.params.id).populate({
        path:"driver",
        populate:{
            path:"plan",
            model:"TarifModel"
        }
    })
    res.status(200).json({
        message:'updated succesfully',
        res:result

    })
}catch(err){
     return res.status(501).json({
         message:'some thing went wrong',
         err:err
     })
}
    

  
  
})

module.exports = router;