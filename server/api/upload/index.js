import {Router} from 'express';
const auth = require('../../auth/auth.service');
const controller = require('./upload.controller');

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/clean', auth.hasRole('admin'), controller.clean);
router.get('/count', auth.hasRole('admin'), controller.count);
router.get('/:id', controller.show);
router.post('/', auth.hasRole('admin'), controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
