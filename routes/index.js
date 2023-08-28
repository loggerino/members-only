var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  if (!isAuthenticated) {
    res.render('index', { title: 'Antartic Base', isAuthenticated });
  } else {
    if (req.user.isMember) {
      res.render('dashboard', { title: 'Member Dashboard', isAuthenticated });
    } else {
      res.render('join', { title: 'Join the Club' });
    }
  }
});
router.get('/join', userController.joinGet);
router.post('/join', userController.joinPost);

module.exports = router;
