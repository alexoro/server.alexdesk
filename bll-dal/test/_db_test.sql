-- Users

INSERT INTO users(id, email, password, name, registered, last_visit)
	VALUES('7026e148-fabe-48cf-8d31-378ab00d5a75', 'test@test.com', 'b642b4217b34b1e8d3bd915fc65c4452', 'Test', NOW(), NOW());
INSERT INTO system_access_tokens(id, user_id, expires)
    VALUES('142b2b49-75f2-456f-9533-435bd0ef94c0', '7026e148-fabe-48cf-8d31-378ab00d5a75', TIMESTAMPTZ '2020-01-01 00:00:00 +00:00');

-- Apps

INSERT INTO apps(id, platform_type, title, created, is_approved, is_blocked, is_deleted)
    VALUES('0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 2, 'Test App', TIMESTAMPTZ '2012-04-30 12:00:00 +04:00', true, false, false);
INSERT INTO app_info_extra_android(app_id, package) VALUES('0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 'com.testapp');
INSERT INTO app_acl(app_id, user_id, is_owner)
    VALUES('0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '7026e148-fabe-48cf-8d31-378ab00d5a75', true);

INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES('6779c315-bc1e-44ff-892c-8420cf16c82d', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 'test1', '5a105e8b9d40e1329780d62ea2265d8a', 'Test user #1', NOW(), NOW());
INSERT INTO app_users(app_user_id, app_id, login, password, name, registered, last_visit)
    VALUES('f3357dcb-ab92-4420-a682-7d255031f17a', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 'test2', 'ad0234829205b9033196ba818f7a872b', 'Test user #2', NOW(), NOW());

INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES('0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '6779c315-bc1e-44ff-892c-8420cf16c82d', 'b97f0733069901955d4bae2c674d2fcd', '');
INSERT INTO app_users_extra_android(app_id, app_user_id, device_uuid, gcm_token)
    VALUES('0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 'f3357dcb-ab92-4420-a682-7d255031f17a', 'ee55941d72dc69392cd8347be701d730', '');


-- Help Desk

INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES('00c33874-2fbd-4b13-82fe-f1a623875a99', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES('8aa5740e-d220-40a5-b846-7191b7dd6637', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), '', 0, 0, NOW());
INSERT INTO chats(id, app_id, user_creator_id, user_creator_type, created, title, type, status, last_update)
    VALUES('757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 'f3357dcb-ab92-4420-a682-7d255031f17a', 2, NOW(), '', 0, 0, NOW());

INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES('00c33874-2fbd-4b13-82fe-f1a623875a99', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 1, 1, 10, 'Gingerbird', 1, '1.0',
        'Samsung', 'S5', 1280, 1920, 240, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES('8aa5740e-d220-40a5-b846-7191b7dd6637', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 1, 1, 10, 'Gingerbird', 1, '1.0',
        'Samsung', 'S5', 1280, 1920, 240, false, '');
INSERT INTO chat_extra_android(chat_id, app_id, country_id, lang_id, api, api_text_value, app_build, app_version,
        device_manufacturer, device_model, device_width_px, device_height_px, device_density, is_rooted, meta_data)
    VALUES('757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 1, 1, 17, 'KitKat', 1, '1.0',
        'LG', 'Nexus 4', 720, 1280, 240, true, '');


INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('00c33874-2fbd-4b13-82fe-f1a623875a99', 1, '7026e148-fabe-48cf-8d31-378ab00d5a75', NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('00c33874-2fbd-4b13-82fe-f1a623875a99', 2, '6779c315-bc1e-44ff-892c-8420cf16c82d', NOW());

INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('8aa5740e-d220-40a5-b846-7191b7dd6637', 1, '7026e148-fabe-48cf-8d31-378ab00d5a75', NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('8aa5740e-d220-40a5-b846-7191b7dd6637', 2, '6779c315-bc1e-44ff-892c-8420cf16c82d', NOW());

INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', 1, '7026e148-fabe-48cf-8d31-378ab00d5a75', NOW());
INSERT INTO chat_participants(chat_id, user_type, user_id, last_visit)
    VALUES('757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', 2, '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', NOW());


-- Messages

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('e17c1552-c35a-41a0-bf36-61bdb2f52bb7', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '00c33874-2fbd-4b13-82fe-f1a623875a99', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), 'I have question #1');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('79d3ebb6-c72c-460c-92cb-79a6a19cd169', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '00c33874-2fbd-4b13-82fe-f1a623875a99', '7026e148-fabe-48cf-8d31-378ab00d5a75', 1, NOW(), 'I have answer #1');

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('a30c00f1-828f-4f7a-b694-cb9b90f70ade', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '8aa5740e-d220-40a5-b846-7191b7dd6637', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), 'I have answer #1 again');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('dce9e7fc-c562-4566-9c87-7288e86e3a5e', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '8aa5740e-d220-40a5-b846-7191b7dd6637', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), 'Hey you');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('1d82d529-4fa9-4dc3-835a-1d3de5440092', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '8aa5740e-d220-40a5-b846-7191b7dd6637', '7026e148-fabe-48cf-8d31-378ab00d5a75', 1, NOW(), 'Wait a minute. Here it is');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('5074c9ff-e671-44fa-8349-974d0dd22a37', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '8aa5740e-d220-40a5-b846-7191b7dd6637', '6779c315-bc1e-44ff-892c-8420cf16c82d', 2, NOW(), 'Oh! Thanks');

INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('1f3454d3-5fb1-4893-8dfa-301e983b1787', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', 2, NOW(), 'I have a question #2');
INSERT INTO chat_messages(id, app_id, chat_id, user_creator_id, user_creator_type, created, content)
    VALUES('a0808c55-3fcd-49fb-9a69-80721c19f17a', '0fd44c33-951a-4f2c-8fb3-6faf41970cb1', '757dbaca-55ed-4c51-ba2f-f8f0aa62f44b', '7026e148-fabe-48cf-8d31-378ab00d5a75', 1, NOW(), 'I have answer #2');