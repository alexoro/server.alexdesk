BEGIN;

-- Users

INSERT INTO users(id, login, password_hash, name, registered, last_visit, is_confirmed)
	VALUES(1, 'test@test.com', 'b642b4217b34b1e8d3bd915fc65c4452', 'Test', TIMESTAMPTZ '2014-05-01 12:00:00 +04:00', TIMESTAMPTZ '2014-05-01 14:00:00 +04:00', TRUE);
INSERT INTO users(id, login, password_hash, name, registered, last_visit, is_confirmed)
	VALUES(2, '2@2.com', '1e6fd8e56879c84999cd481255530592', 'Test #2', TIMESTAMPTZ '2014-05-01 12:00:00 +04:00', TIMESTAMPTZ '2014-05-01 14:00:00 +04:00', TRUE);
INSERT INTO users(id, login, password_hash, name, registered, last_visit, is_confirmed)
	VALUES(3, '3@3.com', '317fe8b099749d32b8eea573565842d5', 'Test #3', TIMESTAMPTZ '2014-05-01 12:00:00 +04:00', TIMESTAMPTZ '2014-05-01 14:00:00 +04:00', FALSE);

INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('142b2b49-75f2-456f-9533-435bd0ef94c0', 1, 1, TIMESTAMP '2020-01-01 00:00:00 +00:00');
INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('b6e84344-74e0-43f3-83e0-6a16c3fe6b5d', 1, 3, TIMESTAMP '2020-01-01 00:00:00 +00:00');
INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', 2, 2, TIMESTAMP '2020-01-01 00:00:00 +00:00');
INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('390582c6-a59b-4ab2-a8e1-87fdbb291b97', 2, 3, TIMESTAMP '1970-01-01 00:00:00 +00:00');

INSERT INTO system_register_confirm(id, service_user_id, expires)
    VALUES('0cec4d47-d9a1-4984-8f23-10583b674123', 1, TIMESTAMP '2020-01-01 00:00:00');
INSERT INTO system_register_confirm(id, service_user_id, expires)
    VALUES('de72bca0-1c76-444d-9b1a-ad1f84d04dfb', 3,  TIMESTAMP '2000-01-01 00:00:00 +00:00');
INSERT INTO system_register_confirm(id, service_user_id, expires)
    VALUES('5ece1f7a-c5d0-4a09-97b6-00e8d88a04a1', 3, TIMESTAMP '2020-01-01 00:00:00');

INSERT INTO system_reset_password_confirm(id, service_user_id, expires)
    VALUES('a1df4350-5fcb-4377-8bfb-6576801cda51', 1, TIMESTAMP '2020-01-01 00:00:00');
INSERT INTO system_reset_password_confirm(id, service_user_id, expires)
    VALUES('86fb45f6-2bd4-4918-bd6b-887b6d51b0a9', 1,  TIMESTAMP '2000-01-01 00:00:00 +00:00');
INSERT INTO system_reset_password_confirm(id, service_user_id, expires)
    VALUES('d8463bf9-0af6-4db6-86b7-f9c366cc289e', 3, TIMESTAMP '2020-01-01 00:00:00');
INSERT INTO system_reset_password_confirm(id, service_user_id, expires)
    VALUES('5e604462-4f09-4077-afe7-d84bcdb5004e', 100, TIMESTAMP '2020-01-01 00:00:00');


-- Apps

INSERT INTO apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted)
    VALUES(1, 2, 'Test App', TIMESTAMPTZ '2014-05-01 13:00:00 +04:00', true, false, false);
INSERT INTO apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted)
    VALUES(2, 2, 'Test App #2', TIMESTAMPTZ '2014-05-01 13:00:00 +04:00', true, false, false);

INSERT INTO app_info_extra_android(app_id, package)
    VALUES(1, 'com.testapp');
INSERT INTO app_info_extra_android(app_id, package)
    VALUES(2, 'com.testapp2');

INSERT INTO app_acl(app_id, user_id, is_owner)
    VALUES(1, 1, true);
INSERT INTO app_acl(app_id, user_id, is_owner)
    VALUES(2, 2, true);

INSERT INTO app_users(app_user_id, app_id, login, password_hash, name, registered, last_visit)
    VALUES(2, 1, 'test1', '5a105e8b9d40e1329780d62ea2265d8a', 'Test user #1', TIMESTAMPTZ '2012-05-01 13:00:00 +00:00', TIMESTAMPTZ '2012-05-01 13:26:00 +00:00');
INSERT INTO app_users(app_user_id, app_id, login, password_hash, name, registered, last_visit)
    VALUES(3, 1, 'test2', 'ad0234829205b9033196ba818f7a872b', 'Test user #2', TIMESTAMPTZ '2012-05-01 13:05:00 +00:00', TIMESTAMPTZ '2012-05-01 13:50:00 +00:00');
INSERT INTO app_users(app_user_id, app_id, login, password_hash, name, registered, last_visit)
    VALUES(4, 2, 'test1_2', '262deb6b64eea95f6502c0604624472f', 'Test user #1 for App #2', TIMESTAMPTZ '2012-05-01 13:05:00 +00:00', TIMESTAMPTZ '2012-05-01 13:50:00 +00:00');

INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES(1, 2, 'b97f0733069901955d4bae2c674d2fcd', '');
INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES(1, 3, 'ee55941d72dc69392cd8347be701d730', '');
INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES(2, 4, 'ee55941d72dc69392cd8347be701d730', '');


-- Help Desk

INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(1, 1, 2, 2, TIMESTAMPTZ '2012-05-01 13:20:00 +00:00', '', 0, 0, TIMESTAMPTZ '2012-05-01 13:10:05 +00:00');
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(2, 1, 2, 2, TIMESTAMPTZ '2012-05-01 13:20:00 +00:00', '', 0, 0, TIMESTAMPTZ '2012-05-01 13:26:00 +00:00');
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(3, 1, 3, 2, TIMESTAMPTZ '2012-05-01 13:20:00 +00:00', '', 0, 0, TIMESTAMPTZ '2012-05-01 13:50:00 +00:00');
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(4, 2, 4, 2, TIMESTAMPTZ '2012-05-01 13:20:00 +00:00', '', 0, 0, TIMESTAMPTZ '2012-05-01 13:50:00 +00:00');

INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(1, 1, 170, 134, 10, 'Gingerbird', 1, '1.0', 'Samsung', 'S5', 1280, 1920, 320, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(2, 1, 170, 134, 10, 'Gingerbird', 1, '1.0', 'Samsung', 'S5', 1280, 1920, 320, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(3, 1, 170, 134, 17, 'KitKat', 1, '1.0', 'LG', 'Mexus 4', 720, 1280, 240, true, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(4, 2, 170, 134, 17, 'KitKat', 1, '1.0', 'LG', 'Mexus 4', 720, 1280, 240, true, '');

INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(1, 1, 1);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(1, 2, 2);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(2, 1, 1);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(2, 2, 2);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(3, 1, 1);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(3, 2, 3);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(4, 1, 2);
INSERT INTO chat_participants(chat_id, user_type, user_id) VALUES(4, 2, 4);


-- Messages

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(1, 1, 1, 2, 2, TIMESTAMPTZ '2012-05-01 13:10:00 +00:00', 'I have question #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(2, 1, 1, 1, 1, TIMESTAMPTZ '2012-05-01 13:10:05 +00:00', 'I have answer #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(3, 1, 2, 2, 2, TIMESTAMPTZ '2012-05-01 13:20:00 +00:00', 'I have question #1 again');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(4, 1, 2, 2, 2, TIMESTAMPTZ '2012-05-01 13:22:00 +00:00', 'Hey you');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(5, 1, 2, 1, 1, TIMESTAMPTZ '2012-05-01 13:25:00 +00:00', 'Wait a minute. Here it is');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(6, 1, 2, 2, 2, TIMESTAMPTZ '2012-05-01 13:26:00 +00:00', 'Oh! Thanks');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(7, 1, 3, 3, 2, TIMESTAMPTZ '2012-05-01 13:40:00 +00:00', 'I have a question #2');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(8, 1, 3, 1, 1, TIMESTAMPTZ '2012-05-01 13:50:00 +00:00', 'I have answer #2');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(9, 2, 4, 4, 2, TIMESTAMPTZ '2012-05-01 13:50:00 +00:00', 'I have question for app #2');

INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(1, 1, 1, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(1, 1, 1, 2, 2, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(2, 1, 1, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(2, 1, 1, 2, 2, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(3, 1, 2, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(3, 1, 2, 2, 2, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(4, 1, 2, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(4, 1, 2, 2, 2, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(5, 1, 2, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(5, 1, 2, 2, 2, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(6, 1, 2, 1, 1, FALSE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(6, 1, 2, 2, 2, TRUE);

INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(7, 1, 3, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(7, 1, 3, 2, 3, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(8, 1, 3, 1, 1, TRUE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(8, 1, 3, 2, 3, FALSE);

INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(9, 2, 4, 1, 1, FALSE);
INSERT INTO chat_messages_extra(message_id, app_id, chat_id, user_type, user_id, is_read)
    VALUES(8, 1, 3, 2, 4, TRUE);

COMMIT;