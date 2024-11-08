SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public, extensions', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '969374ce-c4d8-43b7-990f-89df2a8e5db7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"eric.andrsson@gmail.com","user_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","user_phone":""}}', '2024-10-02 12:47:33.600138+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7a1f1ad-beb6-47cf-a89a-1353c7f3a42c', '{"action":"user_recovery_requested","actor_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-10-08 18:46:45.073569+00', ''),
	('00000000-0000-0000-0000-000000000000', '287c839e-690e-4afe-b40a-7520c059aaaf', '{"action":"user_recovery_requested","actor_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-10-08 18:48:03.756976+00', ''),
	('00000000-0000-0000-0000-000000000000', '5de2a65f-c815-4838-8665-d861195b939e', '{"action":"user_repeated_signup","actor_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:03:51.633201+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aff7c240-6110-4d1e-b157-2a0b7f811c8c', '{"action":"user_repeated_signup","actor_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:03:57.35588+00', ''),
	('00000000-0000-0000-0000-000000000000', '13abd578-f6f6-4702-96c2-693423c6ad7b', '{"action":"user_repeated_signup","actor_id":"1571ff46-8afa-470a-aef4-c786f72c5a36","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:04:05.933348+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a03794a-10c0-4223-95b1-23ca3a5738ec', '{"action":"user_confirmation_requested","actor_id":"9c491a1c-21c9-43cb-8cb3-781ac9502c5a","actor_username":"eric.andrssonn@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:04:21.202892+00', ''),
	('00000000-0000-0000-0000-000000000000', '78631cba-ea7a-4bb8-b46d-890316af0897', '{"action":"user_confirmation_requested","actor_id":"8a5742fc-7f12-43f9-a275-66c9603bac83","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:15:59.105649+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2b7d359-e598-448a-b971-dd6de2c5e69a', '{"action":"user_confirmation_requested","actor_id":"8a5742fc-7f12-43f9-a275-66c9603bac83","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:20:38.473175+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb1935a3-a813-4381-9cac-d270048c955f', '{"action":"user_confirmation_requested","actor_id":"b6d9b764-d30a-4d9d-b6a8-a4a3fe8e3cf2","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:20:51.240668+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e560c07-030e-42fc-95a9-aee09297fcc9', '{"action":"user_confirmation_requested","actor_id":"d0dac62f-0cf9-49f8-ac76-0ca2afd00291","actor_username":"eric.andrssonn@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:26:02.48795+00', ''),
	('00000000-0000-0000-0000-000000000000', '63377a45-dc51-4be9-9bf0-ca8c6d269829', '{"action":"user_confirmation_requested","actor_id":"44d7cd57-327c-4eab-adf0-16a28d951293","actor_username":"asdasd@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:34:03.07178+00', ''),
	('00000000-0000-0000-0000-000000000000', '60863bd4-f524-4cd2-8987-9df04bf6e357', '{"action":"user_confirmation_requested","actor_id":"555514ff-09fa-40c9-91a8-cf5a33352ece","actor_username":"asdasdasd@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:34:52.604721+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b4e5805-e807-4fe2-ab92-14b9cf944bef', '{"action":"user_confirmation_requested","actor_id":"0200bdba-c4e9-447f-a989-6d5cf147bb0e","actor_username":"eric.andrssonasdasd@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 19:36:07.737486+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cfc0d86f-34ec-434d-b128-0e91cfb917af', '{"action":"user_confirmation_requested","actor_id":"b6d9b764-d30a-4d9d-b6a8-a4a3fe8e3cf2","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 20:07:27.91047+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dc753353-a285-443f-a490-8bec9c5ab652', '{"action":"user_confirmation_requested","actor_id":"4235f6fd-c75b-4c96-9e77-201703ea592f","actor_username":"asdasasdasdasdasdasddasd@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 20:09:44.799066+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fa16652-85bf-47a7-b2ea-0896e8ce1d38', '{"action":"user_recovery_requested","actor_id":"4235f6fd-c75b-4c96-9e77-201703ea592f","actor_username":"asdasasdasdasdasdasddasd@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-10-08 20:40:25.33957+00', ''),
	('00000000-0000-0000-0000-000000000000', '505482d7-c039-4473-b320-a18ab34dffdc', '{"action":"user_recovery_requested","actor_id":"b6d9b764-d30a-4d9d-b6a8-a4a3fe8e3cf2","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-10-08 20:40:30.537274+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd452accf-d765-47f8-af3a-dc9d38213adf', '{"action":"user_confirmation_requested","actor_id":"b6d9b764-d30a-4d9d-b6a8-a4a3fe8e3cf2","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-10-08 20:40:32.056263+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbe52ea4-3b37-45c8-8db5-95ddd55de6bf', '{"action":"user_signedup","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-08 20:45:36.658649+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac42f312-2403-4d82-9e15-49414d69d29e', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 20:45:36.664221+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0976bd9-3faa-4956-ba2e-a03780fa49a4', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 20:45:44.155838+00', ''),
	('00000000-0000-0000-0000-000000000000', '829743b9-ad59-4b52-abc2-8f18e282ee45', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 20:47:42.674203+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d023e0d-5126-47cd-babb-86b622db2374', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 20:49:30.022945+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e96e4184-7734-4024-ac68-feb6f5e4768f', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 20:58:40.151712+00', ''),
	('00000000-0000-0000-0000-000000000000', '1aaafd7d-954b-4314-bb22-1873ab5c3f9b', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:00:08.446599+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2597805-45f6-4203-95ad-b821b33bcaaf', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:04:36.293488+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e7b52c8-9f23-4cea-968f-eb9336aa25fa', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:05:37.554971+00', ''),
	('00000000-0000-0000-0000-000000000000', '72d56938-c7f8-469d-a279-caceef3eea8b', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:05:58.094905+00', ''),
	('00000000-0000-0000-0000-000000000000', '7a5beef9-98bf-4046-990b-7cb292c53686', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:29.482001+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a74a043-8644-40f7-a890-ce3c627f6d11', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:32.990628+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a7287f6-c33c-41e9-9596-9371444cd320', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:42.428407+00', ''),
	('00000000-0000-0000-0000-000000000000', '93470c94-3dc9-4273-b00c-6f6c6289541b', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:48.105895+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fdc2fac-1a4c-4a0b-b3a3-3fe9170b6cd3', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:48.241538+00', ''),
	('00000000-0000-0000-0000-000000000000', '023957ce-9ae0-4a5f-91ff-f1f37ec2d42e', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:06:48.372381+00', ''),
	('00000000-0000-0000-0000-000000000000', '85bed110-2c96-42c1-98b8-2692eb6158f5', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-08 21:07:30.705598+00', ''),
	('00000000-0000-0000-0000-000000000000', '19ae2680-cf1b-456a-828e-6583e003f211', '{"action":"token_refreshed","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 07:09:17.142305+00', ''),
	('00000000-0000-0000-0000-000000000000', '13951ee8-7d8e-4e01-9d86-387e6775fb1c', '{"action":"token_revoked","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 07:09:17.145815+00', ''),
	('00000000-0000-0000-0000-000000000000', '370dd6f8-1a9f-4e8e-8112-9d165bcfce65', '{"action":"token_refreshed","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 08:12:46.597429+00', ''),
	('00000000-0000-0000-0000-000000000000', '9fdaa1de-c266-4902-a503-122362b81fa6', '{"action":"token_revoked","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 08:12:46.59951+00', ''),
	('00000000-0000-0000-0000-000000000000', '023c50e1-b7d2-4068-96bd-40b740b35173', '{"action":"token_refreshed","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 09:19:19.384229+00', ''),
	('00000000-0000-0000-0000-000000000000', '3df758de-be8f-44eb-af0e-b00d5f757a1b', '{"action":"token_revoked","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 09:19:19.386082+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e9c41d1-4cea-45d9-beef-99a22b62d35f', '{"action":"token_refreshed","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 10:27:38.171632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba654aef-80e6-4da1-94a7-e2e6616a40e8', '{"action":"token_revoked","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 10:27:38.17441+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c1e1177-eabb-4940-99ad-6d814ef841b3', '{"action":"token_refreshed","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 11:27:28.904894+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c8cb359-492d-4cf4-bf31-8751428f54d2', '{"action":"token_revoked","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 11:27:28.907344+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4f596a2-e165-4fe2-a446-7e4993115295', '{"action":"user_modified","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"user"}', '2024-10-09 11:37:29.040249+00', ''),
	('00000000-0000-0000-0000-000000000000', '9204b571-e811-47fa-9933-0ef80f7edab5', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 11:45:08.612549+00', ''),
	('00000000-0000-0000-0000-000000000000', '69598de1-1e41-420d-9697-a65bd7cee943', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 11:54:59.091026+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c054c0e5-2b74-4832-a96d-0d1de4af607a', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:37:30.549728+00', ''),
	('00000000-0000-0000-0000-000000000000', '153325c3-124c-4eb2-8572-b38649ac6e14', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:38:17.750663+00', ''),
	('00000000-0000-0000-0000-000000000000', '867ab220-3031-418b-9c96-8ccb4eaef34a', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:38:45.262844+00', ''),
	('00000000-0000-0000-0000-000000000000', '2330ffdd-6a9b-477b-adf2-08836d0f6da1', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:39:40.13754+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b98f74c9-d497-4cce-bba0-38fa1541976f', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:39:44.436512+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f22b9c8-21ea-466d-a217-563f648e442f', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:40:05.901523+00', ''),
	('00000000-0000-0000-0000-000000000000', '8354aa88-b6ec-4688-8d64-0d03798a2b0d', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:41:17.103211+00', ''),
	('00000000-0000-0000-0000-000000000000', '62bcf832-44e0-4f94-81fa-f6cd7573294d', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:45:24.658747+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a8e9cbe-7c98-41f3-b8fe-5558dcac71e5', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:46:17.867091+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc2419c8-572a-447d-a94d-70bdfaf943bd', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:46:25.623439+00', ''),
	('00000000-0000-0000-0000-000000000000', '71a986a8-a0b9-4e5f-aaec-7436f1930a55', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:51:59.753516+00', ''),
	('00000000-0000-0000-0000-000000000000', '004cd3cf-5e7a-4824-b0b8-5fa8d4a40583', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:52:53.77742+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd36ec426-31b7-414b-9f1f-bf31b23c8b18', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:58:33.473963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbe99952-1b77-442d-a04d-288fc74221d4', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:58:53.462992+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d745de5-9a0a-4c33-b9f4-c751e7529d87', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:59:02.845032+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b4d2a996-931a-4f7d-be3a-f5802ed8cc79', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 12:59:35.727621+00', ''),
	('00000000-0000-0000-0000-000000000000', '027a45c3-0bca-4d86-b013-31539e48349a', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 12:59:42.929804+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d67f5cb-4772-4c7e-8f77-f885328d5adb', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:00:27.432621+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed87368a-59f7-403e-929c-210fd7fc1f16', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:01:54.211828+00', ''),
	('00000000-0000-0000-0000-000000000000', '028cbd4c-4283-453a-b3c0-cd2bde9ef75c', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:03:46.430951+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f121dd9f-5428-4fbf-bccb-105b3e72e4cc', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:03:50.724967+00', ''),
	('00000000-0000-0000-0000-000000000000', '838ce23d-aea0-4f43-9f3d-b33fe755b340', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:06:28.843014+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6f45a14-faa5-43ba-b700-2d91ecd5c317', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:06:44.369722+00', ''),
	('00000000-0000-0000-0000-000000000000', '870920ef-86cd-4c1a-8465-92e57573f612', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 13:06:51.250313+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a2c3fbe-467f-43b8-a53a-85f12d0bc487', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 13:08:08.824801+00', ''),
	('00000000-0000-0000-0000-000000000000', '88cbd707-4a3a-4ae8-812c-88db41ba24d3', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 14:12:23.320866+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c917cbf-3d63-4b82-a660-71e762c511e5', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 14:38:45.205964+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4f0bbbc-e39e-4935-a300-45fb48605fde', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 14:38:49.477438+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ca31a0f-b294-4221-859f-e92397a468c9', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 16:05:45.150002+00', ''),
	('00000000-0000-0000-0000-000000000000', '87a0ab38-35ba-4f05-885e-a23881f15085', '{"action":"user_signedup","actor_id":"1d8762d3-dcad-404f-999c-571aad22d2f5","actor_username":"abc123@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 16:08:10.553002+00', ''),
	('00000000-0000-0000-0000-000000000000', '54797059-8c55-4cf6-a678-3a4e50c18d25', '{"action":"login","actor_id":"1d8762d3-dcad-404f-999c-571aad22d2f5","actor_username":"abc123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 16:08:10.561043+00', ''),
	('00000000-0000-0000-0000-000000000000', '834bda6d-8520-4bba-8435-07941153a957', '{"action":"login","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 16:08:24.87834+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c008a59-5b7a-4e80-8a45-02701fd5d3c8', '{"action":"logout","actor_id":"e7e479c8-db0c-47d4-82c6-11b35d8795ca","actor_username":"eric.andrsson@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 16:08:30.952781+00', ''),
	('00000000-0000-0000-0000-000000000000', '930fa94c-c0b4-4dd2-88b2-636532a65f85', '{"action":"user_signedup","actor_id":"26b6feef-f299-4c95-99a6-13cebb4f04da","actor_username":"asdasdasdaksjldasd@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 16:08:39.244619+00', ''),
	('00000000-0000-0000-0000-000000000000', '126115c7-91fa-4c1a-978a-408b2ee477ea', '{"action":"login","actor_id":"26b6feef-f299-4c95-99a6-13cebb4f04da","actor_username":"asdasdasdaksjldasd@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 16:08:39.248949+00', ''),
	('00000000-0000-0000-0000-000000000000', '58ab1778-71e2-475b-ad5e-f3dc77e88d9c', '{"action":"logout","actor_id":"26b6feef-f299-4c95-99a6-13cebb4f04da","actor_username":"asdasdasdaksjldasd@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-10-09 16:12:10.946009+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8aaaef8-f31c-46ba-b169-fa71cf460fb3', '{"action":"user_signedup","actor_id":"76383309-22f3-46ac-8341-683cd8bdcbd0","actor_username":"ch@christianhedberg.se","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2024-10-09 17:23:45.518895+00', ''),
	('00000000-0000-0000-0000-000000000000', '51c18153-d5d2-48d9-a5cb-226f96f678a7', '{"action":"login","actor_id":"76383309-22f3-46ac-8341-683cd8bdcbd0","actor_username":"ch@christianhedberg.se","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-10-09 17:23:45.524559+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc84a407-ef05-4fbe-ad34-fb4432fd7b9e', '{"action":"token_refreshed","actor_id":"1d8762d3-dcad-404f-999c-571aad22d2f5","actor_username":"abc123@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 19:44:31.57273+00', ''),
	('00000000-0000-0000-0000-000000000000', '95cbd262-004e-4ac9-84da-500b3f64700b', '{"action":"token_revoked","actor_id":"1d8762d3-dcad-404f-999c-571aad22d2f5","actor_username":"abc123@gmail.com","actor_via_sso":false,"log_type":"token"}', '2024-10-09 19:44:31.57523+00', '');



INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e7e479c8-db0c-47d4-82c6-11b35d8795ca', 'authenticated', 'authenticated', 'eric.andrsson@gmail.com', '$2a$10$mlIdoHriwfMhALFJMNb.6ul61xxbwBe6SJkfJ607A5zfDgnisJ7yG', '2024-10-08 20:45:36.660014+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-09 16:08:24.879425+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "e7e479c8-db0c-47d4-82c6-11b35d8795ca", "name": "", "email": "eric.andrsson@gmail.com", "avatar_url": "", "email_verified": false, "phone_verified": false}', NULL, '2024-10-08 20:45:36.623756+00', '2024-10-09 16:08:24.883553+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '26b6feef-f299-4c95-99a6-13cebb4f04da', 'authenticated', 'authenticated', 'asdasdasdaksjldasd@gmail.com', '$2a$10$fOHEZaN2mqdP7WQC3yIVouBkPf7JKasfbwd4ceD81SCisVIMzB4e6', '2024-10-09 16:08:39.245411+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-09 16:08:39.250191+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "26b6feef-f299-4c95-99a6-13cebb4f04da", "email": "asdasdasdaksjldasd@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-09 16:08:39.22074+00', '2024-10-09 16:08:39.254193+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '76383309-22f3-46ac-8341-683cd8bdcbd0', 'authenticated', 'authenticated', 'ch@christianhedberg.se', '$2a$10$JDf6FJEGQXzrMkBYMQczd.FJr1tXVZ3ICwHZvL/npKv.KYR15homO', '2024-10-09 17:23:45.520974+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-09 17:23:45.525855+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "76383309-22f3-46ac-8341-683cd8bdcbd0", "email": "ch@christianhedberg.se", "email_verified": false, "phone_verified": false}', NULL, '2024-10-09 17:23:45.506524+00', '2024-10-09 17:23:45.529963+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1d8762d3-dcad-404f-999c-571aad22d2f5', 'authenticated', 'authenticated', 'abc123@gmail.com', '$2a$10$va2CiR2oFuTcZllFKVY2dOpme9vGhVsQXivu1O7LLThUmgE4Z5Iwa', '2024-10-09 16:08:10.555244+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-10-09 16:08:10.562636+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "1d8762d3-dcad-404f-999c-571aad22d2f5", "email": "abc123@gmail.com", "email_verified": false, "phone_verified": false}', NULL, '2024-10-09 16:08:10.525781+00', '2024-10-09 19:44:31.583312+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);



INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('e7e479c8-db0c-47d4-82c6-11b35d8795ca', 'e7e479c8-db0c-47d4-82c6-11b35d8795ca', '{"sub": "e7e479c8-db0c-47d4-82c6-11b35d8795ca", "email": "eric.andrsson@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-08 20:45:36.639713+00', '2024-10-08 20:45:36.63988+00', '2024-10-08 20:45:36.63988+00', '64c0265f-af3e-4338-82ee-977c5bbdc756'),
	('1d8762d3-dcad-404f-999c-571aad22d2f5', '1d8762d3-dcad-404f-999c-571aad22d2f5', '{"sub": "1d8762d3-dcad-404f-999c-571aad22d2f5", "email": "abc123@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-09 16:08:10.544331+00', '2024-10-09 16:08:10.544456+00', '2024-10-09 16:08:10.544456+00', '7607819e-70a4-45d7-9422-d900b1025239'),
	('26b6feef-f299-4c95-99a6-13cebb4f04da', '26b6feef-f299-4c95-99a6-13cebb4f04da', '{"sub": "26b6feef-f299-4c95-99a6-13cebb4f04da", "email": "asdasdasdaksjldasd@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-10-09 16:08:39.240667+00', '2024-10-09 16:08:39.240744+00', '2024-10-09 16:08:39.240744+00', 'b8f6def1-65ab-409e-b8bf-5703a1147c6f'),
	('76383309-22f3-46ac-8341-683cd8bdcbd0', '76383309-22f3-46ac-8341-683cd8bdcbd0', '{"sub": "76383309-22f3-46ac-8341-683cd8bdcbd0", "email": "ch@christianhedberg.se", "email_verified": false, "phone_verified": false}', 'email', '2024-10-09 17:23:45.513361+00', '2024-10-09 17:23:45.513473+00', '2024-10-09 17:23:45.513473+00', 'cac89a0b-4b7f-4b52-b834-3130604ffb12');



INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('f7eae1a3-30c8-4c80-b569-41b6c9a91df6', '76383309-22f3-46ac-8341-683cd8bdcbd0', '2024-10-09 17:23:45.526075+00', '2024-10-09 17:23:45.526075+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 12; M2002J9G Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/129.0.6668.70 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/478.0.0.47.115;]', '212.85.92.115', NULL),
	('6845fa4a-59cb-45b9-82d2-58d1493ca31a', '1d8762d3-dcad-404f-999c-571aad22d2f5', '2024-10-09 16:08:10.562765+00', '2024-10-09 19:44:31.585881+00', NULL, 'aal1', NULL, '2024-10-09 19:44:31.585637', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0.1 Mobile/15E148 Safari/604.1', '81.237.104.223', NULL);


INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('6845fa4a-59cb-45b9-82d2-58d1493ca31a', '2024-10-09 16:08:10.568043+00', '2024-10-09 16:08:10.568043+00', 'password', '4d55e296-eabc-41fa-b866-c3af5cd9af9e'),
	('f7eae1a3-30c8-4c80-b569-41b6c9a91df6', '2024-10-09 17:23:45.530546+00', '2024-10-09 17:23:45.530546+00', 'password', 'b3a9953d-7cd2-4b74-bf44-abd0ae96827e');



INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 41, '4gUZA2gEyEQftdcJLtYQDQ', '76383309-22f3-46ac-8341-683cd8bdcbd0', false, '2024-10-09 17:23:45.52795+00', '2024-10-09 17:23:45.52795+00', NULL, 'f7eae1a3-30c8-4c80-b569-41b6c9a91df6'),
	('00000000-0000-0000-0000-000000000000', 38, 'iu00Qtm8J5kqieNNML8XoA', '1d8762d3-dcad-404f-999c-571aad22d2f5', true, '2024-10-09 16:08:10.565194+00', '2024-10-09 19:44:31.578166+00', NULL, '6845fa4a-59cb-45b9-82d2-58d1493ca31a'),
	('00000000-0000-0000-0000-000000000000', 42, 'CXiHlG3IpocVPnxuuieCHg', '1d8762d3-dcad-404f-999c-571aad22d2f5', false, '2024-10-09 19:44:31.580727+00', '2024-10-09 19:44:31.580727+00', 'iu00Qtm8J5kqieNNML8XoA', '6845fa4a-59cb-45b9-82d2-58d1493ca31a');


INSERT INTO "public"."users" ("id", "email", "first_name", "last_name") VALUES
	('e7e479c8-db0c-47d4-82c6-11b35d8795ca', 'eric.andrsson@gmail.com', NULL, NULL),
	('1d8762d3-dcad-404f-999c-571aad22d2f5', 'abc123@gmail.com', NULL, NULL),
	('26b6feef-f299-4c95-99a6-13cebb4f04da', 'asdasdasdaksjldasd@gmail.com', NULL, NULL),
	('76383309-22f3-46ac-8341-683cd8bdcbd0', 'ch@christianhedberg.se', NULL, NULL),
	('00000000-0000-0000-0000-000000000000', 'admin@entra.se', NULL, NULL),
	('00000000-0000-0000-0000-000000000001', 'user@entra.se', NULL, NULL);


SELECT public.assign_role('e7e479c8-db0c-47d4-82c6-11b35d8795ca', 'admin'::public.app_role);


INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('entren', 'entren', NULL, '2024-10-02 13:07:41.527202+00', '2024-10-02 13:07:41.527202+00', true, false, 10485760, '{image/*}', NULL);



-- Updated table for osm_tag_to_place_category

INSERT INTO "public"."osm_tag_to_place_category" ("tag_key", "tag_value", "category_id", "created_at", "updated_at", "priority") VALUES
-- Shopping fallbacks
('shop', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Shopping'), NOW(), NOW(), -1),

-- Food & Drink fallbacks
('amenity', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Food & Drink'), NOW(), NOW(), -1),

-- Leisure fallbacks
('leisure', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Leisure'), NOW(), NOW(), -1),

-- Culture fallbacks
('historic', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Culture'), NOW(), NOW(), -1),

-- Health fallbacks
('healthcare', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Health'), NOW(), NOW(), -1),

-- Education fallbacks
('education', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Education'), NOW(), NOW(), -1),

-- Sport fallbacks
('sport', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Sport'), NOW(), NOW(), -1),

-- Transport fallbacks
('public_transport', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Transport'), NOW(), NOW(), -1),
('highway', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Transport'), NOW(), NOW(), -1),
('railway', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Transport'), NOW(), NOW(), -1),

-- Authorities fallbacks
('office', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Authorities'), NOW(), NOW(), -1),

-- Tourism fallbacks
('tourism', '*', (SELECT category_id FROM "public"."place_categories" WHERE name = 'Tourism'), NOW(), NOW(), -1);


INSERT INTO "public"."entrance_types" ("id", "name", "name_sv", "description", "description_sv", "is_active", "max_per_place") VALUES
    (1, 'Main Entrance', 'Huvudentré', 'Primary access point for general public entry to the establishment', 'Primär entré för allmänhetens tillträde till anläggningen', true, 1),
    (2, 'Side Entrance', 'Sidoentré', 'Secondary access point, typically located on the lateral side of the building', 'Sekundär entré, vanligtvis belägen på byggnadens sida', true, 2),
    (3, 'Back Entrance', 'Bakentré', 'Access point situated at the rear of the establishment, often used for deliveries or as an alternative entry', 'Entré belägen på baksidan av anläggningen, ofta använd för leveranser eller som alternativ ingång', true, 1),
    (4, 'Staff Entrance', 'Personalentré', 'Designated entry point for employees and authorized personnel', 'Särskild entré för anställda och behörig personal', true, 1),
    (5, 'Garage Entrance', 'Garageentré', 'Access point leading from a parking structure or enclosed vehicle storage area', 'Entré som leder från en parkeringsanläggning eller inbyggt fordonsutrymme', true, 1),
    (6, 'Emergency Exit', 'Nödutgång', 'Designated exit point for use during emergencies or evacuations', 'Särskild utgång för användning vid nödsituationer eller evakueringar', true, NULL);


SELECT public.insert_place_staging_osm(
	2352733325,
	'e7e479c8-db0c-47d4-82c6-11b35d8795ca',
	TRUE
);

REFRESH MATERIALIZED VIEW CONCURRENTLY public.places_view;


-- Add this after the existing INSERT statements and before the REFRESH MATERIALIZED VIEW command

-- First, let's get the place_id of the place we just inserted
DO $$
DECLARE
    v_place_id BIGINT;
BEGIN
    -- Get the place_id of the place we just inserted
    SELECT place_id INTO v_place_id
    FROM public.places
    WHERE external_id = '2352733325'
    LIMIT 1;

    -- If we found the place, insert an entrance for it
    IF v_place_id IS NOT NULL THEN
        -- Insert a new entrance into the staging table
        PERFORM public.insert_entrance_staging(
            jsonb_build_object(
                'place_id', v_place_id,
                'entrance_type_id', 1, -- Main Entrance
                'location', jsonb_build_object(
                    'coordinates', json_build_object(
                        'lat', 59.3366, -- Example latitude
                        'long', 18.0627  -- Example longitude
                    )
                ),
                'accessibility_info', jsonb_build_object(
                    'has_ramp', true,
                    'door_width', 90
                ),
                'submitted_by', 'e7e479c8-db0c-47d4-82c6-11b35d8795ca'::UUID,
                'source', 'user'
            )
        );

    ELSE
        RAISE NOTICE 'Place with external_id 2352733325 not found. Entrance not added.';
    END IF;
END $$;

-- Keep the REFRESH MATERIALIZED VIEW command at the end
REFRESH MATERIALIZED VIEW CONCURRENTLY public.places_view;