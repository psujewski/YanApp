#!/bin/sh

LIB_PATH="./lib"

if [ ! -f $LIB_PATH ]
then
    mkdir $LIB_PATH
fi

wget "http://code.jquery.com/jquery-2.1.3.min.js" -O "${LIB_PATH}/jquery.min.js"
wget "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox.min.js" -O "${LIB_PATH}/dropbox.min.js"
wget "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox.min.map" -O "${LIB_PATH}/dropbox.min.map"
wget "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.3/dropbox.js" -O "${LIB_PATH}/dropbox.js"
wget "http://underscorejs.org/underscore-min.js" -O "${LIB_PATH}/underscore.min.js"
wget "http://underscorejs.org/underscore-min.map" -O "${LIB_PATH}/underscore-min.map"
