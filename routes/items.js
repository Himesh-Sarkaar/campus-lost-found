const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, category, location, type } = req.query;
    let query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;
    res.json(await Item.find(query).populate('reportedBy', 'name email'));
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.get('/my', protect, async (req, res) => {
  try { res.json(await Item.find({ reportedBy: req.user._id }).populate('reportedBy', 'name email')); } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.post('/', protect, async (req, res) => {
  try { res.status(201).json(await Item.create({ ...req.body, reportedBy: req.user._id })); } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.reportedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) return res.status(403).json({ message: 'Not auth' });
    res.json(await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.reportedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) return res.status(403).json({ message: 'Not auth' });
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
module.exports = router;