import githubService from "./github.service.js";
import User from "../models/user.model.js";

const login = async (req) => {
    const code = req.query.code;
    const accessToken = await githubService.getAccessToken(code);
    if (!accessToken) {
        return false;
    }

    const githubUser = await githubService.getLoginUser(accessToken);
    if (!githubUser) {
        return false;
    }

    const username = githubUser.login;
    let loginUser = await User.getByUsername(username);
    if (!loginUser) {
        const newUser = User.fromGithubUser(githubUser);
        newUser.isVip = false;
        await User.save(newUser);

        loginUser = await User.getByUsername(username);
    }
    req.session.user = loginUser;

    return true;
}

export default {
    login
}