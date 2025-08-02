import HttpUtils from "../utils/http.utils.js";
import env from "../configs/env.config.js";

const httpUtils = new HttpUtils();
const CLIENT_ID = env.github.oauth.clientId;
const CLIENT_SECRET = env.github.oauth.clientSecret;

const getAccessToken = async (authorizationCode) => {
    const url = `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${authorizationCode}`;
    const headers = {
        accept: 'application/json'
    };
    return await httpUtils.post(url, {}, headers)
        .then((res) => {
            console.log('getAccessToken, response: ' + JSON.stringify(res));
            return res.access_token;
        })
        .catch((err) => {
            console.error('getAccessToken, failure: ' + err);
            return null;
        });
}

const getLoginUser = async (accessToken) => {
    const url = `https://api.github.com/user`;
    const headers = {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
    };
    return await httpUtils.get(url, {}, headers)
        .then((res) => {
            console.log('getLoginUser, user: ' + JSON.stringify(res));
            return res;
        })
        .catch((err) => {
            console.error('getLoginUser, failure: ' + err);
            return null;
        });
}

export default {
    getAccessToken, getLoginUser
}