const express = require('express')
const router = express.Router()
const userRouter = require('./users')
const useAccount = require('./account')
router.use('/account',useAccount)
router.use('/users',userRouter)
module.exports = router ;




