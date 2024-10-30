#!/bin/bash

# Expect environment-specific variables to be passed in or set externally
# export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
# export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export AWS_REGION=us-east-1
export AWS_ROLE_ARN=arn:aws:iam::831057713351:role/bitbucket-pipeline-deploy-role
echo $STAGE

apt-get update && apt-get install -y awscli

node -v

npm i
npm run build
## s3
aws s3 sync build/ s3://hai-bookstore-s3 --delete
## cloudfront remove cache
aws cloudfront create-invalidation --distribution-id E1BW4FUSTTWOEL --paths "/*"