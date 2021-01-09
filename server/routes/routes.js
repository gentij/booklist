const express = require('express');

const router = express.Router();

const { register, login, getUser } = require('../controllers/users');
const { addBook } = require('../controllers/books')

router.post('/register', register);
router.post('/login', login);
router.patch('/add-book', addBook);

module.exports = router;
