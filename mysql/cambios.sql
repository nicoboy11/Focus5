    DROP TABLE IF EXISTS roleType;
	CREATE TABLE roleType(
		id int PRIMARY KEY AUTO_INCREMENT,
		description varchar(255)
	); 
    #--------------------------------------
    UPDATE ctrl_tareas_detalle
	SET txt_comentario = REplace(txt_comentario,'>','&gt;')
	where txt_comentario like '%>%';
    
    UPDATE ctrl_tareas_detalle
    SET txt_comentario = Replace(txt_comentario,'"','&quot;')
    WHERE txt_comentario like '%"%';
	#--------------------------------------
    #ALTER TABLE bit_view_tarea ADD role_id int NULL;
    #--------------------------------------
    ALTER TABLE cat_proyecto MODIFY id_proyecto INT AUTO_INCREMENT;
    #--------------------------------------
	#--Marcar con rol de creador
	UPDATE bit_view_tarea as bv
	INNER JOIN ctrl_tareas as ct on ct.id_tarea = bv.id_tarea
	SET role_id = 1
	WHERE bv.id_usuario = ct.id_usuario;

	#--Marcar con rol de responsable
	UPDATE bit_view_tarea as bv
	INNER JOIN ctrl_tareas as ct on ct.id_tarea = bv.id_tarea
	SET role_id = 2
	WHERE bv.id_usuario = ct.id_responsable and bv.id_usuario <> ct.id_usuario;

	#--Marcar con rol de participante
	UPDATE bit_view_tarea as bv
	INNER JOIN ctrl_tareas as ct on ct.id_tarea = bv.id_tarea
	SET role_id = 3
	WHERE bv.id_usuario <> ct.id_responsable and bv.id_usuario <> ct.id_usuario    
    #------------------------------------
    DELIMITER $$
	DROP FUNCTION IF EXISTS formatDate$$
	CREATE FUNCTION formatDate(_date datetime) RETURNS varchar(20)
	BEGIN
		RETURN date_format(_date,'%Y-%m-%d %T');
	END$$
    #------------------------------------
	CREATE TABLE priority(
		id int PRIMARY KEY AUTO_INCREMENT,
		description varchar(255)
	);    
    #------------------------------------
	CREATE TABLE esnLog(
		id int PRIMARY KEY AUTO_INCREMENT,
		errorDescription text,
		dateOfError datetime,
		id_usuario int
	);    
    #------------------------------------
	DELIMITER $$
	DROP procedure IF EXISTS `CreatePriority`$$
	CREATE PROCEDURE `CreatePriority` (IN _description varchar(255))
	BEGIN

		INSERT INTO priority(description) VALUES(_description);

		SELECT LAST_INSERT_ID() as id;
		
	END$$

	DELIMITER $$
	DROP procedure IF EXISTS `GetPriority`$$
	CREATE PROCEDURE `GetPriority` (IN _id varchar(255))
	BEGIN

		SELECT id,description
		FROM priority
		WHERE id = coalesce(_id,id);
		
	END$$    
    #------------------------------------
    CALL CreatePriority('Ninguna');
	CALL CreatePriority('Baja');
	CALL CreatePriority('Media');
	CALL CreatePriority('Alta');
	CALL CreatePriority('Urgente');
    #------------------------------------
    ALTER TABLE ctrl_tareas
    ADD priority_id int NULL
    #------------------------------------
    UPDATE ctrl_tareas
    SET priority_id = 1
    #------------------------------------
    ALTER TABLE cat_usuario
    ADD color varchar(10) NULL;
    
    ALTER TABLE cat_usuario
    ADD nombre varchar(50) NULL;
    
    ALTER TABLE cat_usuario
    ADD apellidos varchar(100) NULL;
    #------------------------------------
	DELIMITER $$
	DROP procedure IF EXISTS `CreateRoleType`$$
	CREATE PROCEDURE `CreateRoleType` (IN _description varchar(255))
	BEGIN

		INSERT INTO roleType(description) VALUES(_description);

		SELECT LAST_INSERT_ID() as id;
		
	END$$
    #--------------------------------------
	CALL CreateRoleType('Creador');
	CALL CreateRoleType('Responsable');
	CALL CreateRoleType('Participante');
	CALL CreateRoleType('Administrador');  
	#--------------------------------------
	DELIMITER $$
	DROP procedure IF EXISTS `GetRoleType`$$
	CREATE PROCEDURE `GetRoleType` (IN _id varchar(255))
	BEGIN

		SELECT id,description
		FROM roleType
		WHERE id = coalesce(_id,id);
		
	END$$

	DELIMITER $$
	DROP procedure IF EXISTS `EditRoleType`$$
	CREATE PROCEDURE `EditRoleType` (IN _id int, IN _description varchar(255))
	BEGIN

		UPDATE roleType
		SET description = _description
		WHERE id = _id;
		
	END$$

	DELIMITER $$
	DROP procedure IF EXISTS `CreateProyecto`$$
	CREATE PROCEDURE `CreateProyecto` (IN _txt_proyecto varchar(100), IN _id_usuario int, IN _fec_inicio date, IN _fec_limite date)
	BEGIN
    
		
		DECLARE _id_proyecto INT;
		DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
		/*
			GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
				SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); */
			ROLLBACK;
			
			INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
			VALUES (@full_error, NOW(), _id_usuario );
			
			SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
				
		END;

		START TRANSACTION;    

			INSERT INTO cat_proyecto(txt_proyecto, id_usuario, fec_actualiza, id_status, fec_inicio, fec_limite) 
			VALUES(_txt_proyecto, _id_usuario, NOW(), 1, _fec_inicio, _fec_limite);
			
			SET _id_proyecto = LAST_INSERT_ID();
            
		COMMIT;                   

			CALL getContenido(_id_usuario,_id_proyecto, null, null);
		
	END$$    
    
	DELIMITER $$
	DROP procedure IF EXISTS `EditProyecto`$$
	CREATE PROCEDURE `EditProyecto` (IN _id_proyecto int, IN _txt_proyecto varchar(100), IN _id_usuario int, IN _id_status int, IN _fec_inicio date, IN _fec_limite date)
	BEGIN

		DECLARE EXIT HANDLER FOR SQLEXCEPTION
		BEGIN
		
			/*GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
				SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); */
			ROLLBACK;
			
			INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
			VALUES (@full_error, NOW(), _id_usuario );
			
			SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
				
		END;

		START TRANSACTION;

			UPDATE cat_proyecto
			SET txt_proyecto = _txt_proyecto, 
				id_usuario = _id_usuario, 
				fec_actualiza = NOW(), 
				id_status = _id_status, 
				fec_inicio = _fec_inicio, 
				fec_limite = _fec_limite
			WHERE id_proyecto = _id_proyecto;
            
		COMMIT;       
		
		CALL getContenido(_id_usuario,_id_proyecto, null, null);

END$$         


	#-------------------------------------------------------------------
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS getJsonTarea$$
	CREATE FUNCTION getJsonTarea(_id_proyecto int, _id_usuario int, _bitStatus int) RETURNS MEDIUMTEXT
	BEGIN
		       
		# Status NULL: trae todas las tareas
        # Status 1: trae tareas Activas
        # Status 2: trae tareas Terminadas
               
		DECLARE _tareas text;
		SET SESSION group_concat_max_len = 1000000;
		SELECT concat('[',
						group_concat( concat(
						'{',
							'"id_tarea":',ct.id_tarea,',',
                            '"id_proyecto":',_id_proyecto,',',
							'"txt_tarea":"',ct.txt_tarea,'",',
							'"fec_creacion":"',ct.fec_creacion,'",',
							'"fec_limite":"',ct.fec_limite,'",',
							'"id_status":',ct.id_status,',',
							'"priority_id":"',ct.priority_id,'",',
							'"notificaciones":',FN_ULTIMO_COMMENT(bvt.id_tarea, IFNULL(bvt.fec_actualiza, '2000-01-01')),',',                            
							'"participantes":',getJsonUsuariosTarea(ct.id_tarea),',',
							'"topComments":',getJsonTopComments(ct.id_tarea),'',
						'}') separator ','),
					  ']') INTO _tareas
		FROM ctrl_tareas as ct
		LEFT JOIN vbit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea and bvt.id_usuario = _id_usuario
		WHERE 	ct.id_proyecto = _id_proyecto AND
				CASE WHEN _bitStatus is NULL THEN ct.id_status in (1,2,3) 
					 WHEN _bitStatus = 1 THEN ct.id_status in (1,3)
                     ELSE ct.id_status = 2 END
				AND (ct.id_usuario = _id_usuario
				OR bvt.role_id in (1,2,3,4));
                
		
		RETURN ifnull(_tareas,'[]');

	END$$



	DELIMITER $$
	DROP FUNCTION IF EXISTS getJsonUsuariosTarea$$
	CREATE FUNCTION getJsonUsuariosTarea(_id_tarea int) RETURNS text
	BEGIN

		DECLARE _usuarios text;
		SET SESSION group_concat_max_len = 1000000;
		SELECT concat('[',
						group_concat( concat(
						'{',
							'"id_usuario":',cu.id_usuario,',',
                            '"role_id":',bvt.role_id,',',
							'"txt_usuario":"',cu.txt_usuario,'",',
							'"txt_abbr":"',ifnull(cu.txt_abbr,''),'",',
							'"color":"',ifnull(cu.color,''),'",',
							'"txt_email":"',ifnull(cu.txt_email,''),'"',
						'}') separator ','),
					  ']') INTO _usuarios
		FROM ctrl_tareas as ct
		INNER JOIN vbit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea
		INNER JOIN cat_usuario as cu on cu.id_usuario = bvt.id_usuario
		WHERE 	ct.id_tarea = _id_tarea
				AND bvt.role_id in (1,2,3,4);
		
		RETURN ifnull(_usuarios,'[]');

	END$$


	DELIMITER $$
	DROP FUNCTION IF EXISTS getJsonTopComments$$
	CREATE FUNCTION getJsonTopComments(_id_tarea int) RETURNS text
	BEGIN

		DECLARE _commentarios text;
		SET SESSION group_concat_max_len = 1000000;
		SELECT concat('[',
						group_concat( concat(
						'{',
							'"id_usuario":',sc.id_usuario,',',
							'"txt_usuario":"',sc.txt_usuario,'",',
							'"txt_abbr":"',ifnull(sc.txt_abbr,''),'",',
							'"color":"',ifnull(sc.color,''),'",',
							'"id_tarea_unique":"',ifnull(sc.id_tarea_unique,''),'",',
							'"txt_comentario":"',trim(ifnull(sc.txt_comentario,'')),'",',
							'"imagen":"',ifnull(sc.imagen,''),'",',
							'"fec_comentario":"',ifnull(sc.fec_comentario,''),'",',
							'"id_tipo_comentario":"',ifnull(sc.id_tipo_comentario,''),'",',
							'"txt_email":"',ifnull(sc.txt_email,''),'"',
						'}') separator ','),
					  ']') INTO _commentarios
		FROM (
			SELECT 	cu.id_usuario,
					cu.txt_usuario,
					cu.txt_abbr,
					cu.color,
					ctd.id_tarea_unique,
					ctd.txt_comentario,
					ctd.imagen,
					ctd.fec_comentario,
					ctd.id_tipo_comentario,
					cu.txt_email 
			FROM ctrl_tareas as ct
			INNER JOIN ctrl_tareas_detalle as ctd on ctd.id_tarea = ct.id_tarea
			INNER JOIN cat_usuario as cu on cu.id_usuario = ctd.id_usuario
			WHERE 	ct.id_tarea = _id_tarea
			ORDER BY ctd.fec_comentario desc LIMIT 10
		) sc
        ORDER BY sc.fec_comentario asc;
		       
		RETURN ifnull(_commentarios, '[]');

	END$$    
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS vbit_view_tarea$$
	CREATE VIEW vbit_view_tarea AS                
	 SELECT id_tarea,id_usuario,max(ifnull(fec_actualiza,'1900-01-01')) as fec_actualiza, min(role_id) as role_id 
	 FROM bit_view_tarea
	 GROUP BY id_tarea,id_usuario        $$
#------------------------------------------------------------------------------

	#¿Quien puede ver?
	#	-El creador de la tarea ó del proyecto **
    #    -Participantes de la tarea **
    #    -Responsable de la tarea ó el proyecto **
        
       
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS GetUsuario$$
	CREATE PROCEDURE `GetUsuario`(IN _id_usuario int)
	BEGIN
		
		SELECT	p.id_usuario,
				p.txt_login,	
				p.txt_usuario,
				#formatDate(p.dateOfBirth) as dateOfBirth,
				p.txt_email,
				#p.mobile,
				#ifnull(p.phone,'') as phone,
				#ifnull(p.ext,'') as ext,
				#formatDate(p.startDate) as startDate,
				#formatDate(p.endDate) as endDate,
				p.id_usuario_superior,
				#getFullName(p.higherPersonId) as higherPerson,
				#formatDate(p.lastLogin) as lastLogin,
				#getAvatar(p.id) as avatar,
                p.txt_abbr,
				#p.description,
				#p.job,
				#p.roleId,
				getLevelKey(_id_usuario) as levelKey
				#ifnull(p.theme,'') as theme
		FROM cat_usuario as p
		WHERE p.id_usuario = _id_usuario;
		
	END    
        
	DELIMITER $$
	DROP PROCEDURE IF EXISTS GetLogin$$        
	CREATE PROCEDURE GetLogin(IN _email varchar(255), IN _password varchar(255))
	BEGIN

		DECLARE _id_usuario int;

		SELECT id_usuario INTO _id_usuario
		FROM cat_usuario
		WHERE txt_email = _email AND txt_password = _password;
		
		IF(_id_usuario is null) THEN
			SIGNAL sqlstate 'ERROR' SET message_text = 'The password or email address is incorrect.';
		ELSE
			CALL GetUsuario(_id_usuario);
		END IF;
		
	END    



DELIMITER $$
DROP PROCEDURE IF EXISTS getContenido$$
CREATE PROCEDURE getContenido(_id_usuario int,_id_proyecto int, _status_tareas int, _status_proyectos int)
BEGIN

	# Status NULL: trae todas las tareas
	# Status 1: trae tareas Activas
	# Status 2: trae tareas Terminadas
    
	SELECT 	*,
			getJsonTarea(id_proyecto,_id_usuario,_status_tareas) as tareas
    FROM (
		SELECT 	cp.id_proyecto,
				cp.txt_proyecto,
				cp.id_status,
				formatDate(cp.fec_inicio) as fec_inicio,
				formatDate(cp.fec_limite) as fec_limite
		FROM cat_proyecto as cp
		LEFT JOIN ctrl_tareas as ct on ct.id_proyecto = cp.id_proyecto
		LEFT JOIN bit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea
		WHERE 	(cp.id_usuario = _id_usuario OR bvt.id_usuario = _id_usuario)
				AND cp.id_proyecto = coalesce(_id_proyecto,cp.id_proyecto)
                AND CASE WHEN _status_proyectos IS NULL THEN cp.id_status in (1,2,3)
						 WHEN _status_proyectos = 1 THEN cp.id_status in (1,3)
                         ELSE cp.id_status = 2 END
		GROUP BY cp.id_proyecto, cp.txt_proyecto, cp.id_status
    ) AS SC
    ORDER BY txt_proyecto;

END$$

#SELECT * FROM cat_proyecto
#CALL getContenido('12',NULL,1,1)


DELIMITER $$
DROP FUNCTION IF EXISTS getLevelKey$$
CREATE FUNCTION `getLevelKey`(_id_usuario int) RETURNS varchar(1000) CHARSET utf8
BEGIN

	DECLARE _level int DEFAULT 0;
	DECLARE _id_usuario_superior int DEFAULT 9999;
	DECLARE _it int DEFAULT 0;
	DECLARE _key varchar(1000) DEFAULT '';
    
	SELECT ifnull(id_usuario_superior,0) as id_usuario_superior
	INTO _id_usuario_superior FROM
		cat_usuario
	WHERE id_usuario = _id_usuario;
    
	SET _key = lpad(_id_usuario,4,'0');
    
	SET _key = CONCAT(lpad(_id_usuario_superior,4,'0'),'-',_key);
    
	WHILE _it < 50 && _id_usuario_superior != 0 DO
		
        SELECT ifnull(id_usuario_superior,0) INTO _id_usuario_superior
		FROM cat_usuario
		WHERE id_usuario = _id_usuario_superior;
        
		SET _it = _it + 1;
		SET _level = _level + 1;
		SET _key = CONCAT(lpad(_id_usuario_superior,4,'0'),'-',_key);
        
	END WHILE;
      
	SET _key = REPLACE(_key,'0000-','');
    
	RETURN _key;
    
END$$
/*
select id_usuario from cat_usuario

    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 50;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 12;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 13;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 108;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 109;
    UPDATE cat_usuario SET color = '#AA00FF' WHERE id_usuario = 110;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 111;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 112;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 113;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 114;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 115;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 116;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 117;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 147;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 152;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 153;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 215;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 230;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 231;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 294;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 295;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 296;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 297;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 298;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 299;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 300;
select * from ctrl_Tareas_detalle where id_tarea = 905*/