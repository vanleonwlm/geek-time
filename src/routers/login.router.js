import express from 'express';
import loginService from '../services/login.service.js';
import {redirectErrorPage} from '../utils/common.utils.js'

const router = express.Router();

router.get('/github/oauth/redirect', async (req, res) => {
    const result = await loginService.login(req);
    if (result) {
        res.redirect('/');
    } else {
        redirectErrorPage(req, res, {message: '登录Github失败，请稍后再试'});
    }
});

export default router;
