const simpleSession = require('../models/session.model');
const stringUtils = require('../utils/string.utils');

module.exports = {
    checkAuthentication: (req, res, callback) => {
        let token = req.query.token;
        if (!stringUtils.isEmpty(token)) {
            simpleSession.getByToken(token, (err, session) => {
                if (!session) {
                    callback(null, false);
                    return;
                }

                if (session.is_use === 'Y') {
                    callback(null, false);
                    return;
                }

                session.is_use = 'Y';
                session.user_agent = req.get('User-Agent');
                simpleSession.update(session);

                const maxAge = session.expire_time ? session.expire_time - (new Date()) : 365 * 24 * 60 * 60 * 1000;
                res.cookie('token', session.token, {maxAge: maxAge, httpOnly: true});

                callback(null, true);
            });
            return;
        }

        const cookies = req.cookies;
        token = cookies.token;
        if (!token) {
            callback(null, false);
            return;
        }

        simpleSession.getByToken(token, (err, session) => {
            if (!session) {
                callback(null, false);
                return;
            }

            if (session.is_use === 'N') {
                callback(null, false);
                return;
            }

            const now = new Date();
            if (session.expire_time && now > session.expire_time) {
                callback(null, false);
                return;
            }

            callback(null, true);
        });
    }
}
