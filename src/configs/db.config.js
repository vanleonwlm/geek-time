import Sequelize from 'sequelize';
import env from './env.config.js';

const sequelize = new Sequelize(
    env.db.database,
    env.db.user,
    env.db.password,
    {
        host: env.db.host,
        dialect: 'mysql',
        logging: false,
        define: {
            underscored: true,
            freezeTableName: true,
            timestamps: false,
        }
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

export {
    sequelize,
    testConnection
};  
