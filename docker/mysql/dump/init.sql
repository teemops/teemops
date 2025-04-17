-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: 127.0.0.1    Database: tops_dev
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'tops_dev'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_addASG` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_addASG`(

	IN iAppId INT(11),
	IN iUserId INT(11),
    IN isALB TINYINT,
    IN min tinyint,
    IN max tinyint
)
BEGIN

	UPDATE app SET 
		isasg=1,
        isalb=isALB,
        asg_min=min,
        asg_max=max
	where 
		id = iAppId and userid = iUserId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_addSourceCode` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_addSourceCode`(

	IN iAppId INT(11),
    IN sPath VARCHAR(1000),
    IN sSource VARCHAR(255)
)
BEGIN

	INSERT INTO app_code
		(appid, path, source)
    VALUES
		(iAppId, sPath, sSource);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_checkAWSAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_checkAWSAccount`(
	IN iUserId INT(11),
    IN sawsAccountId VARCHAR(45),
    IN saccountAlias VARCHAR(45)
)
BEGIN

	SELECT id FROM
    user_cloud_provider ucp
    WHERE 
		(ucp.userid = iUserId AND
		ucp.aws_account_id=sawsAccountId AND
        ucp.name = saccountAlias) OR 
        (ucp.userid = iUserId AND ucp.name = saccountAlias)
	LIMIT 1;
        
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_deleteAWSConfig` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_deleteAWSConfig`(
	IN iId INT(11),
    IN iUserId INT(11)
)
BEGIN

	DELETE FROM user_data_aws_configs
    WHERE
		id = iId AND
        userid = iUserId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_deleteUserCloudProvider` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_deleteUserCloudProvider`(
	IN iId INT(11),
    IN iUserId INT(11)
)
BEGIN

	DELETE FROM user_cloud_provider
    WHERE
		id = iId AND
        userid = iUserId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAppByUserID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAppByUserID`(
	IN iUserId BIGINT,
	IN iAppId BIGINT
)
BEGIN

	SELECT 
		a.id as appId,
        a.userid as userID,
		a.name, 
		a.status, 
		CAST(a.data AS char(10000) CHARACTER SET utf8) as configData,
		a.appurl, 
		a.timestamp,
		a.app_provider_id AS appProviderId, 
        a.user_cloud_provider_id AS userCloudProviderId,
        a.meta_data as metaData,
        a.notify,
        isasg as hasASG,
		isalb as hasALB,
        a.asg_min as asgMin,
        a.asg_max as asgMax,
        ucp.aws_account_id AS awsAccountId,
        ucp.externalId,
		cp.id AS cloud, 
        cp.name AS cloudProviderName,
		cp.description AS cloudProviderDesc,
        ucp.aws_account_id AS awsAccountId,
		udp.id AS userDataProviderId, 
		udp.aws_auth_method AS awsAuthMethod,
		udp.auth_data AS authData,
		udac.id as awsConfigId, 
        udac.name AS awsConfigName,
		udac.vpc,
        udac.app_subnet AS appSubnet,
        udac.db_subnet AS dbSubnet,
        udac.elb_sg AS elbSecurityGroup,
        udac.app_sg AS appSecurityGroup,
        udac.db_sg AS dbSecurityGroup,
        udac.app_instance_type AS appInstanceType,
        udac.db_instance_type AS dbInstanceType,
        udac.cache_instance_type AS cacheInstanceType,
        udac.custom_data AS customData,
        udac.region,
		apil.image_id as aimageid,
        ap.connect_user as connectUser,
        ap.connect_type as connectType,
        ap.system,
        ap.docker,
        alb.subnets as albSubnets,
        alb.listeners as albListeners,
        alb.sslArn as albSSLArn,
        ap.system as appEnvironment,
        acode.source as codeSource,
        acode.path as codePath
	FROM 
		app AS a INNER join 
        cloud_provider AS cp ON a.cloud = cp.id left join
		user_cloud_provider AS ucp ON ucp.id = a.user_cloud_provider_id left join
		user_data_providers udp ON udp.id = a.user_data_provider_id left join
		user_data_aws_configs udac ON a.aws_config_data_id = udac.id left join 
        app_provider as ap ON a.app_provider_id=ap.id LEFT JOIN
		app_provider_image_list apil ON 
			(ap.parentid=apil.app_provider_id and 
			a.cloud=apil.cloud_provider_id and 
			apil.region=udac.region) left join
        app_alb as alb ON a.id=alb.appid LEFT JOIN
        lookup_environment as lenv ON a.environment=lenv.id LEFT JOIN
        app_code as acode ON a.id=acode.appid
	WHERE 
		a.id=iAppId AND
        a.userid=iUserId AND
        a.status != 7 AND a.status != 8 /*Deleted or Archived*/
	ORDER BY
		apil.timestamp desc
	LIMIT 1;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAppIdFromMeta` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAppIdFromMeta`(
	IN sMetaInstance VARCHAR(255),
	IN sAWSAccountId VARCHAR(45)
)
BEGIN

select 
a.id 
from app a RIGHT JOIN
user_cloud_provider ucp
ON a.user_cloud_provider_id=ucp.id
where 
meta_data 
LIKE CONCAT('%', sMetaInstance, '%')
and aws_account_id=sAWSAccountId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAppList` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAppList`(IN iUserId BIGINT)
BEGIN
SELECT 
	a.*, 
    CAST(a.data AS char(10000) CHARACTER SET utf8) as configData, 
	a.user_data_provider_id AS userDataProviderId,
	ap.name as appProviderName, 
	ap.os, 
    ap.description as appProviderDesc, 
    cp.name as cloudProviderName 
FROM app as a 
INNER JOIN app_provider as ap 
	ON a.app_provider_id = ap.id 
LEFT JOIN cloud_provider cp 
	ON a.cloud=cp.id 
WHERE a.userid =iUserId
ORDER BY timestamp desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAppListByUserID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAppListByUserID`(
	IN iUserId INT
)
BEGIN

	SELECT 
		a.id as appId,
		a.name, 
        a.appurl,
		a.status, 
		CAST(a.data AS char(10000) CHARACTER SET utf8) as configData,
		a.appurl, 
		a.timestamp, 
		a.app_provider_id AS appProviderId, 
        a.user_cloud_provider_id AS userCloudProviderId,
        a.notify,
        ucp.aws_account_id AS awsAccountId,
        ucp.name as accountName,
        a.user_data_provider_id AS userDataProviderId,
        a.aws_config_data_id AS awsConfigId,
		cp.id AS cloud, 
		ap.os, 
        ap.name AS appProviderName,
        ap.description as appProviderDesc, 
        cp.description as cloudProviderDesc,
        udp.auth_data AS authData,
        udac.name AS awsConfigName,
        udac.region
	FROM 
		app as a INNER JOIN 
        app_provider as ap ON a.app_provider_id = ap.id LEFT JOIN 
        cloud_provider cp ON a.cloud=cp.id LEFT JOIN
        user_cloud_provider AS ucp ON a.user_cloud_provider_id = ucp.id left join
        user_data_providers udp ON udp.id = a.user_data_provider_id left join
		user_data_aws_configs udac ON a.aws_config_data_id = udac.id
	WHERE 
		a.userid = iUserId AND
        a.status != 7 AND a.status != 8; /*Deleted or Archived*/

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAWSConfigRegionARN` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAWSConfigRegionARN`(
	IN iAWSConfigId BIGINT
)
BEGIN

	SELECT 
	udac.id, region, auth_data, ucp.aws_account_id as awsAccountId, ucp.id as userCloudProviderId
	FROM
		user_data_aws_configs AS udac 
		LEFT JOIN
		user_cloud_provider AS ucp on udac.user_cloud_provider_id = ucp.id
		RIGHT JOIN
		user_data_providers as udp on ucp.id=udp.user_cloud_provider_id
	WHERE 
		udac.id=iAWSConfigId;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getAWSConfigsByUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getAWSConfigsByUserId`(
	IN iUserId INT(11)
)
BEGIN

	SELECT 
		udac.id,
        udac.name,
        udac.userid AS userId,
        user_cloud_provider_id AS userCloudProviderId,
        ucp.aws_account_id AS awsAccountId,
        vpc,
        app_subnet AS appSubnet,
        db_subnet AS dbSubnet,
        elb_sg AS elbSecurityGroup,
        app_sg AS appSecurityGroup,
        db_sg AS dbSecurityGroup,
        app_instance_type AS appInstanceType,
        db_instance_type AS dbInstanceType,
        cache_instance_type AS cacheInstanceType,
        custom_data AS customData,
        region
	FROM 
		user_data_aws_configs AS udac LEFT JOIN
        user_cloud_provider AS ucp on udac.user_cloud_provider_id = ucp.id
	WHERE 
		udac.userid = iUserId;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getDataProvidersByAccountId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getDataProvidersByAccountId`(
	IN iUserId INT(11),
    IN sAccountId VARCHAR(45)
)
BEGIN

	SELECT 
		udp.*, 
		ucp.id AS user_cloud_provider_id, 
        ucp.aws_account_id
	FROM 
		user_data_providers AS udp INNER JOIN
		user_cloud_provider AS ucp ON ucp.id = udp.user_cloud_provider_id
	WHERE 
		ucp.userid = iUserId AND 
        ucp.aws_account_id = sAccountId;
        
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getDataProvidersByUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getDataProvidersByUserId`(
	IN iUserId INT(11)
)
BEGIN

	SELECT 
		udp.*, 
		ucp.id AS user_cloud_provider_id, 
        ucp.aws_account_id ,
        ucp.name as account_name
	FROM 
		user_data_providers AS udp INNER JOIN
		user_cloud_provider AS ucp ON ucp.id = udp.user_cloud_provider_id
	WHERE 
		ucp.userid = iUserId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getInstanceTypes` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getInstanceTypes`(
	IN sRegion VARCHAR(100)
)
BEGIN
SELECT distinct vm_size, memory, vcpu, region, m.value FROM pricing p
LEFT JOIN region_map m ON p.region=m.pricing_term
RIGHT JOIN allowed_instance_types a ON p.vm_size=a.name
where m.value=sRegion
order by a.id;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getMetaData` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getMetaData`(
	IN iAppId BIGINT
)
BEGIN

select 
meta_data metaData 
from app
where 
id = iAppId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getSTSCreds` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getSTSCreds`(
	IN iAppId BIGINT
)
BEGIN

	SELECT 
		a.id as appId,
        a.userid as userID,
		udp.auth_data AS authData,
        udac.region,
        ucp.*
	FROM 
		app AS a INNER JOIN 
		user_data_providers udp ON udp.id = a.user_data_provider_id LEFT JOIN
        user_data_aws_configs udac ON a.aws_config_data_id = udac.id LEFT JOIN
        user_cloud_provider ucp ON a.userid=ucp.userid
	WHERE 
		a.id=iAppId AND
        a.status != 7 AND a.status != 8 /*Deleted or Archived*/
	LIMIT 1;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getSTSCredsUserAccount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getSTSCredsUserAccount`(
	IN iUserId BIGINT,
    IN iUserCloudProviderId BIGINT,
    IN sAccessType VARCHAR(45)
)
BEGIN

	SELECT 
		udp.auth_data AS authData,
        udp.externalId,
        ucp.*
	FROM 
		user AS u INNER JOIN 
        user_cloud_provider ucp ON u.userid=ucp.userid LEFT JOIN
		user_data_providers udp ON udp.user_cloud_provider_id = ucp.id
	WHERE 
		ucp.id=iUserCloudProviderId
        AND u.userid=iUserId
        AND udp.access_type=sAccessType
	LIMIT 1;



END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getUserById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getUserById`(
	IN userId INT(11)
)
BEGIN

	SET SESSION group_concat_max_len = 1000000;

	SELECT 
		u.userid,
        u.email,
        u.username,
        u.timestamp,
        u.first,
        u.last,
        u.uniqueId,
		CONCAT('[', 
			GROUP_CONCAT(CONCAT('{ "id" :', ucp.id, ', "cloudProviderId" :', ucp.cloud_provider_id, ', "awsAccountId" :"', ucp.aws_account_id, '", "name" :"', ucp.name, '", "isDefault" :', COALESCE(ucp.isDefault, 0), '}') ORDER BY ucp.isDefault DESC), 
		']') AS cloudProviders
	FROM 
		user as u LEFT JOIN 
		user_cloud_provider AS ucp ON u.userid = ucp.userid
	GROUP BY 
		u.userid
	HAVING 
		u.userid = userId;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_getUserIdFromApp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_getUserIdFromApp`(
	IN iAppId BIGINT
)
BEGIN

	SELECT 
        a.userid as userID
	FROM 
		app a
	WHERE 
		a.id=iAppId
	LIMIT 1;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertApp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_insertApp`(

	IN iUserId INT(11),
    IN strName VARCHAR(255),
    IN iStatus INT(11),
	IN iCloudProviderId INT(11),
    IN appData BLOB,
    IN strAppUrl VARCHAR(255),
    IN iAppProviderId INT(11),
	IN iUserCloudProviderId INT(11)
)
BEGIN

	INSERT INTO app
		(userid, name, status, cloud, data, appurl, timestamp, 
        app_provider_id, user_cloud_provider_id)
	VALUES
		(iUserId, strName, 6, iCloudProviderId, appData, strAppUrl, NOW(),
        iAppProviderId, iUserCloudProviderId);

        
	SELECT LAST_INSERT_ID() AS insertId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertAWSConfig` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_insertAWSConfig`(
	IN name VARCHAR(255),
    IN userId INT(11),
    IN userCloudProviderId INT(11),
    IN vpc VARCHAR(45),
    IN appSubnet VARCHAR(1000),
    IN appSecurityGroup VARCHAR(1000),
    IN appInstanceType VARCHAR(45),
    IN customData BLOB,
    IN region VARCHAR(45)
)
BEGIN

	INSERT INTO user_data_aws_configs 
		(name, userid, user_cloud_provider_id, vpc, app_subnet, 
        app_sg, app_instance_type, custom_data, region)
	VALUES
		(name, userId, userCloudProviderId, vpc, appSubnet, 
        appSecurityGroup, appInstanceType, customData, region);

	SELECT LAST_INSERT_ID() AS insertId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertPricing` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_insertPricing`(
	IN cloudId INT(11),
    IN vmSize VARCHAR(45),
    IN vmPricePerHour DECIMAL(18,9),
    IN region VARCHAR(100),
    IN usageType VARCHAR(45),
    IN sMemory VARCHAR(20),
    IN ivcpu INT(11),
    IN skuCode VARCHAR(200),
    IN sOS VARCHAR(50),
    IN metaData TEXT
)
BEGIN
    
	INSERT INTO 
		pricing (cloudid, vm_size, vm_price_per_hour, region, usage_type, memory, vcpu, sku, timestamp, os, meta) 
	VALUES 
		(cloudId,vmSize,vmPricePerHour,region,usageType, sMemory, ivcpu, skuCode, NOW(), sOS, metaData);

	SELECT LAST_INSERT_ID() AS insertId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertUserCloudProvider` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_insertUserCloudProvider`(
	IN iUserId INT(11),
    IN iCloudProviderId INT(11),
    IN awsAccountId VARCHAR(45),
    IN strName VARCHAR(255),
    IN isDefault TINYINT
)
BEGIN

	START TRANSACTION;
    
		IF isDefault = 1
		THEN
			UPDATE user_cloud_provider
			SET isDefault = 0
			WHERE userid = iUserId;
		END IF;

		INSERT INTO 
			user_cloud_provider(userid, cloud_provider_id, aws_account_id, name, isDefault)
		VALUES
			(iUserId, icloudProviderId, awsAccountId, strName, isDefault);
        
	COMMIT;
    
    SELECT LAST_INSERT_ID() AS insertId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_insertUserDataProvider` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_insertUserDataProvider`(
	IN userCloudProviderID INT(11),
    IN awsAuthMethod VARCHAR(45),
    IN authData TEXT,
    IN accessType VARCHAR(45),
    IN sexternalId VARCHAR(200)
)
BEGIN

	INSERT INTO 
		user_data_providers(user_cloud_provider_id, aws_auth_method, auth_data, access_type, externalId)
	VALUES
		(userCloudProviderID, awsAuthMethod, authData, accessType, sexternalId);
        
	SELECT LAST_INSERT_ID() AS insertId;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_updateALB` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_updateALB`(

	IN iAppId INT(11),
	IN sSubnets VARCHAR(255),
    IN sListeners VARCHAR(45),
    IN sSSLArn VARCHAR(255)
)
BEGIN
DECLARE albCount INT DEFAULT 0;

SET albCount=(SELECT count(*) from app_alb 
WHERE appid=iAppId);

IF albCount>0 THEN
	UPDATE app_alb SET 
		subnets = sSubnets, 
        listeners = sListeners,
        sslArn=sSSLArn
        WHERE 
		appid=iAppId;
	SELECT id from app_alb 
	WHERE appid=iAppId;
ELSE
	INSERT INTO app_alb
    (appid, subnets, listeners, sslArn)
    VALUES
    (iAppId, sSubnets, sListeners, sSSLArn);
    SELECT LAST_INSERT_ID() AS insertId;
END IF;


	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_updateApp` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_updateApp`(

	IN iAppId INT(11),
	IN iUserId INT(11),
    IN strName VARCHAR(255),
    IN iStatus INT(11),
	IN iCloudProviderId INT(11),
    IN appData BLOB,
    IN strAppUrl VARCHAR(255),
    IN iAppProviderId INT(11),
	IN iUserCloudProviderId INT(11),
    IN iUserDataProviderId INT(11),
    IN iUserAWSConfigId INT(11)
)
BEGIN

	UPDATE app SET 
		name = strName, 
        cloud = iCloudProviderId, 
        status = iStatus, 
        user_cloud_provider_id = iUserCloudProviderId, 
        user_data_provider_id =iUserDataProviderId, 
        data = appData, 
        appurl = strAppUrl, 
		app_provider_id = iAppProviderId, 
        aws_config_data_id = iUserAWSConfigId
	where 
		id = iAppId and userid = iUserId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_updateAWSConfig` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_updateAWSConfig`(
	IN iId INT(11),
	IN vcName VARCHAR(255),
    IN iUserId INT(11),
    IN iUserCloudProviderId INT(11),
    IN vcVPC VARCHAR(45),
    IN appSubnet VARCHAR(45),
    IN appSecurityGroup VARCHAR(45),
    IN appInstanceType VARCHAR(45),
    IN customData BLOB,
    IN vcRegion VARCHAR(45)
)
BEGIN

	UPDATE user_data_aws_configs
	SET
		name = vcName,
        userid = iUserId,
        user_cloud_provider_id = iUserCloudProviderId,
        vpc = vcVPC,
        app_subnet = appSubnet,
        app_sg = appSecurityGroup,
        app_instance_type = appInstanceType,
        custom_data = customData,
        region = vcRegion
	WHERE
		id = iId;
        
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_updateUserCloudProvider` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `sp_updateUserCloudProvider`(
	IN iId INT(11),
    IN iUserId INT(11),
    IN awsAccountId VARCHAR(45),
    IN strName VARCHAR(255),
    IN bisDefault TINYINT
)
BEGIN

	UPDATE user_cloud_provider 
    SET isDefault = 0 
    WHERE userid = iUserId AND cloud_provider_id = 1;
    
    UPDATE user_cloud_provider 
    SET 
		aws_account_id = IF(ISNULL(awsAccountId), aws_account_id, awsAccountId),
		isDefault = bisDefault,
        name = IF(ISNULL(strName), name, strName)
    WHERE 
		id = iId AND userid = iUserId;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-13 11:39:04
