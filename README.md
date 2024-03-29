## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.




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
# build mode
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
## APIs
User Management
```bash
Register: POST /api/user/register
Login: POST /api/user/login
Email Verification: GET /api/user/verify-email/:verificationToken
My Info: GET /api/user/me
Send OTP: POST /api/user/send-otp
Forgot Password: POST /api/user/forgot-password
Reset Password: POST /api/user/reset-password
Delete User: DELETE /api/user/delete
Change Password: POST /api/user/change-password
Update User: PUT /api/user/update
Change Email: POST /api/user/change-email
```





## Author

- Author - [Zeshan Shakil](https://zeshantech.netlify.app)

## License

Nest is [MIT licensed](LICENSE).
