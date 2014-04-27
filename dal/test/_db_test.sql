-- Users

INSERT INTO users(id, email, password, name, registered, last_visit)
	VALUES(1, 'test@test.com', 'b642b4217b34b1e8d3bd915fc65c4452', 'Test', NOW(), NOW());


-- Apps

INSERT INTO apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted)
    VALUES(1, 2, 'Example App', NOW(), true, false, false);
INSERT INTO app_info_extra_android(app_id, package) VALUES(1, 'com.example');
INSERT INTO app_acl(app_id, user_id, is_owner)
    VALUES(1, 1, 1);

INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES(1, 1, 'test1', '5a105e8b9d40e1329780d62ea2265d8a', 'Test user #1', NOW(), NOW());
INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES(2, 1, 'test2', 'ad0234829205b9033196ba818f7a872b', 'Test user #2', NOW(), NOW());

INSERT INTO app_users_extra_android(app_id, app_user_id, country_id, lang_id, api, app_build, device_id, device_uuid, gcm_token)
    VALUES(1, 1, 1, 1, 10, 1, 1, 'b97f0733069901955d4bae2c674d2fcd', '');
INSERT INTO app_users_extra_android(app_id, app_user_id, country_id, lang_id, api, app_build, device_id, device_uuid, gcm_token)
    VALUES(1, 2, 2, 2, 14, 1, 2, 'ee55941d72dc69392cd8347be701d730', '');

INSERT INTO devices_android(id, manufacturer, model, width_px, height_px, density)
    VALUES(1, 'Google', 'Nexus 4', 800, 1280, 240);
INSERT INTO devices_android(id, manufacturer, model, width_px, height_px, density)
    VALUES(2, 'Samsung', 'S5', 1280, 1920, 320);


-- Help Desk

INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(1, 1, 1, 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(2, 1, 1, 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(3, 1, 2, 2, NOW(), '', 0, 0, NOW());

INSERT INTO chat_participants(chat_id, user_id, last_visit)
    VALUES(1, 1, NOW());
INSERT INTO chat_participants(chat_id, user_id, last_visit)
    VALUES(2, 1, NOW());
INSERT INTO chat_participants(chat_id, user_id, last_visit)
    VALUES(3, 1, NOW());

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(1, 1, 1, 1, 2, NOW(), 2, 'I have question #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(2, 1, 1, 1, 1, NOW(), 1, 'I have answer #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(3, 1, 2, 1, 2, NOW(), 2, 'I have answer #1 again');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(4, 1, 2, 1, 2, NOW(), 2, 'Hey you');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(5, 1, 2, 1, 1, NOW(), 1, 'Wait a minute. Here it is');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(6, 1, 2, 1, 2, NOW(), 2, 'Oh! Thanks');

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(7, 1, 3, 2, 2, NOW(), 2, 'I have a question #2');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, platform_type, content)
    VALUES(8, 1, 3, 1, 1, NOW(), 2, 'I have answer #2');

INSERT INTO conversation_messages_extra_android(app_id, chat_message_id, country_id, lang_id, api, api_text_value, app_build, app_version, devices_android, device_uuid, is_rooted, meta_data)
    VALUES(1, 1, 1, 1, 10, 'Gingerbird', 1, '1.0', 1, 'b97f0733069901955d4bae2c674d2fcd', 0, '');
INSERT INTO conversation_messages_extra_android(app_id, chat_message_id, country_id, lang_id, api, api_text_value, app_build, app_version, devices_android, device_uuid, is_rooted, meta_data)
    VALUES(1, 3, 1, 1, 10, 'Gingerbird', 1, '1.0', 1, 'b97f0733069901955d4bae2c674d2fcd', 0, '');
INSERT INTO conversation_messages_extra_android(app_id, chat_message_id, country_id, lang_id, api, api_text_value, app_build, app_version, devices_android, device_uuid, is_rooted, meta_data)
    VALUES(1, 4, 1, 1, 10, 'Gingerbird', 1, '1.0', 1, 'b97f0733069901955d4bae2c674d2fcd', 0, '');
INSERT INTO conversation_messages_extra_android(app_id, chat_message_id, country_id, lang_id, api, api_text_value, app_build, app_version, devices_android, device_uuid, is_rooted, meta_data)
    VALUES(1, 6, 1, 1, 10, 'Gingerbird', 1, '1.0', 1, 'b97f0733069901955d4bae2c674d2fcd', 0, '');

INSERT INTO conversation_messages_extra_android(app_id, chat_message_id, country_id, lang_id, api, api_text_value, app_build, app_version, devices_android, device_uuid, is_rooted, meta_data)
    VALUES(1, 7, 1, 1, 14, '14 Android', 1, '1.0', 1, 'ee55941d72dc69392cd8347be701d730', 0, '');