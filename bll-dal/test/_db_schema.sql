CREATE TABLE system_captchas (
  id UUID NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  type SMALLINT NOT NULL,
  answer VARCHAR(10) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE system_access_tokens (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id UUID NOT NULL,
  email VARCHAR(100) NOT NULL,
  password CHAR(32) NOT NULL,
  name VARCHAR(40) NOT NULL,
  registered TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE apps (
  id UUID NOT NULL,
  platform_type SMALLINT NOT NULL,
  title VARCHAR(40) NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  is_approved BOOL NOT NULL,
  is_blocked BOOL NOT NULL,
  is_deleted BOOL NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE app_info_extra_android (
  app_id UUID NOT NULL,
  package VARCHAR(50) NOT NULL
);

CREATE TABLE app_acl (
  app_id UUID NOT NULL,
  user_id UUID NOT NULL,
  is_owner BOOL NOT NULL
);

CREATE TABLE app_users (
  app_user_id UUID NOT NULL,
  app_id UUID NOT NULL,
  login VARCHAR(64) NOT NULL,
  password CHAR(32) NOT NULL,
  name VARCHAR(40) NOT NULL,
  registered TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(app_user_id)
);

CREATE TABLE app_users_extra_android (
  app_id UUID NOT NULL,
  app_user_id UUID NOT NULL,
  device_uuid CHAR(32) NOT NULL,
  gcm_token TEXT NOT NULL
);


CREATE TABLE chats (
  id UUID NOT NULL,
  app_id UUID NOT NULL,
  user_creator_id UUID NOT NULL,
  user_creator_type SMALLINT NOT NULL,
  title VARCHAR(40) NOT NULL,
  type SMALLINT NOT NULL,
  status SMALLINT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  last_update TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE chat_extra_android (
  chat_id UUID NOT NULL,
  app_id UUID NOT NULL,
  country_id SMALLINT NOT NULL,
  lang_id SMALLINT NOT NULL,
  api SMALLINT NOT NULL,
  api_text_value VARCHAR(40) NOT NULL,
  app_build INTEGER NOT NULL,
  app_version VARCHAR(20) NOT NULL,
  device_manufacturer VARCHAR(20) NOT NULL,
  device_model VARCHAR(20) NOT NULL,
  device_width_px SMALLINT NOT NULL,
  device_height_px SMALLINT NOT NULL,
  device_density SMALLINT NOT NULL,
  is_rooted BOOL NOT NULL,
  meta_data TEXT NOT NULL
);

CREATE TABLE chat_participants (
  chat_id UUID NOT NULL,
  user_type SMALLINT NOT NULL,
  user_id UUID NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL
);

CREATE TABLE chat_messages (
  id UUID NOT NULL,
  app_id UUID NOT NULL,
  chat_id UUID NOT NULL,
  user_creator_id UUID NOT NULL,
  user_creator_type SMALLINT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY(id)
);