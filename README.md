
# Quillpad (blog api)




## Description

[Quillpad](https://github.com/zeshan-tech/quillpad) is BE blog app which includes User Management | Post CRUD | comments for posts


## Requirements
Before running this project, ensure you have the following requirements:
- <a href="http://nodejs.org" target="_blank">Node.js</a> 18.x.x or later
- <a href="https://nestjs.com/" target="_blank">Nest.js</a> 9.x.x
- <a href="https://www.mongodb.com/" target="_blank">Mongo DB</a>
- <a href="https://yarnpkg.com/" target="_blank">Yarn (pkg manager)</a>



## Installation
You can install dependencies using Yarn, which is preferred for better performance and reliability:
```bash
yarn install
```


## Running the app
```bash
# development
$ yarn run start
# watch mode
$ yarn run start:dev
# build
$ yarn run start:build
# production mode
$ yarn run start:prod
```



## Environment Variables
Ensure you have a `.env` file in the root directory of the project with the following variables:
```dotenv
PORT=8080
SALT_ROUND=''
REDIS_URI=''
DB_URI=''
DB_NAME=''
TEST_DB=''
JWT_SECRET=''
SEND_GRID_API_KEY=''
SEND_GRID_FROM_EMAIL=''
```



## Docker Compose (Optional)
You can also run the project using Docker Compose. Ensure you have Docker installed on your system.
To start the project with Docker Compose, run the following command:
```bash
docker-compose up
```
For more information on installing Docker Compose, refer to the [official installation guide](https://docs.docker.com/compose/install/).




## Running Test Cases
You can run test cases using the following command:
```bash
# unit tests
$ yarn run test
# test coverage
$ yarn run test:cov
```



## APIs
User Management
```bash
# Register
 $ *POST* /user/register
# Login
 $ *POST* /user/login
# Email Verification
 $ *POST* /user/verify-email
# My Info
 $ *GET* /user/me
# Send OTP
 $ *POST* /user/send-otp
# Forgot Password
 $ *POST* /user/forgot-password
# Reset Password
 $ *PUT* /user/reset-password
# Delete User
 $ *DELETE* /user
# Change Password
 $ *PUT* /user/change-password
# Update User
 $ *PUT* /user/update
# Change Email
 $ *PUT* /user/change-email
```


Post Management
```bash
# Create post
 $ *POST* /post
# Delete post
 $ *DELETE* /post/:postId
# post get by id
 $ *GET* /post/:postId
# post get by id
 $ *GET* /post/by-user-id/:userId
# Update post
 $ *PUT* /post/:post
# Get all posts
 $ *GET* /post
```


Comment Management
```bash
# Get comments by post id
 $ *GET* /comment/:postId
# Create comment
 $ *POST* /comment
# Get specific comment replies
 $ *GET* /comment/replies/:commentId
# Update comment
 $ *PUT* /comment/:commentId
# Get all comments
 $ *GET* /comment
```



## Author

- Author - [Zeshan Shakil](https://zeshantech.netlify.app)

## License

Quillpad is [MIT licensed](LICENSE).
