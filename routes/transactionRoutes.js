const express = require('express');
const router = express.Router();
const {protect, authorizeRoles} = require('../middleware/auth.js');
const { debitTransaction, getTransactions, getUserTransactions } = require('../controllers/transactionController.js')

router.post('/debit',protect, debitTransaction)
router.get('/gettransactions',protect, authorizeRoles("admin"), getTransactions)
router.get('/getusertransactions',protect, getUserTransactions)



module.exports = router