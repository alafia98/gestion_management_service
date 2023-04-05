const express = require('express');
const router = express();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const session = require('express-session');
const config = require('../config');
const bodyParser = require('body-parser');

router.use(session({secret:config.sessionSecret}));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.set('view engine', 'hbs');
router.set('views', './views');

router.get('/', auth.isLogout, adminController.loadLogin);
router.post('/', adminController.verifyLogin);

router.get('/register', auth.isLogout, adminController.loadRegister);
router.post('/register', adminController.verifyRegister);

router.get('/forgetPassword', auth.isLogout, adminController.loadForgetPassword);
router.post('/forgetPassword', adminController.verifyForgetPassword);

router.get('/logout', auth.isLogout, adminController.logout);

router.get('/home', auth.isLogin, adminController.loadDashboard);
router.get('/homeAr', auth.isLogin, adminController.loadDashboardAr);

router.get('/addService', auth.isLogin, adminController.loadAdd);
router.post('/addService',  adminController.addService);
router.get('/addServiceAr', auth.isLogin, adminController.loadAddAr);
router.post('/addServiceAr',  adminController.addServiceAr);

router.get('/editService/:id', auth.isLogin, adminController.editService);
router.post('/editService/:id', adminController.updateService);
router.get('/editServiceAr/:id', auth.isLogin, adminController.editServiceAr);
router.post('/editServiceAr/:id', adminController.updateServiceAr);

router.get('/deleteService/:id', auth.isLogin, adminController.deleteService);
router.get('/deleteServiceAr/:id', auth.isLogin, adminController.deleteServiceAr);


router.get('/service', auth.isLogin, adminController.service);
router.post('/service', adminController.searchService);
router.get('/serviceAr', auth.isLogin, adminController.serviceAr);
router.post('/serviceAr', adminController.searchServiceAr);

router.get('/user',  auth.isLogin, adminController.user);
router.post('/user', adminController.searchUser);
router.get('/userAr',  auth.isLogin, adminController.userAr);
router.post('/userAr', adminController.searchUserAr);

router.get('/needs', auth.isLogin, adminController.needs);
router.get('/needsAr', auth.isLogin, adminController.needsAr);

router.get('/addAdmin', auth.isLogin, adminController.loadAddAdmin);
router.post('/addAdmin',  adminController.addAdmin);
router.get('/addAdminAr', auth.isLogin, adminController.loadAddAdminAr);
router.post('/addAdminAr',  adminController.addAdminAr);

router.get('/settings', auth.isLogin, adminController.settings);
router.get('/settingsAr', auth.isLogin, adminController.settingsAr);

router.get('/editAdmin/:id', auth.isLogin, adminController.editAdmin);
router.post('/editAdmin/:id', adminController.updateAdmin);
router.get('/editAdminAr/:id', auth.isLogin, adminController.editAdminAr);
router.post('/editAdminAr/:id', adminController.updateAdminAr);

router.get('/deleteAdmin/:id', auth.isLogin, adminController.deleteAdmin);
router.get('/deleteAdminAr/:id', auth.isLogin, adminController.deleteAdminAr);


router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;