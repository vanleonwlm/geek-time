import express from 'express';
import loginService from '../services/login.service.js';

const router = express.Router();

router.get('/github/oauth/redirect', async (req, res) => {
    const result = await loginService.login(req);
    if (result) {
        res.redirect('/');
    } else {
        res.status(401).send('Login github failure');
    }
});

export default router;
