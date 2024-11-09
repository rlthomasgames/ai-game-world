#!/bin/bash
#! proper bash header

npm run linklib && cd ../kitsune-wrapper && npm run build-with-extensions && cd ../kitsune-application-test-dummy && npm run build && cd ../kitsune-wrapper/dist && http-server -g -c 86400 -p 8080 -t0 --cors=Access-Control-Allow-Origin,localhost:8000,localhost:3000,localhost:8080,localhost:8090,localhost:3090,Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,Accept
