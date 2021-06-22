CREATE TABLE "public"."kushiro" (
    "id" serial,
    "publishing_office" text,
    "report_datetime" timestamp,
    "date_define" timestamp UNIQUE,
    "weather_code" text,
    "pops" text,
    "reliabilities" text,
    "tempsMin" text,
    "tempsMax" text,
    "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
