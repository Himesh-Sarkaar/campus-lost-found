const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, async (req, res) => {
  try {
    res.json({
      totalItems: await Item.countDocuments(), lostItems: await Item.countDocuments({ type: 'lost' }), foundItems: await Item.countDocuments({ type: 'found' }),
      totalClaims: await Claim.countDocuments(), pendingClaims: await Claim.countDocuments({ status: 'pending' }), totalUsers: await User.countDocuments()
    });
  } catch (error) { res.status(500).json({ message: 'Error' }); }
});
module.exports = router;