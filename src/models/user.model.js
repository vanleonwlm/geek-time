import {sequelize} from '../configs/db.config.js';
import {DataTypes} from 'sequelize';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false,
        field: 'id'
    },
    createTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'create_time'
    },
    updateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'update_time'
    },
    isDelete: {
        type: DataTypes.CHAR,
        allowNull: false,
        defaultValue: 'N',
        field: 'is_delete'
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'username'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'name'
    },
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'avatar_url'
    },
    isVip: {
        type: DataTypes.CHAR,
        allowNull: false,
        field: 'is_vip'
    }
}, {
    tableName: 'user'
});

User.fromGithubUser = (githubUser) => {
    return {
        username: githubUser.login,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url
    };
}

User.getByUsername = async (username) => {
    return await User.findOne({
        where: {
            isDelete: 'N',
            username: username
        }
    });
}

User.update = async (user) => {
    await user.update({
        name: user.name,
        avatarUrl: user.avatarUrl,
        isVip: user.isVip
    });
}

User.save = async (user) => {
    await User.create(user);
}

export default User;