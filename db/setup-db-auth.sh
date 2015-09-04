#!/bin/bash
echo "******WRITING pg_hba******"
cat > /var/lib/postgresql/data/pg_hba.conf << EOL
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             docker          172.16.0.0/12           trust

EOL
echo ""
echo "******WRITTEN pg_hba******"