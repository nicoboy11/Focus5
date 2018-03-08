    #ALTER TABLE ctrl_tareas ADD isCalendarSync int DEFAULT NULL;
    #ALTER TABLE ctrl_tareas ADD fec_limiteCal datetime DEFAULT NULL;
    #---------------------------------------
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
	CALL CreateRoleType('Creador');
	CALL CreateRoleType('Responsable');
	CALL CreateRoleType('Participante');
	CALL CreateRoleType('Administrador');       
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

	#--Quitar saltos de linea en textos de la tarea
    UPDATE ctrl_tareas
    SET txt_tarea = replace(replace(replace(txt_tarea,'\n',''),'\t',''),'\r','')
    WHERE txt_tarea like CONCAT('%','\\n','%');
    
    #SELECT * FROM ctrl_tareas WHERE txt_tarea like CONCAT('%','\\n','%');

	#--Marcar con rol de responsable
	UPDATE bit_view_tarea as bv
	INNER JOIN ctrl_tareas as ct on ct.id_tarea = bv.id_tarea
	SET role_id = 2
	WHERE bv.id_usuario = ct.id_responsable and bv.id_usuario <> ct.id_usuario;

	#--Marcar con rol de participante
	UPDATE bit_view_tarea as bv
	INNER JOIN ctrl_tareas as ct on ct.id_tarea = bv.id_tarea
	SET role_id = 3
	WHERE bv.id_usuario <> ct.id_responsable and bv.id_usuario <> ct.id_usuario;
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
    DROP TABLE IF EXISTS subTarea;
	CREATE TABLE subTarea(
		id_tarea int,
		idSubtarea int,
        numOrden int,
		subtarea varchar(255),
        id_status int,
        avance int,
        fec_creacion datetime,
        id_usuario int
	);     
    
    
    
    
    
    
    #------------------------------------
    DELIMITER $$
	DROP FUNCTION IF EXISTS formatDate$$
	CREATE FUNCTION formatDate(_date datetime) RETURNS varchar(20)
	BEGIN
		RETURN date_format(_date,'%Y-%m-%d %T');
	END$$    
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
    ALTER TABLE ctrl_tareas ADD priority_id int NULL;
    ALTER TABLE ctrl_tareas ADD avance int NULL;
    #------------------------------------
    UPDATE ctrl_tareas SET priority_id = 1;
    UPDATE ctrl_tareas SET avance = 50;
    #------------------------------------
    ALTER TABLE cat_usuario ADD color varchar(10) NULL;
    ALTER TABLE cat_usuario ADD nombre varchar(50) NULL;
    ALTER TABLE cat_usuario ADD apellidos varchar(100) NULL;
	ALTER TABLE cat_usuario ADD tel varchar(100) DEFAULT NULL;
    #------------------------------------
    
    
    
    
    
	DELIMITER $$
	DROP procedure IF EXISTS `CreateRoleType`$$
	CREATE PROCEDURE `CreateRoleType` (IN _description varchar(255))
	BEGIN

		INSERT INTO roleType(description) VALUES(_description);

		SELECT LAST_INSERT_ID() as id;
		
	END$$

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
		
			#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
				SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
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
		
			#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
				SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
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
	CREATE FUNCTION getJsonTarea(_id_proyecto int, _id_tarea int, _id_usuario int, _bitStatus int, _start int) RETURNS LONGTEXT
	BEGIN
		       
		# Status NULL: trae todas las tareas
        # Status 1: trae tareas Activas
        # Status 2: trae tareas Terminadas
               
		DECLARE _tareas text;
		SET SESSION group_concat_max_len = 1000000;
        #set @i=0;

        SELECT concat('[',
						group_concat( concat(
						'{',
							'"id_tarea":',sc.id_tarea,',',
                            '"id_proyecto":',sc.id_proyecto,',',
							'"txt_tarea":"',sc.txt_tarea,'",',
							'"fec_creacion":"',sc.fec_creacion,'",',
							'"fec_limite":"',sc.fec_limite,'",',
                            '"fec_limiteCal":"',sc.fec_limiteCal,'",',
                            '"fec_actualiza":"',sc.fec_actualiza,'",',
                            '"isCalendarSync":',sc.isCalendarSync,',',
							'"id_status":',sc.id_status,',',
                            '"avance":',sc.avance,',',
							'"priority_id":"',sc.priority_id,'",',
                            '"commentCount":',sc.commentCount,',',
                            '"role_id":',sc.role_id,',',
							'"notificaciones":',sc.notificaciones,',',                            
							'"participantes":',sc.participantes,',',
                            '"subtareas":',sc.subtareas,',',
							'"topComments":',sc.topComments,'',
						'}') ORDER BY SC.notificaciones desc, FIELD(sc.id_status,1,3,2) asc, sc.fec_limite desc separator ','),
					  ']') INTO _tareas
        FROM (
        SELECT *
        FROM (
			SELECT ct.id_tarea,
				   ifnull(_id_proyecto,ct.id_proyecto) as id_proyecto,
					ct.txt_tarea,
					ct.fec_creacion,
					IFNULL(ct.fec_limite,'') as fec_limite,
                    IFNULL(ct.fec_limiteCal,'') as fec_limiteCal,
                    IFNULL(ct.fec_actualiza,'') as fec_actualiza,
                    IFNULL(ct.isCalendarSync,0) as isCalendarSync,
					ct.id_status,
					IFNULL(ct.avance,0) as avance,
					ct.priority_id,
					getCommentCount(ct.id_tarea) as commentCount,
					case when ct.id_usuario = _id_usuario then 1 else bvt.role_id end as role_id,
					FN_ULTIMO_COMMENT(bvt.id_tarea, IFNULL(bvt.fec_actualiza, '2000-01-01')) as notificaciones,                        
					getJsonUsuariosTarea(ct.id_tarea) as participantes,
					getJsonSubTarea(ct.id_tarea) as subtareas,
					getJsonTopComments(ct.id_tarea,null,NOW()+1) as topComments
			FROM ctrl_tareas as ct
			LEFT JOIN vbit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea and bvt.id_usuario = _id_usuario
			WHERE 	ct.id_proyecto = coalesce(_id_proyecto, ct.id_proyecto) AND
					ct.id_tarea = coalesce(_id_tarea,ct.id_tarea) AND
					CASE WHEN _bitStatus is NULL THEN ct.id_status in (1,2,3) 
						 WHEN _bitStatus = 1 THEN ct.id_status in (1,3)
						 ELSE ct.id_status = 2 END
					AND (ct.id_usuario = _id_usuario
					OR bvt.role_id in (1,2,3,4))
			ORDER BY FIELD(ct.id_status,1,3,2) asc, ifnull(ct.fec_limite,'1960-01-01') desc
            ) as wtf,(SELECT @i:=0) foo
            WHERE (@i:=@i+1) between ifnull(_start,0) and ifnull(_start,0)+15
            ORDER BY FIELD(wtf.id_status,1,3,2) asc, ifnull(wtf.fec_limite,'1960-01-01') desc
		) AS SC;
		
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
                            '"id_usuario_superior":',cu.id_usuario_superior,',',
                            '"clave":"',FN_NIVEL(cu.id_usuario),'",',
                            '"role_id":',case when ct.id_usuario = bvt.id_usuario then 1 else bvt.role_id end,',',
                            '"txt_login":"',cu.txt_login,'",',
							'"txt_usuario":"',cu.txt_usuario,'",',
							'"txt_abbr":"',ifnull(cu.txt_abbr,''),'",',
							'"color":"',ifnull(cu.color,''),'",',
                            '"sn_imagen":',ifnull(cu.sn_imagen,0),',',
                            '"sn_espadre":',FN_ESPADRE(cu.id_usuario),',',
                            '"ultimoVisto":',getUserLastSeen(ct.id_tarea, cu.id_usuario),',',
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
	CREATE FUNCTION getJsonTopComments(_id_tarea int, _id_tarea_detalle int, _fec_comentario datetime) RETURNS text
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
							'"txt_comentario":"',replace(replace(replace(trim(ifnull(sc.txt_comentario,'')),'\n','\\n'),'\t','\\t'),'\r','\\r'),'",',
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
					AND ctd.id_tarea_detalle = coalesce(_id_tarea_detalle, ctd.id_tarea_detalle)
                    AND ctd.fec_comentario < _fec_comentario
                    
			ORDER BY ctd.fec_comentario desc LIMIT 20
		) sc
        ORDER BY sc.fec_comentario asc;
		       
		RETURN ifnull(_commentarios, '[]');

	END$$    
    
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS getJsonSubTarea$$
	CREATE FUNCTION getJsonSubTarea(_id_tarea int) RETURNS text
	BEGIN

		DECLARE _subtareas text;
		SET SESSION group_concat_max_len = 1000000;
		SELECT concat('[',
						group_concat( concat(
						'{',
							'"id_usuario":',sc.id_usuario,',',
                            '"id_tarea":',sc.id_tarea,',',
                            '"idSubtarea":',sc.idSubtarea,',',
                            '"numOrden":',sc.numOrden,',',
                            '"id_status":',sc.id_status,',',
                            '"subtarea":"',sc.subtarea,'"',
						'}') separator ','),
					  ']') INTO _subtareas
		FROM (
			SELECT st.id_usuario,
					st.id_tarea,
                    st.idSubtarea,
                    st.numOrden,
                    st.subtarea,
                    st.id_status
            FROM subtarea as st
            WHERE id_tarea = _id_tarea
        ) as sc;
		
		RETURN ifnull(_subtareas,'[]');

	END$$    
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS getUserLastSeen$$
	CREATE FUNCTION getUserLastSeen(_id_tarea int, _id_usuario int) RETURNS int
	BEGIN

		DECLARE _id_tarea_unique int;
        
		SELECT id_tarea_unique INTO _id_tarea_unique
		FROM vbit_view_tarea as bvt
		INNER JOIN ctrl_tareas_detalle as ctd on ctd.id_tarea = bvt.id_tarea and fec_actualiza >= fec_comentario
		WHERE bvt.id_tarea = _id_tarea and bvt.id_usuario = _id_usuario
		ORDER BY fec_comentario desc LIMIT 1;

		RETURN ifnull(_id_tarea_unique,0);

	END$$      
   
	DELIMITER $$
	DROP FUNCTION IF EXISTS getCommentCount$$
	CREATE FUNCTION getCommentCount(_id_tarea int) RETURNS int
	BEGIN
    
		DECLARE count int;
		SELECT count(*) INTO count FROM ctrl_tareas_detalle WHERE id_tarea = _id_tarea;
        RETURN ifnull(count, 0);
        
    END$$
    
	DELIMITER $$
	DROP FUNCTION IF EXISTS getUserName$$
	CREATE FUNCTION getUserName(_id_usuario int) RETURNS varchar(100)
	BEGIN
    
		DECLARE nombre varchar(100);
		SELECT txt_usuario INTO nombre FROM cat_usuario WHERE id_usuario = _id_usuario;
        RETURN ifnull(nombre, '');
        
    END$$    

	DELIMITER $$
	DROP FUNCTION IF EXISTS getTaskCount$$
	CREATE FUNCTION getTaskCount(_id_proyecto int, _id_status int, _id_usuario int) RETURNS int
	BEGIN
    
		DECLARE count int;
		SELECT count(*) INTO count 
        FROM ctrl_tareas as ct
		LEFT JOIN vbit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea and bvt.id_usuario = _id_usuario
        WHERE 	ct.id_proyecto = _id_proyecto AND
				ct.id_status = _id_status
				AND (ct.id_usuario = _id_usuario
				OR bvt.role_id in (1,2,3,4));
        RETURN ifnull(count, 0);
        
    END$$    
    
	DELIMITER $$
	DROP VIEW IF EXISTS vbit_view_tarea$$
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
	DROP PROCEDURE IF EXISTS GetUsuario$$
	CREATE PROCEDURE `GetUsuario`(IN _id_usuario int)
	BEGIN
		
		SELECT	p.id_usuario,
				p.txt_login,	
				p.txt_usuario,
                p.nombre,
                p.apellidos,
				#formatDate(p.dateOfBirth) as dateOfBirth,
				p.txt_email,
                p.tel,
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
                ifnull(p.sn_imagen,0) as sn_imagen,
				getLevelKey(_id_usuario) as levelKey,
                ifnull(p.color,'black') as color,
				FN_NIVEL(id_usuario) as clave,
				LENGTH(FN_NIVEL(id_usuario)) - LENGTH(REPLACE(FN_NIVEL(id_usuario), '-', '')) as nivel,
				FN_ESPADRE(id_usuario) as sn_espadre,
                id_status
				#ifnull(p.theme,'') as theme
		FROM cat_usuario as p
		WHERE p.id_usuario = _id_usuario;
		
	END$$

        
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
		
	END$$    



DELIMITER $$
DROP PROCEDURE IF EXISTS getContenido$$
CREATE PROCEDURE getContenido(_id_usuario int,_id_proyecto int, _status_tareas int, _status_proyectos int)
BEGIN

	# Status NULL: trae todas las tareas
	# Status 1: trae tareas Activas
	# Status 2: trae tareas Terminadas
	SELECT 	*,
			getTaskCount(id_proyecto, 1, _id_usuario) + getTaskCount(id_proyecto, 2, _id_usuario) + getTaskCount(id_proyecto, 3, _id_usuario) as taskCount,
            getTaskCount(id_proyecto, 2, _id_usuario) + getTaskCount(id_proyecto, 3, _id_usuario) as taskCountTerminadas,
			getJsonTarea(id_proyecto,NULL,_id_usuario,_status_tareas,null) as tareas
    FROM (
		SELECT 	cp.id_proyecto,
				cp.txt_proyecto,
				cp.id_status,
				formatDate(cp.fec_inicio) as fec_inicio,
				formatDate(cp.fec_limite) as fec_limite,
                cp.id_usuario
		FROM cat_proyecto as cp
		LEFT JOIN ctrl_tareas as ct on ct.id_proyecto = cp.id_proyecto
		LEFT JOIN bit_view_tarea as bvt on bvt.id_tarea = ct.id_tarea
		WHERE 	(cp.id_usuario = _id_usuario OR bvt.id_usuario = _id_usuario)
				AND cp.id_proyecto = coalesce(_id_proyecto,cp.id_proyecto)
                AND CASE WHEN _status_proyectos IS NULL THEN cp.id_status in (1,2,3)
						 WHEN _status_proyectos = 1 THEN cp.id_status in (1,3)
                         ELSE cp.id_status = 2 END
		GROUP BY cp.id_proyecto, cp.txt_proyecto, cp.id_status
		UNION ALL
		SELECT 	0 as id_proyecto,
				'TAREAS PERSONALES' as txt_proyecto,
				1 as id_status,
				NULL as fec_inicio,
				NULL as fec_limite,
                _id_usuario as id_usuario
    ) AS SC
    ORDER BY txt_proyecto;

END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS GetMoreComments$$
CREATE PROCEDURE GetMoreComments(_id_tarea int,fec_comentario datetime)
BEGIN
    
	SELECT getJsonTopComments(_id_tarea,NULL,fec_comentario) as comentarios;

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

DELIMITER $$
DROP PROCEDURE IF EXISTS MarcarLeida$$
CREATE PROCEDURE MarcarLeida(IN _id_tarea int, IN _id_usuario int)
BEGIN

	UPDATE bit_view_tarea SET fec_actualiza = NOW() where id_usuario = _id_usuario and id_tarea = _id_tarea;
    SELECT getJsonTarea(NULL,_id_tarea,_id_usuario,NULL,NULL) as tarea;

END;

DELIMITER $$
DROP PROCEDURE IF EXISTS EditTarea$$
CREATE PROCEDURE EditTarea(IN _id_tarea int, IN _txt_tarea varchar(100), IN _txt_descripcion varchar(500), IN _fec_limite datetime, IN _id_usuario int, IN _id_responsable int, 
							IN _id_proyecto int, IN _id_status int, IN _priority_id int, IN _avance int, IN _participantes varchar(1000), IN _fec_limiteCal datetime, IN _isCalendarSync int)
BEGIN

	DECLARE _fl date;
	DECLARE _id_tarea_detalle int;
    DECLARE _ir int;
    DECLARE _notificar_responsable varchar(500);
    DECLARE _notificar_participantes varchar(500);

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	
		#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
		ROLLBACK;
		
		INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
		VALUES (@full_error, NOW(), _id_usuario );
		
		SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
			
	END;

	START TRANSACTION;

	#-----------Valida si es cambio de fecha

    SELECT fec_limite INTO _fl FROM ctrl_tareas WHERE id_tarea = _id_tarea;
    SELECT id_responsable INTO _ir FROM ctrl_tareas WHERE id_tarea = _id_tarea;
	SELECT ifnull(max(id_tarea_detalle),1) + 1 INTO _id_tarea_detalle FROM ctrl_tareas_detalle;
    
    IF(_fec_limite <> _fl)
    THEN
		INSERT INTO ctrl_tareas_detalle(id_tarea,id_tarea_detalle,txt_comentario,imagen,fec_comentario,id_status,id_tarea_depende,id_usuario,id_tipo_comentario)
		VALUES(_id_tarea,_id_tarea_detalle,concat(getUserName(_id_usuario), ' modificó la fecha al ',_fec_limite  ),'',NOW(),1,_id_tarea_detalle,_id_usuario,2);
        
        SET _id_tarea_detalle = _id_tarea_detalle + 1;
    END IF;
    
    IF(_id_responsable <> _ir)
    THEN
		SET @comentario = concat(getUserName(_id_usuario), ' puso como responsable a ',getUserName(_id_responsable)  );
        
        if(_id_responsable = _id_usuario)
        THEN
			SET @comentario = concat(getUserName(_id_usuario), ' se puso como responsable ' );
        END IF;
        
        SET _notificar_responsable = _id_responsable;
        
		INSERT INTO ctrl_tareas_detalle(id_tarea,id_tarea_detalle,txt_comentario,imagen,fec_comentario,id_status,id_tarea_depende,id_usuario,id_tipo_comentario)
		VALUES(_id_tarea,_id_tarea_detalle,@comentario,'',NOW(),1,_id_tarea_detalle,_id_usuario,2);    
    END IF;
    
    
    #-----------Falta validar los cambios para el log
		UPDATE ctrl_tareas
		SET txt_tarea = coalesce(_txt_tarea,txt_tarea),
			txt_descripcion = coalesce(_txt_descripcion,txt_descripcion),
            fec_limite = coalesce(_fec_limite,fec_limite),
            id_usuario = coalesce(_id_usuario,id_usuario),
            id_responsable = coalesce(_id_responsable,id_responsable),
            id_proyecto = coalesce(_id_proyecto,id_proyecto),
            id_status = coalesce(_id_status,id_status),
            priority_id = coalesce(_priority_id,priority_id),
            avance = coalesce(_avance,avance),
            fec_actualiza = NOW(),
            fec_limiteCal = coalesce(_fec_limiteCal, fec_limiteCal),
            isCalendarSync = coalesce(_isCalendarSync, isCalendarSync)
		WHERE id_tarea = _id_tarea;

		#Quitar responsable actual
		UPDATE bit_view_tarea
		SET role_id = 3
		WHERE id_tarea = _id_tarea AND 
				role_id = 2;
        
		IF EXISTS (SELECT * FROM bit_view_tarea where id_tarea = _id_tarea and id_usuario = _id_responsable)
		THEN
			#Si ya tiene registro en esa tarea se pone como responsable
			UPDATE bit_view_tarea
            SET role_id = 2
            WHERE id_usuario = _id_responsable AND
					id_tarea = _id_tarea;

		ELSE
			#Si no tiene registro se inserta el responsable
			INSERT bit_view_tarea (id_tarea, id_usuario, fec_actualiza, role_id)
            VALUE(_id_tarea, _id_usuario, NULL, 2);
			
		END IF;
        
		SELECT group_concat(id_usuario) INTO _notificar_participantes
		FROM bit_view_tarea
		WHERE id_tarea = _id_tarea and role_id = 3;        
		
        #Borrar todos los participantes
		DELETE FROM bit_view_tarea
		WHERE id_tarea = _id_tarea and role_id = 3;

		#reinsertar
		INSERT INTO bit_view_tarea
		SELECT _id_tarea as id_tarea, id_usuario, NULL as fec_actualiza, 3 as role_id 
		FROM cat_usuario 
		WHERE FIND_IN_SET(id_usuario, _participantes);
        
        SELECT getJsonTarea(NULL,_id_tarea,_id_usuario,NULL,NULL) as tarea, _notificar_responsable as responsable_notif, _notificar_participantes as participantes_old;
        
	COMMIT;       
	
END$$   

DELIMITER $$
DROP PROCEDURE IF EXISTS CreateSubtarea$$
CREATE PROCEDURE CreateSubtarea(IN _id_tarea int, IN _subtarea varchar(255), IN _id_usuario int)
BEGIN

	DECLARE _idSubtarea int;
    
    SELECT ifnull(max(idSubtarea),1) + 1 INTO _idSubtarea FROM subTarea WHERE id_tarea = _id_tarea;

	INSERT INTO subTarea (id_tarea, idSubtarea, numOrden, subtarea, id_status, avance, fec_creacion, id_usuario)
    VALUES(_id_tarea,_idSubtarea, _idSubtarea,_subtarea, 1, 0, NOW(), _id_usuario);

	SELECT getJsonSubTarea(_id_tarea) as subtareas;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS EditSubtarea$$
CREATE PROCEDURE EditSubtarea(IN _id_tarea int, IN _idSubtarea int, IN _subtarea varchar(255), IN _id_status int, IN _id_usuario int)
BEGIN

	UPDATE subTarea
    SET subtarea = _subtarea,
		id_status = _id_status,
        id_usuario = _id_usuario
	WHERE 	id_tarea = _id_tarea
			AND idSubtarea = _idSubtarea;

	SELECT getJsonSubTarea(_id_tarea) as subtareas;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS DeleteSubtarea$$
CREATE PROCEDURE DeleteSubtarea(IN _id_tarea int, _idSubtarea int)
BEGIN

	DELETE FROM subTarea
    WHERE id_tarea = _id_tarea AND idSubtarea = _idSubtarea;
	
    SELECT 'ok' as response;

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS GetSubTarea$$
CREATE PROCEDURE GetSubTarea(IN _id_tarea int, IN _id_usuario int)
BEGIN
	SELECT getJsonSubTarea(_id_tarea) as subtarea;
END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS GetTarea$$
CREATE PROCEDURE GetTarea(IN _id_tarea int, IN _id_usuario int)
BEGIN
	SELECT getJsonTarea(NULL, _id_tarea, _id_usuario, NULL,NULL) as tarea;
END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS GetTareasProyecto$$
CREATE PROCEDURE GetTareasProyecto(IN _id_proyecto int, IN _id_usuario int, IN _start int)
BEGIN
	SELECT getJsonTarea(_id_proyecto, NULL, _id_usuario, NULL,_start) as tareas;
END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS CreateTarea$$
CREATE PROCEDURE CreateTarea(IN _txt_tarea varchar(100), IN _txt_descripcion varchar(500), IN _fec_limite date, IN _id_usuario int, IN _id_responsable int, 
							IN _id_proyecto int, IN _priority_id int, IN _participantes varchar(500))
BEGIN
	DECLARE _id_tarea INT;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	
		#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
		ROLLBACK;
		
		INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
		VALUES (@full_error, NOW(), _id_usuario );
		
		SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
			
	END;

	START TRANSACTION;
    
    #-----------Falta validar los cambios para el log

		INSERT INTO ctrl_tareas (txt_tarea, txt_descripcion, fec_limite, id_usuario, id_responsable, id_proyecto, id_status, priority_id, avance, fec_actualiza, id_usuario_actualiza, fec_creacion)
        VALUES(_txt_tarea, _txt_descripcion, _fec_limite, _id_usuario, _id_responsable, _id_proyecto, 1, _priority_id, 0, NOW(), _id_usuario, NOW());
        
        SET _id_tarea = LAST_INSERT_ID();
        
		IF EXISTS (SELECT * FROM bit_view_tarea where id_tarea = _id_tarea and id_usuario = _id_responsable)
		THEN

			UPDATE bit_view_tarea
            SET role_id = 2
            WHERE id_usuario = _id_responsable AND
					id_tarea = _id_tarea;

		ELSE

			INSERT bit_view_tarea (id_tarea, id_usuario, fec_actualiza, role_id)
            VALUE(_id_tarea, _id_usuario, NULL, 2);
			
		END IF;
		
        
		DELETE FROM bit_view_tarea
		WHERE id_tarea = _id_tarea and role_id = 3;

		INSERT INTO bit_view_tarea
		SELECT _id_tarea as id_tarea, id_usuario, NULL as fec_actualiza, 3 as role_id 
		FROM cat_usuario 
		WHERE FIND_IN_SET(id_usuario, _participantes);
        
        SELECT getJsonTarea(NULL,_id_tarea,_id_usuario,NULL,NULL) as tarea;
        
	COMMIT;       
	
END$$   


DELIMITER $$
DROP PROCEDURE IF EXISTS CreateComentario$$
CREATE PROCEDURE CreateComentario(IN _id_tarea int, IN _txt_comentario varchar(500), IN _imagen varchar(500), IN _id_usuario int)
BEGIN
	DECLARE _id_tarea_detalle int;
    
	SELECT ifnull(max(id_tarea_detalle),1) + 1 INTO _id_tarea_detalle FROM ctrl_tareas_detalle;

	INSERT INTO ctrl_tareas_detalle(id_tarea,id_tarea_detalle,txt_comentario,imagen,fec_comentario,id_status,id_tarea_depende,id_usuario,id_tipo_comentario)
	VALUES(_id_tarea,_id_tarea_detalle,_txt_comentario,_imagen,NOW(),1,_id_tarea_detalle-1,_id_usuario,1);


	UPDATE bit_view_tarea SET fec_actualiza = NOW() where id_usuario = _id_usuario and id_tarea = _id_tarea;
    
    SELECT getJsonTopComments(_id_tarea, _id_tarea_detalle, NOW() + 1) as comentario;

END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS EditPerfil$$
CREATE PROCEDURE EditPerfil(IN _id_usuario INT, IN _nombre varchar(50), IN _apellidos varchar(100), IN _tel varchar(100), 
		IN _nombre_corto varchar(200), IN _txt_email varchar(50), IN _sn_imagen int)
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	
		#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
			SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text); 
		ROLLBACK;
		
		INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
		VALUES (@full_error, NOW(), _id_usuario );
		
		SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
			
	END;

	START TRANSACTION;
    
		UPDATE cat_usuario
		SET nombre = _nombre,
			apellidos = _apellidos,
			tel = _tel,
			txt_usuario = _nombre_corto,
			txt_email = _txt_email,
            sn_imagen = coalesce(_sn_imagen, sn_imagen)
		WHERE id_usuario = _id_usuario;
		
		CALL GetUsuario(_id_usuario);
    
	COMMIT;  

END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS EditUsuario$$
CREATE PROCEDURE EditUsuario(IN _id_usuario INT, IN _id_status int, IN _id_usuario_superior int)
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	
		#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
			SET @full_error = ifnull(CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text), ""); 
		ROLLBACK;
		
		INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
		VALUES (@full_error, NOW(), _id_usuario );
		
		SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
			
	END;

	START TRANSACTION;
    
		UPDATE cat_usuario
		SET id_status = _id_status,
			id_usuario_superior = _id_usuario_superior
		WHERE id_usuario = _id_usuario;
		
		CALL GetUsuario(_id_usuario); 
    
	COMMIT;  

END$$


DELIMITER $$
DROP PROCEDURE IF EXISTS EditPassword$$
CREATE PROCEDURE EditPassword(IN _id_usuario INT, IN _txt_password varchar(500))
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	
		#GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT; 
			SET @full_error = ifnull(CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text), ""); 
		ROLLBACK;
		
		INSERT INTO esnLog ( errorDescription, dateOfError, id_usuario )
		VALUES (@full_error, NOW(), _id_usuario );
		
		SIGNAL sqlstate 'ERROR' SET message_text = @full_error;
			
	END;

	START TRANSACTION;
    
		UPDATE cat_usuario
		SET txt_password = _txt_password
		WHERE id_usuario = _id_usuario;
		
		SELECT 'exito' as message;
    
	COMMIT;  

END$$

DELIMITER $$
DROP PROCEDURE IF EXISTS SP_USERS$$
CREATE PROCEDURE `SP_USERS`(IN Ivid_usuario int,vtxt varchar(50))
BEGIN
SELECT 	id_usuario,
		id_usuario_superior,
        FN_NIVEL(id_usuario) as clave,
        LENGTH(FN_NIVEL(id_usuario)) - LENGTH(REPLACE(FN_NIVEL(id_usuario), '-', '')) as nivel,
        txt_login,
        txt_usuario,
        txt_email,
        txt_abbr,
        sn_imagen,
        FN_ESPADRE(id_usuario) as sn_espadre,
        color,
        getLevelKey(id_usuario) as levelKey,
        id_status
FROM cat_usuario as cu
WHERE /*FN_NIVEL(id_usuario) like CONCAT('%',lpad(Ivid_usuario,4,'0'),'%') 
		and*/ cu.id_status = 1
        and txt_usuario /*collate utf8_general_ci*/ like CONCAT('%',vtxt,'%') 
ORDER BY cu.id_usuario in (Ivid_usuario) desc,FN_NIVEL(id_usuario);
END$$


/*
select id_usuario from cat_usuario
select * from ctrl_Tareas

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
    
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 301;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 302;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 303;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 304;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 305;
    UPDATE cat_usuario SET color = '#AA00FF' WHERE id_usuario = 306;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 307;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 308;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 309;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 310;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 311;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 312;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 313;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 314;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 315;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 316;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 317;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 318;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 319;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 320;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 321;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 322;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 323;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 324;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 325;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 326;   
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 327;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 328;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 329;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 330;
    UPDATE cat_usuario SET color = '#AA00FF' WHERE id_usuario = 331;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 332;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 333;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 334;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 335;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 336;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 337;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 338;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 339;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 340;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 341;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 342;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 343;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 344;
    UPDATE cat_usuario SET color = '#D50000' WHERE id_usuario = 345;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 346;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 347;
    UPDATE cat_usuario SET color = '#00BFA5' WHERE id_usuario = 348;
    UPDATE cat_usuario SET color = '#00C853' WHERE id_usuario = 349;
    UPDATE cat_usuario SET color = '#304FFE' WHERE id_usuario = 350;
    UPDATE cat_usuario SET color = '#FF6D00' WHERE id_usuario = 351;      
select * from ctrl_Tareas_detalle where id_tarea = 905*/