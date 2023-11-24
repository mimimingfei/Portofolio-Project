# Northcoders News API Overview
We will use Express and Node.js to build an API  which mimics a real word backend service (such as Reddit) to access data from PSQL database. We will interact with PSQL using node-postgres and use Jest and Supertest for testing. You need minimum versions Node.js v20.8.0 and PostgreSQL 14.9 for the project.
#### Hosted version link: https://news-ynk8.onrender.com

# Environment Variables
#### The application uses the environment variables to establish connections to PostgreSQL databases. Make sure your local databases are running before starting the application.

1. Create a .env.test file in the root of the project, and write the following:  
PGDATABASE= nc_news_test


2. Create a .env.development file in the root of the project, and write the following:  
PGDATABASE= nc_news

# Install Packages
#### Clone this project to your local, then run following commands in your terminal  
1. Run `git clone https://github.com/mimimingfei/Portofolio-Project.git`


2. Install jest and supertest- `npm install jest supertest`
3. Install `pg` package to connect to database servers and execute SQL queries - `npm install pg`
4. Install express - `npm install express`
5. To setup database - `psql -f ./db/setup.sql`
6. To seed database - `node ./db/seeds/run-seed.js`

#### To check if database exists, in terminal, run `psql` then type `\c DATABASENAME`

It should show 'You are now connected to database "DATABASENAME" as user "USERNAME"' when connection is sucessfully. You can type `\q`to exit.

# Run tests
#### run `npm test app.test.js` in terminal


