#!/bin/bash
echo Waiting 12 seconds...

# create cron job to run every sunday
# "@weekly" according to https://godoc.org/github.com/robfig/cron
go-cron '@weekly' /bin/sh -c 'node server.js' &

# run once on startup
# use "sleep infinity" to keep Docker container alive
sleep 12 && node server.js && sleep infinity