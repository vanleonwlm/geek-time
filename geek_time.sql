CREATE DATABASE IF NOT EXISTS geek_time CHARACTER SET utf8mb4;

USE geek_time;

CREATE TABLE IF NOT EXISTS `article` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` char(1) NOT NULL DEFAULT 'N',
  `title` varchar(128) NOT NULL,
  `subtitle` varchar(256) DEFAULT NULL,
  `intro` varchar(1024) DEFAULT NULL,
  `intro_html` text,
  `content` text,
  `content_html` longtext,
  `column_id` bigint NOT NULL,
  `chapter_id` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_column_id_create_time` (`column_id`,`create_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chapter` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` char(1) NOT NULL DEFAULT 'N',
  `title` varchar(64) NOT NULL,
  `subtitle` varchar(64) DEFAULT NULL,
  `intro` varchar(256) DEFAULT NULL,
  `intro_html` varchar(4096) DEFAULT NULL,
  `rank` tinyint NOT NULL DEFAULT '1',
  `column_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_column_id_rank` (`column_id`,`rank`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `column` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` char(1) NOT NULL DEFAULT 'N',
  `title` varchar(64) NOT NULL,
  `subtitle` varchar(64) DEFAULT NULL,
  `intro` varchar(2048) DEFAULT NULL,
  `intro_html` varchar(4096) DEFAULT NULL,
  `cover_json` varchar(1024) DEFAULT '{}',
  `tags` varchar(256) DEFAULT NULL,
  `author_json` varchar(2048) DEFAULT '{}',
  `is_finish` char(1) NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `idx_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `simple_session` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` char(1) NOT NULL DEFAULT 'N',
  `token` varchar(128) NOT NULL,
  `expire_time` datetime DEFAULT NULL,
  `is_use` char(1) NOT NULL DEFAULT 'N',
  `user_agent` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_token` (`token`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
