CREATE TABLE system_access_tokens (
    id CHAR(32) NOT NULL,
    user_id BIGINT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE system_captchas (
    id CHAR(16) NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL,
    type SMALLINT NOT NULL,
    answer VARCHAR(10) NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE countries (
    id SERIAL NOT NULL,
    code2 CHAR(2) NOT NULL,
    code3 CHAR(3) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE languages (
    id SERIAL NOT NULL,
    t639_1 CHAR(2) NOT NULL,
    t639_2t CHAR(3) NOT NULL,
    t639_2b CHAR(3) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE devices_android (
    id SERIAL NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(50) NOT NULL,
    width_px SMALLINT NOT NULL,
    height_px SMALLINT NOT NULL,
    density SMALLINT NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE users (
    id BIGSERIAL NOT NULL,
    email VARCHAR(100) NOT NULL,
    password CHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    registered TIMESTAMP WITH TIME ZONE NOT NULL,
    last_visit TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE apps (
    id BIGSERIAL NOT NULL,
    platform_type SMALLINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL,
    is_approved BOOL NOT NULL,
    is_blocked BOOL NOT NULL,
    is_deleted BOOL NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE app_info_extra_android (
    app_id BIGINT NOT NULL,
    package VARCHAR(50) NOT NULL
  );

  CREATE TABLE app_acl (
    app_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_owner BOOL NOT NULL
  );

  CREATE TABLE app_users (
    app_user_id BIGSERIAL NOT NULL,
    app_id BIGINT NOT NULL,
    login VARCHAR(64) NOT NULL,
    password CHAR(32) NOT NULL,
    name VARCHAR(50) NOT NULL,
    registered TIMESTAMP WITH TIME ZONE NOT NULL,
    last_visit TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(app_user_id)
  );

  CREATE TABLE app_users_extra_android (
    app_id BIGINT NOT NULL,
    app_user_id BIGINT NOT NULL,
    country_id INTEGER NOT NULL,
    lang_id INTEGER NOT NULL,
    api SMALLINT NOT NULL,
    app_build INTEGER NOT NULL,
    device_id INTEGER NOT NULL,
    device_uuid CHAR(32) NOT NULL,
    gcm_token TEXT NOT NULL
  );


  CREATE TABLE chats (
    id BIGSERIAL NOT NULL,
    app_id BIGINT NOT NULL,
    user_creator_id BIGINT NOT NULL,
    user_creator_type SMALLINT NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL,
    title VARCHAR(40) NOT NULL,
    type SMALLINT NOT NULL,
    status SMALLINT NOT NULL,
    last_update TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE chat_participants (
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    last_visit TIMESTAMP WITH TIME ZONE NOT NULL
  );

  CREATE TABLE chat_messages (
    id BIGSERIAL NOT NULL,
    app_id BIGINT NOT NULL,
    chat_id BIGINT NOT NULL,
    user_creator_id BIGINT NOT NULL,
    user_creator_type SMALLINT NOT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL,
    platform_type SMALLINT NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY(id)
  );

  CREATE TABLE conversation_messages_extra_android (
    app_id BIGINT NOT NULL,
    chat_message_id BIGINT NOT NULL,
    country_id INTEGER NOT NULL,
    lang_id INTEGER NOT NULL,
    api SMALLINT NOT NULL,
    api_text_value VARCHAR(255) NOT NULL,
    app_build INTEGER NOT NULL,
    app_version VARCHAR(255) NOT NULL,
    device_id INTEGER NOT NULL,
    device_uuid CHAR(32) NOT NULL,
    is_rooted BOOL NOT NULL,
    meta_data TEXT NOT NULL
  );