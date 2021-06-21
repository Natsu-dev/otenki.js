-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS kushiro_id_seq

-- Table Definition
CREATE TABLE "public"."kushiro" (
    "id" int4 NOT NULL DEFAULT nextval('kushiro_id_seq'::regclass),
    "report_datetime" timestamp,
    "date_define" timestamp,
    "weather_code" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "public"."kushiro" ("id", "report_datetime", "date_define", "weather_code", "created_at", "updated_at") VALUES
(1, '2021-06-18 17:00:00', '2021-06-19 00:00:00', '200', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.299758');
INSERT INTO "public"."kushiro" ("id", "report_datetime", "date_define", "weather_code", "created_at", "updated_at") VALUES
(2, '2021-06-18 17:00:00', '2021-06-20 00:00:00', '300', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.299758');
INSERT INTO "public"."kushiro" ("id", "report_datetime", "date_define", "weather_code", "created_at", "updated_at") VALUES
(3, '2021-06-18 17:00:00', '2021-06-21 00:00:00', '200', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.300757');
INSERT INTO "public"."kushiro" ("id", "report_datetime", "date_define", "weather_code", "created_at", "updated_at") VALUES
(4, '2021-06-18 17:00:00', '2021-06-22 00:00:00', '201', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.300757'),
(5, '2021-06-18 17:00:00', '2021-06-23 00:00:00', '200', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.300757'),
(6, '2021-06-18 17:00:00', '2021-06-24 00:00:00', '200', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.300757'),
(7, '2021-06-18 17:00:00', '2021-06-25 00:00:00', '201', '2021-06-19 15:43:49.737433', '2021-06-19 15:49:10.300757');