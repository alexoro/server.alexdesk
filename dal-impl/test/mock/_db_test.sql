-- Users

INSERT INTO users(id, email, password, name, registered, last_visit)
	VALUES(1, 'test@test.com', 'b642b4217b34b1e8d3bd915fc65c4452', 'Test', NOW(), NOW());

INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('142b2b49-75f2-456f-9533-435bd0ef94c0', 1, 1, TIMESTAMPTZ '2020-01-01 00:00:00 +00:00');
INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('302a1baa-78b0-4a4d-ae1f-ebb5a147c71a', 2, 1, TIMESTAMPTZ '2020-01-01 00:00:00 +00:00');
INSERT INTO system_access_tokens(id, user_type, user_id, expires)
    VALUES('390582c6-a59b-4ab2-a8e1-87fdbb291b97', 2, 2, TIMESTAMPTZ '1970-01-01 00:00:00 +00:00');

-- Apps

INSERT INTO apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted)
    VALUES(1, 2, 'Test App', TIMESTAMPTZ '2012-04-30 12:00:00 +04:00', true, false, false);
INSERT INTO app_info_extra_android(app_id, package) VALUES(1, 'com.testapp');
INSERT INTO app_acl(app_id, user_id, is_owner)
    VALUES(1, 1, true);

INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES(1, 1, 'test1', '5a105e8b9d40e1329780d62ea2265d8a', 'Test user #1', NOW(), NOW());
INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES(2, 1, 'test2', 'ad0234829205b9033196ba818f7a872b', 'Test user #2', NOW(), NOW());

INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES(1, 1, 'b97f0733069901955d4bae2c674d2fcd', '');
INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES(1, 2, 'ee55941d72dc69392cd8347be701d730', '');


-- Help Desk

INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(1, 1, 1, 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(2, 1, 1, 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES(3, 1, 2, 2, NOW(), '', 0, 0, NOW());

INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(1, 1, 1, 1, 10, 'Gingerbird', 1, '1.0',
        'Samsung', 'S5', 1280, 1920, 240, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(2, 1, 1, 1, 10, 'Gingerbird', 1, '1.0',
        'Samsung', 'S5', 1280, 1920, 240, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES(3, 1, 1, 1, 17, 'KitKat', 1, '1.0',
        'LG', 'Nexus 4', 720, 1280, 240, true, '');


INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(1, 1, 1, NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(1, 2, 1, NOW());

INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(2, 1, 1, NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(2, 2, 1, NOW());

INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(3, 1, 1, NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES(3, 2, 1, NOW());


-- Messages

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(1, 1, 1, 1, 2, NOW(), 'I have question #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(2, 1, 1, 1, 1, NOW(), 'I have answer #1');

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(3, 1, 2, 1, 2, NOW(), 'I have question #1 again');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(4, 1, 2, 1, 2, NOW(), 'Hey you');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(5, 1, 2, 1, 1, NOW(), 'Wait a minute. Here it is');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(6, 1, 2, 1, 2, NOW(), 'Oh! Thanks');

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(7, 1, 3, 1, 2, NOW(), 'I have a question #2');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES(8, 1, 3, 1, 1, NOW(), 'I have answer #2');