#!/bin/bash
set -e

POSTGRES_API_USER=${POSTGRES_API_USER:="root"}
POSTGRES_API_USER_PASSWORD=${POSTGRES_API_USER_PASSWORD:="test"}
POSTGRES_READONLY_USER_NAME=${POSTGRES_READONLY_USER_NAME:="readonly"}
POSTGRES_READONLY_USER_PASSWORD=${POSTGRES_READONLY_USER_PASSWORD:="readonlyPassword"}

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE USER $POSTGRES_API_USER with encrypted password '$POSTGRES_API_USER_PASSWORD';
  CREATE DATABASE emjpm_prod;
  CREATE DATABASE emjpm_dev;
  CREATE DATABASE emjpm_test;
  GRANT ALL PRIVILEGES ON DATABASE emjpm_prod TO $POSTGRES_API_USER;
  GRANT ALL PRIVILEGES ON DATABASE emjpm_dev TO $POSTGRES_API_USER;
  GRANT ALL PRIVILEGES ON DATABASE emjpm_test TO $POSTGRES_API_USER;

  -- metabase readonly user
  CREATE USER $POSTGRES_READONLY_USER_NAME with encrypted password '$POSTGRES_READONLY_USER_PASSWORD';
  GRANT CONNECT ON DATABASE emjpm_prod TO $POSTGRES_READONLY_USER_NAME;
  GRANT USAGE ON SCHEMA public TO $POSTGRES_READONLY_USER_NAME;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO $POSTGRES_READONLY_USER_NAME;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO $POSTGRES_READONLY_USER_NAME;
EOSQL