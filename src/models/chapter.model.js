import { sequelize } from '../configs/db.config.js';
import { DataTypes } from 'sequelize';

const Chapter = sequelize.define('Chapter', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: false,
        field: 'id'
    },
    createTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'create_time'
    },
    updateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'update_time'
    },
    isDelete: {
        type: DataTypes.CHAR,
        allowNull: false,
        defaultValue: 'N',
        field: 'is_delete'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title'
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rank'
    },
    columnId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'column_id'
    }
}, {
    tableName: 'chapter'
});

Chapter.fromGeekTime = function (geekTimeChapter, rank, columnId) {
    return Chapter.build({
        id: geekTimeChapter.id,
        title: geekTimeChapter.title,
        rank: rank,
        columnId: columnId
    });
};

Chapter.save = async function (chapter) {
    const row = await Chapter.findOne({
        where: {
            isDelete: 'N',
            id: chapter.id
        }
    });

    if (row) {
        await row.update({
            title: chapter.title,
            rank: chapter.rank
        });
    } else {
        await Chapter.create({
            id: chapter.id,
            title: chapter.title,
            rank: chapter.rank,
            columnId: chapter.columnId
        });
    }
}

Chapter.list = function (columnId) {
    return Chapter.findAll({
        where: {
            isDelete: 'N',
            columnId: columnId
        }
    });
};

export default Chapter;
