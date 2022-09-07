#!/bin/bash
####################################################################
# Deployment script for updating signalforthings artifact in container
####################################################################

prior=$(date +"%s")

sftcontainer=$(docker ps -a | grep signalforthings | awk '{print $1}')

yarn build

if [[ $? -ne 0 ]] ; then
  exit 127
fi

lastTouched=$(stat -f %m build/signalforthings.js)

if [[ $lastTouched > $prior ]] ; then
  echo "deploying.."
  docker stop "$sftcontainer"
  docker cp build/signalforthings.js "$sftcontainer":/signalforthings/
  docker start "$sftcontainer"
  sleep 1
  exit 0
fi

