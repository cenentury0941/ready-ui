#!/bin/bash

# Expect environment-specific variables to be passed in or set externally
export AWS_REGION=us-east-1
export AWS_ROLE_ARN=arn:aws:iam::831057713351:role/bitbucket-pipeline-deploy-role
echo $BITBUCKET_STEP_OIDC_TOKEN > $(pwd)/web-identity-token
echo $ACCOUNT_ID
echo $STAGE
echo $AWS_ROLE_ARN

apt-get update && apt-get install -y awscli

aws sts assume-role-with-web-identity \
    --role-arn $AWS_ROLE_ARN \
    --role-session-name bitbucket-pipeline \
    --web-identity-token file://$(pwd)/web-identity-token \
    --duration-seconds 1000 > credentials

node -v

npm i
npm run build
## s3
aws s3 sync build/ s3://hai-bookstore-s3 --delete
## cloudfront remove cache
aws cloudfront create-invalidation --distribution-id E1BW4FUSTTWOEL --paths "/*"