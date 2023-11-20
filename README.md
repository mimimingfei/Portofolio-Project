Environment Variables
1. Create a .env.test file in the root of the project, and write the following:
PGDATABASE= nc_news_test;
2. Create a .env.development file in the root of the project, and write the following:
PGDATABASE= nc_news;

Database Connection

The application uses the environment variables to establish connections to PostgreSQL databases. Make sure your local databases are running before starting the application.