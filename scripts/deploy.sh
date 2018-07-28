#!/bin/bash

# Exit on any error
set -e

gcloud docker -- push gcr.io/${PROJECT_NAME}/aksite
#chown -R ubuntu:ubuntu /home/ubuntu/.kube
kubectl patch deployment app -p '{"spec":{"template":{"spec":{"containers":[{"name":"app","image":"gcr.io/sonic-glazing-711/aksite:'"$CIRCLE_SHA1"'"}]}}}}'
