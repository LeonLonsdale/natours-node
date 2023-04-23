const express = require('express');
const { getOverview, getTour } = require('../controllers/viewController');

const router = express.Router();

router.get('/', (req, res) =>
  res.status(200).render('base', {
    tour: 'Banana boats',
    location: 'Liverpool',
    user: 'Leon',
  })
);
router.get('/overview', getOverview);
router.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
  });
});

module.exports = router;
