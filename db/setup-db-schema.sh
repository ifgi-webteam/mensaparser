#!/bin/bash
echo "******CREATING DOCKER DATABASE******"
gosu postgres psql --user $POSTGRES_USER << EOL
   CREATE TABLE menus (id SERIAL, data JSONB, PRIMARY KEY(data));

EOL
echo ""
echo "******DOCKER DATABASE CREATED******"