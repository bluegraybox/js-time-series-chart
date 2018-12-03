#!/bin/bash

# Web service that generates a random number and returns it as JSONP.

echo 'Content-type: application/javascript'
echo
echo "addData($RANDOM);"
