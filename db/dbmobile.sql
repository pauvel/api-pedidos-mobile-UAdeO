/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 80020
 Source Host           : localhost:3306
 Source Schema         : dbmobile

 Target Server Type    : MySQL
 Target Server Version : 80020
 File Encoding         : 65001

 Date: 15/11/2020 15:06:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes`  (
  `id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nombrecompleto` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `localidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `direccion` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cantcompras` int(0) NOT NULL DEFAULT 0,
  `impcompras` decimal(11, 2) NOT NULL DEFAULT 0.00,
  `ult_visita` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estatus` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for clientes_con_favoritos
-- ----------------------------
DROP TABLE IF EXISTS `clientes_con_favoritos`;
CREATE TABLE `clientes_con_favoritos`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `cliente_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `platillo_id` int(0) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `platillo_id`(`platillo_id`) USING BTREE,
  INDEX `cliente_id`(`cliente_id`) USING BTREE,
  CONSTRAINT `clientes_con_favoritos_ibfk_1` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `clientes_con_favoritos_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for extras
-- ----------------------------
DROP TABLE IF EXISTS `extras`;
CREATE TABLE `extras`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `precio` decimal(6, 2) NOT NULL,
  `url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estatus` tinyint(0) UNSIGNED NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ingredientes
-- ----------------------------
DROP TABLE IF EXISTS `ingredientes`;
CREATE TABLE `ingredientes`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estatus` tinyint(0) UNSIGNED NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pedidos
-- ----------------------------
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `cliente_id` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `importe` decimal(6, 2) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time(0) NOT NULL,
  `entrega` enum('Para recoger','Para entrega') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `localizacion` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `ubicacion` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `comentario` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `estatus` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cliente_id`(`cliente_id`) USING BTREE,
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pedidos_detalles
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_detalles`;
CREATE TABLE `pedidos_detalles`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pedido_id` int(0) UNSIGNED NOT NULL,
  `platillo_id` int(0) UNSIGNED NOT NULL,
  `precio` decimal(6, 2) NOT NULL,
  `cantidad` decimal(6, 2) NOT NULL,
  `importe` decimal(6, 2) NOT NULL,
  `ingredientes` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `estatus` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pedido_id`(`pedido_id`) USING BTREE,
  INDEX `platillo_id`(`platillo_id`) USING BTREE,
  CONSTRAINT `pedidos_detalles_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pedidos_detalles_ibfk_2` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for platillos
-- ----------------------------
DROP TABLE IF EXISTS `platillos`;
CREATE TABLE `platillos`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `precioch` decimal(8, 2) NOT NULL,
  `preciog` decimal(8, 2) NOT NULL,
  `unitario` enum('si','no') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `categoria_id` smallint(0) UNSIGNED NOT NULL,
  `likes` int(0) NULL DEFAULT 0,
  `estatus` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `nombre`(`nombre`) USING BTREE,
  INDEX `categoria_id`(`categoria_id`) USING BTREE,
  CONSTRAINT `platillos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `platillos_categorias` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for platillos_categorias
-- ----------------------------
DROP TABLE IF EXISTS `platillos_categorias`;
CREATE TABLE `platillos_categorias`  (
  `id` smallint(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` varchar(18) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `estatus` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `nombre`(`nombre`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for platillos_con_extras
-- ----------------------------
DROP TABLE IF EXISTS `platillos_con_extras`;
CREATE TABLE `platillos_con_extras`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `platillo_id` int(0) UNSIGNED NOT NULL,
  `extra_id` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `platillo_id`(`platillo_id`) USING BTREE,
  INDEX `extra_id`(`extra_id`) USING BTREE,
  CONSTRAINT `platillos_con_extras_ibfk_1` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `platillos_con_extras_ibfk_2` FOREIGN KEY (`extra_id`) REFERENCES `extras` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for platillos_con_ingredientes
-- ----------------------------
DROP TABLE IF EXISTS `platillos_con_ingredientes`;
CREATE TABLE `platillos_con_ingredientes`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `platillo_id` int(0) UNSIGNED NOT NULL,
  `ingrediente_id` int(0) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `platillo_id`(`platillo_id`) USING BTREE,
  INDEX `ingrediente_id`(`ingrediente_id`) USING BTREE,
  CONSTRAINT `platillos_con_ingredientes_ibfk_1` FOREIGN KEY (`platillo_id`) REFERENCES `platillos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `platillos_con_ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `ingredientes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
