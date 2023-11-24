// controllers/itemsController.js
const Item = require('../models/Item');

// Create a new item for the authenticated user
exports.create = async (req, res) => {
  try {
    const { name, description,user_id } = req.body;
    // Assuming you have middleware to extract user information from the JWT token
    const newItem = new Item({
      name,
      description,
      user_id, // Link the item to the user
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all items added by the authenticated user
exports.read = async (req, res) => {
  try {
   
    // Assuming you have middleware to extract user information from the JWT token
    const userId = req.authData.userId;
    const items = await Item.find({ user_id: userId });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update an item for the authenticated user
exports.update = async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, user: req.authData.userId },
      req.body, //{ name, description },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete an item for the authenticated user
exports.delete = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ _id: req.params.id, user: req.authData.userId });
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(deletedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};