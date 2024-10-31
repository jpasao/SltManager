-- MySQL dump 10.19  Distrib 10.3.39-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: dbstl
-- ------------------------------------------------------
-- Server version	10.3.39-MariaDB-0+deb10u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collections` (
  `IdCollection` int(11) NOT NULL AUTO_INCREMENT,
  `IdPatreon` int(11) NOT NULL,
  `CollectionName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdCollection`),
  UNIQUE KEY `collections_unique` (`CollectionName`),
  KEY `collections_patreons_FK` (`IdPatreon`),
  CONSTRAINT `collections_patreons_FK` FOREIGN KEY (`IdPatreon`) REFERENCES `patreons` (`IdPatreon`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `models` (
  `IdModel` int(11) NOT NULL AUTO_INCREMENT,
  `IdPatreon` int(11) NOT NULL,
  `IdCollection` int(11) DEFAULT NULL,
  `ModelName` varchar(200) DEFAULT NULL,
  `Year` smallint(6) DEFAULT NULL,
  `Month` tinyint(4) DEFAULT NULL,
  `Path` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdModel`),
  UNIQUE KEY `models_unique` (`ModelName`),
  KEY `models_FK` (`IdPatreon`),
  CONSTRAINT `models_FK` FOREIGN KEY (`idpatreon`) REFERENCES `patreons` (`idpatreon`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modeltags`
--

DROP TABLE IF EXISTS `modeltags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modeltags` (
  `IdTag` int(11) NOT NULL,
  `IdModel` int(11) NOT NULL,
  PRIMARY KEY (`IdTag`,`IdModel`),
  KEY `modeltags_model_FK` (`IdModel`),
  CONSTRAINT `modeltags_model_FK` FOREIGN KEY (`idmodel`) REFERENCES `models` (`idmodel`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `modeltags_tag_FK` FOREIGN KEY (`idtag`) REFERENCES `tags` (`idtag`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `patreons`
--

DROP TABLE IF EXISTS `patreons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patreons` (
  `IdPatreon` int(11) NOT NULL AUTO_INCREMENT,
  `PatreonName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdPatreon`),
  UNIQUE KEY `patreons_unique` (`PatreonName`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `IdPhoto` int(11) NOT NULL AUTO_INCREMENT,
  `IdModel` int(11) NOT NULL,
  `Image` mediumblob DEFAULT NULL,
  PRIMARY KEY (`IdPhoto`),
  KEY `photos_models_FK` (`IdModel`),
  CONSTRAINT `photos_models_FK` FOREIGN KEY (`IdModel`) REFERENCES `models` (`IdModel`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tags` (
  `IdTag` int(11) NOT NULL AUTO_INCREMENT,
  `TagName` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`IdTag`),
  UNIQUE KEY `tags_unique` (`TagName`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `dbstl` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-31  9:47:12
