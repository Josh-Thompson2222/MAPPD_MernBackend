
const Basket = require('../models/basket');
const Product = require('../models/Product');

// View Basket (GET)
exports.getBasket = async (req, res) => {
	try {
		const userId = req.params.userId;
		const basket = await Basket.findOne({ userId }).populate('items.product');
		if (!basket) {
			return res.status(404).json({ message: 'Basket not found' });
		}
		res.json(basket);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Add to Basket (POST)
exports.addToBasket = async (req, res) => {
	try {
		const userId = req.body.userId;
		const productId = req.body.productId;
		const quantity = req.body.quantity || 1;

		// Validate product exists
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: 'Product not found' });
		}

		let basket = await Basket.findOne({ userId });
		if (!basket) {
			basket = new Basket({ userId, items: [] });
		}

		// Check if product already in basket
		const itemIndex = basket.items.findIndex(item => item.product.toString() === productId);
		if (itemIndex > -1) {
			basket.items[itemIndex].quantity += quantity;
		} else {
			basket.items.push({ product: productId, quantity });
		}

		await basket.save();
		res.status(200).json(basket);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Remove from Basket (DELETE)
exports.removeFromBasket = async (req, res) => {
	try {
		const userId = req.body.userId;
		const productId = req.body.productId;

		let basket = await Basket.findOne({ userId });
		if (!basket) {
			return res.status(404).json({ message: 'Basket not found' });
		}

		basket.items = basket.items.filter(item => item.product.toString() !== productId);
		await basket.save();
		res.status(200).json(basket);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

// Update Basket (PUT)
exports.updateBasket = async (req, res) => {
	try {
		const userId = req.body.userId;
		const productId = req.body.productId;
		const quantity = req.body.quantity;

		if (quantity < 0) {
			return res.status(400).json({ message: 'Quantity cannot be negative' });
		}

		let basket = await Basket.findOne({ userId });
		if (!basket) {
			return res.status(404).json({ message: 'Basket not found' });
		}

		const itemIndex = basket.items.findIndex(item => item.product.toString() === productId);
		if (itemIndex === -1) {
			return res.status(404).json({ message: 'Product not found in basket' });
		}

		if (quantity === 0) {
			// Remove item if quantity is 0
			basket.items.splice(itemIndex, 1);
		} else {
			basket.items[itemIndex].quantity = quantity;
		}

		await basket.save();
		res.status(200).json(basket);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};