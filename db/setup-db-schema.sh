#!/bin/bash
echo "******CREATING DOCKER DATABASE******"
gosu postgres postgres --single $POSTGRES_USER << EOL
   CREATE TABLE menus (id SERIAL, data JSONB, PRIMARY KEY(data));

EOL
echo ""
echo "******DOCKER DATABASE CREATED******"