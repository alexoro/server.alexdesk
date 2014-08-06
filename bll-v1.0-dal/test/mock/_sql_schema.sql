SET search_path TO public;

BEGIN;


-- TABLES

CREATE TABLE system_access_tokens (
  id UUID NOT NULL,
  user_type SMALLINT NOT NULL,
  user_id BIGINT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE system_register_confirm (
  id UUID NOT NULL,
  service_user_id BIGINT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE system_reset_password_confirm (
  id UUID NOT NULL,
  service_user_id BIGINT NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE users (
  id BIGINT NOT NULL,
  login VARCHAR(100) NOT NULL,
  password_hash CHAR(32) NOT NULL,
  name VARCHAR(40) NOT NULL,
  registered TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  is_confirmed BOOL NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE apps (
  id BIGINT NOT NULL,
  platform_type SMALLINT NOT NULL,
  title VARCHAR(40) NOT NULL,
  created TIMESTAMPTZ NOT NULL,
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
  app_user_id BIGINT NOT NULL,
  app_id BIGINT NOT NULL,
  login VARCHAR(64) NOT NULL,
  password_hash CHAR(32) NOT NULL,
  name VARCHAR(40) NOT NULL,
  registered TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(app_user_id)
);

CREATE TABLE app_users_extra_android (
  app_id BIGINT NOT NULL,
  app_user_id BIGINT NOT NULL,
  device_uuid CHAR(32) NOT NULL,
  gcm_token TEXT NOT NULL
);


CREATE TABLE chats (
  id BIGINT NOT NULL,
  app_id BIGINT NOT NULL,
  user_creator_id BIGINT NOT NULL,
  user_creator_type SMALLINT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  title VARCHAR(40) NOT NULL,
  type SMALLINT NOT NULL,
  status SMALLINT NOT NULL,
  last_update TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE chat_extra_android (
  chat_id BIGINT NOT NULL,
  app_id BIGINT NOT NULL,
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
  chat_id BIGINT NOT NULL,
  user_type SMALLINT NOT NULL,
  user_id BIGINT NOT NULL
);

CREATE TABLE chat_messages (
  id BIGINT NOT NULL,
  app_id BIGINT NOT NULL,
  chat_id BIGINT NOT NULL,
  user_creator_id BIGINT NOT NULL,
  user_creator_type SMALLINT NOT NULL,
  created TIMESTAMPTZ NOT NULL,
  content TEXT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE chat_messages_extra (
  app_id BIGINT NOT NULL,
  chat_id BIGINT NOT NULL,
  message_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  user_type SMALLINT NOT NULL,
  is_read BOOL NOT NULL
);


-- INDEXES

CREATE UNIQUE INDEX idx_users_login ON users (login);
CREATE INDEX idx_users_registered ON users (registered);
CREATE INDEX idx_users_last_visit ON users (last_visit);
CREATE INDEX idx_apps_platform_type ON apps (platform_type);
CREATE UNIQUE INDEX idx_app_info_extra_android_app_id ON app_info_extra_android (app_id);
CREATE INDEX idx_app_acl_app_id ON app_acl (app_id);
CREATE INDEX idx_app_acl_app_id_and_is_owner ON app_acl (app_id, is_owner);
CREATE INDEX idx_app_users_app_id ON app_users (app_id);
CREATE UNIQUE INDEX idx_app_users_app_id_and_login ON app_users (app_id, login);
CREATE INDEX idx_app_users_registered ON app_users (registered);
CREATE INDEX idx_app_users_last_visit ON app_users (last_visit);
CREATE UNIQUE INDEX idx_app_users_extra_android ON app_users_extra_android (app_id, app_user_id);
CREATE INDEX idx_chats_by_app_id ON chats(app_id);
CREATE INDEX idx_chats_by_app_id_and_user ON chats(app_id, user_creator_id, user_creator_type);
CREATE INDEX idx_chats_by_created ON chats(created);
CREATE UNIQUE INDEX idx_chat_extra_android_by_chat_id ON chat_extra_android(chat_id);
CREATE UNIQUE INDEX idx_chat_extra_android_by_app_id ON chat_extra_android(app_id);
CREATE UNIQUE INDEX idx_chat_participants_by_chat_id ON chat_participants(chat_id);

CREATE INDEX idx_chat_messages_by_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_by_app_id ON chat_messages(app_id);
CREATE UNIQUE INDEX idx_chat_messages_extra_by_message_id ON chat_messages_extra(message_id);
CREATE INDEX idx_chat_messages_extra_by_app_id ON chat_messages_extra(app_id);
CREATE INDEX idx_chat_messages_extra_by_chat_id ON chat_messages_extra(chat_id);


COMMIT;