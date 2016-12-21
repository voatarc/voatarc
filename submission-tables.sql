

START TRANSACTION;
SET time_zone = "+00:00";


-- --------------------------------------------------------
-- --------------------------------------------------------


CREATE TABLE submission
(
	  auto_id				INT					NOT NULL AUTO_INCREMENT
	, submission_id			INT					NOT NULL
	, title					VARCHAR( 200 )		NULL
	, timestamp				VARCHAR( 50 )		NULL
	, username				VARCHAR( 100 )		NULL
	, vote_score			VARCHAR( 10 )		NULL
	, comment_count			VARCHAR( 10 )		NULL
	, submission_link		VARCHAR( 200 )		NULL
	, submission_text		VARCHAR( 4000 )		NULL
	
	/* Keys and Indexes */
	, PRIMARY KEY (auto_id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------
-- --------------------------------------------------------


CREATE TABLE comment
(
	  auto_id				INT					NOT NULL AUTO_INCREMENT
	, submission_id			INT					NOT NULL
	, comment_id			INT					NOT NULL
	, parent_comment_id		INT					NULL
	, timestamp				VARCHAR( 50 )		NULL
	, username				VARCHAR( 100 )		NULL
	, up_votes				VARCHAR( 10 )		NULL
	, down_votes			VARCHAR( 10 )		NULL
	, vote_score			VARCHAR( 10 )		NULL
	, comment_text			VARCHAR( 4000 )		NULL
	
	/* Keys and Indexes */
	, PRIMARY KEY (auto_id)
)
ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------
-- --------------------------------------------------------


COMMIT;
