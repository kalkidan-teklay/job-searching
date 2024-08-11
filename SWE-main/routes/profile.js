const express = require('express');
const router = express.Router();
const profileControll = require('../controllers/profileControll')
const bodyParser = require('body-parser');
const path = require('path');



router.put('/modify/:id',async(req,res)=>{
    const userId = req.params.id;
    const newValues = req.body.updateValues;
    try {
        const result = await profileControll.updateUserById(userId,newValues);
        res.json({msg:'Profile modified Succesfully'});
    } catch(error){
        res.status(500).json({msg:'Internal Server Error'});
    }

})
router.get('/', profileControll.renderProfilePage);

router.delete('modify/:id',async(req,res)=>{
    const userId = req.params.id;
    try {
        const result = await profileControll.deleteUserById(userId);
        res.json({msg:'Profile modified Succesfully'});
    } catch(error){
        res.status(500).json({msg:'Internal Server Error'});
    }
});

module.exports = router;