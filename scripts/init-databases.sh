#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE dating_db;
    CREATE DATABASE property_db;
    CREATE DATABASE auth_db;
    CREATE DATABASE message_db;
    CREATE DATABASE payment_db;
    CREATE DATABASE vehicle_db;
    
    GRANT ALL PRIVILEGES ON DATABASE dating_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE property_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE message_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE payment_db TO postgres;
    GRANT ALL PRIVILEGES ON DATABASE vehicle_db TO postgres;
EOSQL

echo "✅ All databases created successfully!"

