const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data');


router.get('/home', dataController.view);
router.post('/home', dataController.search);

router.post('/addDepartement', dataController.addDepartement);

router.get('/editDepartement/:id', dataController.editDepartement);
router.post('/editDepartement/:id', dataController.updateDepartement);

router.get('/deleteDepartement/:id', dataController.deleteDepartement);

router.get('/departement', dataController.departement);
router.post('/departement', dataController.searchDep);

router.get('/user', dataController.user);
router.post('/user', dataController.searchUser);

router.get('/needs', dataController.needs);

router.get('/settings/:id', dataController.editAdmin);
router.post('/settings/:id', dataController.updateAdmin);


module.exports = router;