CREATE TABLE "public"."kushiro" (
    "id" serial not null,
    "report_datetime" timestamp,
    "date_define" timestamp UNIQUE,
    "weather_code" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);