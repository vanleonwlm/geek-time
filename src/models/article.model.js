import { sequelize } from '../configs/db.config.js';
import { DataTypes } from 'sequelize';
import moment from "moment";
import { COLUMN_FORMS } from '../configs/column.config.js';

const Article = sequelize.define('Article', {
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
    contentHtml: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'content_html'
    },
    isVideo: {
        type: DataTypes.CHAR,
        allowNull: true,
        field: 'is_video'
    },
    videoM3u8: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'video_m3u8'
    },
    hasAudio: {
        type: DataTypes.CHAR,
        allowNull: true,
        field: 'has_audio'
    },
    audioJson: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'audio_json'
    },
    columnId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'column_id'
    },
    chapterId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'chapter_id'
    }
}, {
    tableName: 'article'
});

Article.fromGeekTime = function (geekTimeArticle, columnForm) {
    if (columnForm === COLUMN_FORMS.video) {
        return this.fromGeekTimeVideo(geekTimeArticle);
    } else {
        return this.fromGeekTimeArticle(geekTimeArticle);
    }
}

Article.fromGeekTimeVideo = function (geekTimeArticle) {
    const info = geekTimeArticle.info;
    if (!info.title) {
        return null;
    }

    const product = geekTimeArticle.product;
    const m3u8 = info?.video_preview?.medias?.[0]?.url;

    return Article.build({
        id: info.id,
        createTime: moment(info.ctime * 1000).format('YYYY-MM-DD HH:mm:ss'),
        title: info.title,
        subtitle: info.subtitle,
        intro: null,
        introHtml: info.cshort,
        contentHtml: info.content,
        isVideo: 'Y',
        videoM3u8: m3u8,
        hasAudio: 'N',
        audioJson: '{}',
        columnId: product.id,
        chapterId: info.chapter_id
    });
}

Article.fromGeekTimeArticle = function (geekTimeArticle) {
    if (!geekTimeArticle.article_title) {
        return null;
    }

    const hasAudio = geekTimeArticle.audio_download_url ? 'Y' : 'N';
    const audio = {};
    if (hasAudio === 'Y') {
        audio.size = geekTimeArticle.audio_size;
        audio.dubber = geekTimeArticle.audio_dubber;
        audio.time = geekTimeArticle.audio_time;
        audio.downloadUrl = geekTimeArticle.audio_download_url;
        audio.md5 = geekTimeArticle.audio_md5;
    }
    const audioJson = JSON.stringify(audio);

    return Article.build({
        id: geekTimeArticle.id,
        createTime: moment(geekTimeArticle.article_ctime * 1000).format('YYYY-MM-DD HH:mm:ss'),
        title: geekTimeArticle.article_title,
        subtitle: geekTimeArticle.article_subtitle,
        intro: geekTimeArticle.article_summary,
        introHtml: geekTimeArticle.article_cshort,
        contentHtml: geekTimeArticle.article_content,
        isVideo: 'N',
        videoM3u8: null,
        hasAudio: hasAudio,
        audioJson: audioJson,
        columnId: geekTimeArticle.product_id || data.sku,
        chapterId: geekTimeArticle.chapter_id ? parseInt(geekTimeArticle.chapter_id) : 0
    });
}

Article.save = async function (article) {
    const row = await Article.findOne({
        where: {
            isDelete: 'N',
            id: article.id
        }
    });

    if (row) {
        await row.update({
            createTime: article.createTime,
            updateTime: article.updateTime,
            title: article.title,
            subtitle: article.subtitle,
            intro: article.intro,
            introHtml: article.introHtml,
            contentHtml: article.contentHtml,
            isVideo: article.isVideo,
            videoM3u8: article.videoM3u8,
            hasAudio: article.hasAudio,
            audioJson: article.audioJson,
            columnId: article.columnId,
            chapterId: article.chapterId
        });
    } else {
        await Article.create({
            id: article.id,
            createTime: article.createTime,
            updateTime: article.updateTime,
            title: article.title,
            subtitle: article.subtitle,
            intro: article.intro,
            introHtml: article.introHtml,
            contentHtml: article.contentHtml,
            isVideo: article.isVideo,
            videoM3u8: article.videoM3u8,
            hasAudio: article.hasAudio,
            audioJson: article.audioJson,
            columnId: article.columnId,
            chapterId: article.chapterId
        });
    }
}

Article.list = async function (columnId) {
    return Article.findAll({
        where: {
            isDelete: 'N',
            columnId: columnId
        }
    });
}

Article.get = async function (id) {
    return Article.findOne({
        where: {
            isDelete: 'N',
            id: id
        }
    });
}

export default Article;
