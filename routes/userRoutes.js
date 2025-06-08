const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');

// Rotas públicas
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

// Rotas protegidas com o middleware
router.get('/user-data', authMiddleware, UserController.getUserData);
router.post('/update-user-data', authMiddleware, UserController.updateUserData);
router.post('/update-profile-image', authMiddleware, UserController.updateProfileImage);
router.delete('/delete-account', authMiddleware, UserController.deleteUser);
router.get('/isUserLoggedIn', authMiddleware);

module.exports = router;