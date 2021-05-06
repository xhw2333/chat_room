/*
Navicat MySQL Data Transfer

Source Server         : xhw
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : space

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2021-05-06 17:05:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `gender` int(1) NOT NULL,
  `birthday` date DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'xhw', '123456', 'http://localhost:3000/img/head.jpg', '1@qq.com', '-1', null, null);
INSERT INTO `user` VALUES ('2', 'hjh', '123', 'http://localhost:3000/img/head.jpg', '12@qq.com', '-1', null, null);
INSERT INTO `user` VALUES ('5', 'bb', '123', 'http://localhost:3000/img/head.jpg', '11@qq.com', '-1', null, null);
INSERT INTO `user` VALUES ('6', 'xhw2333', '123456', 'http://localhost:3000/img/head.jpg', '123@qq.com', '-1', null, null);
INSERT INTO `user` VALUES ('7', '的', 'd', 'http://localhost:3000/img/head.jpg', '122@qq.com', '-1', null, '');
