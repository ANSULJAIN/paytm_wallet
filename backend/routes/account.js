const express = require('express');
const middleware = require('../middleware');
const {Acount} = require('../db')
const router = express.Router()



router.get('/balance',middleware,(req,res)=>{
const account = Acount.findOne({
    userId:req.userId
})
res.json({
    balance:account.balance 
})
})
router.post('/transfer',middleware,async (req,res)=>{
    const session = mongoose.startSession();

    session.startSession(); 
    const {amount, to }=req.body 
    console.log(req.body);
    const Acount = await Acount.findOne({userId:req.userId}).session(session)
    
    if (!Acount || Acount.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Acount.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Acount.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Acount.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });

})
module.exports = router;