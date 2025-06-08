const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const authMiddleware = require('../middleware/auth');

// Rota pública para visualizar todos os posts
router.get('/all-posts', PostController.getAllPosts);

// Rotas protegidas com o middleware
router.post('/create', authMiddleware, PostController.createPost);
router.get('/user-posts', authMiddleware, PostController.getUserPosts);

module.exports = router;