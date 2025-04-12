
import { sequelize } from '../configs/db.config.js';
import { DataTypes } from 'sequelize';
import moment from 'moment';
import { COLUMN_FORMS } from '../configs/column.config.js';
import { PRODUCT_TYPE_TO_COLUMN_TYPE_MAPPING } from '../configs/geek-time.config.js';

const Column = sequelize.define('Column', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title'
    },
    subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'subtitle'
    },
    intro: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'intro'
    },
    introHtml: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'intro_html'
    },
    coverJson: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'cover_json'
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'tags'
    },
    authorJson: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'author_json'
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'type'
    },
    form: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'form'
    },
    isVideo: {
        type: DataTypes.CHAR,
        allowNull: true,
        field: 'is_video'
    },
    isFinish: {
        type: DataTypes.CHAR,
        allowNull: false,
        field: 'is_finish'
    }
}, {
    tableName: 'column'
});

Column.fromGeekTime = function (geekTimeColumn) {
    const isVideo = geekTimeColumn.is_video || geekTimeColumn.is_video === true ? 'Y' : 'N';
    const isFinish = geekTimeColumn.is_finish || geekTimeColumn.is_finish === true ? 'Y' : 'N';
    const form = isVideo === 'Y' ? COLUMN_FORMS.video : COLUMN_FORMS.article;
    const type = PRODUCT_TYPE_TO_COLUMN_TYPE_MAPPING[`${geekTimeColumn.column_type}`] ? PRODUCT_TYPE_TO_COLUMN_TYPE_MAPPING[`${geekTimeColumn.column_type}`] : geekTimeColumn.column_type;

    return Column.build({
        id: geekTimeColumn.id,
        createTime: moment(geekTimeColumn.begin_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment(geekTimeColumn.end_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
        title: geekTimeColumn.title,
        subtitle: geekTimeColumn.subtitle,
        intro: geekTimeColumn.intro,
        introHtml: geekTimeColumn.intro_html,
        coverJson: JSON.stringify(geekTimeColumn.cover),
        tags: geekTimeColumn.seo.keywords.join(','),
        authorJson: JSON.stringify(geekTimeColumn.author),
        type: type,
        form: form,
        isVideo: isVideo,
        isFinish: isFinish
    });
};

Column.save = async function (column) {
    const row = await Column.findOne({
        where: {
            isDelete: 'N',
            id: column.id
        }
    });

    if (row) {
        await row.update({
            createTime: column.createTime,
            updateTime: column.updateTime,
            title: column.title,
            subtitle: column.subtitle,
            intro: column.intro,
            introHtml: column.introHtml,
            coverJson: column.coverJson,
            tags: column.tags,
            authorJson: column.authorJson,
            type: column.type,
            form: column.form,
            isVideo: column.isVideo,
            isFinish: column.isFinish
        });
    } else {
        await Column.create({
            id: column.id,
            createTime: column.createTime,
            updateTime: column.updateTime,
            title: column.title,
            subtitle: column.subtitle,
            intro: column.intro,
            introHtml: column.introHtml,
            coverJson: column.coverJson,
            tags: column.tags,
            authorJson: column.authorJson,
            type: column.type,
            form: column.form,
            isVideo: column.isVideo,
            isFinish: column.isFinish
        });
    }
}

Column.list = async function () {
    return Column.findAll({
        where: {
            isDelete: 'N',
        }
    });
}

Column.get = async function (id) {
    return Column.findOne({
        where: {
            isDelete: 'N',
            id: id
        }
    });
}

export default Column;
