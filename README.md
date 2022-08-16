# Quick Click

Quick Click is a framework for measuring reaction times for a group of users.

The framework can be executed in different flavors like in this case, through a game Be Quick.

Based on the reaction times, winer/s can selected and provided with rewards.

## How it works

Quick click uses websockets under the hood to communicate client applications with the server.

The reaction time is measured independently to the connection lag or device performance.

## Deployment

The infrastructure uses the following AWS services:
- S3
- EC2
- Cloudfront
- Route 53

### JS client bundle

AWS S3 bucket
Cloudfront distribution
Route 53

### NodeJS server

AWS EC2 instance using Elastic Beanstalk
Cloudfront distribution
Route 53

## TODO

- If a URL has id, chek with the server that the game is not finished or ongoing
- If the game is finished or ongoing redirect to some error page or to starting page