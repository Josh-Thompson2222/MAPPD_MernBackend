const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');


router.get('/:userId', basketController.getBasket);            // View Basket           Read
router.post('/add', basketController.addToBasket);             // Add to Basket         Create
router.delete('/remove', basketController.removeFromBasket);   // Remove from Basket    Delete
router.put('/update', basketController.updateBasket);          // Update Basket         Update

module.exports = router;
