const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.body.itemId);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (item.reportedBy.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot claim own item' });
    res.status(201).json(await Claim.create({ item: req.body.itemId, claimant: req.user._id, message: req.body.message }));
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.get('/my', protect, async (req, res) => {
  try { res.json(await Claim.find({ claimant: req.user._id }).populate('item', 'name type status').populate('claimant', 'name email')); } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.get('/', protect, admin, async (req, res) => {
  try { res.json(await Claim.find().populate('item', 'name type status').populate('claimant', 'name email')); } catch (error) { res.status(500).json({ message: 'Error' }); }
});
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Not found' });
    claim.status = req.body.status;
    await claim.save();
    if (req.body.status === 'approved') await Item.findByIdAndUpdate(claim.item, { status: 'claimed' });
    res.json(claim);
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
module.exports = router;