const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { loginStaff } = require('../controllers/staffController');

// Define route for fetching all staff members
router.get('/', staffController.getAllStaff);
router.get('/all-details', staffController.getAllStaffDetails);
router.delete('/:id', staffController.deleteStaff);
router.post('/add-staff', staffController.addStaff);
router.post('/login', loginStaff);


// Export router
module.exports = router;
