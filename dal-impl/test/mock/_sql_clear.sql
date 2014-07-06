SET search_path TO public;

BEGIN;

TRUNCATE system_access_tokens;
TRUNCATE system_register_confirm;
TRUNCATE system_reset_password_confirm;
TRUNCATE users;
TRUNCATE apps;
TRUNCATE app_info_extra_android;
TRUNCATE app_acl;
TRUNCATE app_users;
TRUNCATE app_users_extra_android;
TRUNCATE chats;
TRUNCATE chat_extra_android;
TRUNCATE chat_participants;
TRUNCATE chat_messages;
TRUNCATE chat_messages_extra;

COMMIT;