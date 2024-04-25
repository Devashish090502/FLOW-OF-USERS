const express = require('express');
const router = express.Router();
const astrologerController = require('../controllers/astrologerController');

// Route for assigning a user to an astrologer
router.post('/assign-user', astrologerController.assignUser);
// Route for creating a new astrologer
router.post('/create-astrologer', astrologerController.createAstrologer);
// Route for creating a new user
router.post('/create-user', astrologerController.createUser);
// Route to get all users and their assigned astrologers
router.get('/users-with-astrologers', astrologerController.getUsersWithAstrologers);
module.exports = router;
