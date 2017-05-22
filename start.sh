#! /bin/bash

sudo wvdial
sudo /etc/init.d/cron start
sudo /usr/bin/node /home/project/inicio.js
