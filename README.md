# backend-post-n-bid
Backend express Server for post-n-bid. API implementation with express route
Authentication using jsonWebToken

# Install Dependencies
```
npm install
```

# Run Server
```
ts-node ./src/index.ts
```

## Following Environment Variables are used to connect to MySQL Database
```
  DB_HOST: Database URL
  DB_USER: username
  DB_PASS: password
  DB_NAME: Database Name
```
You can use a `.env` file in project root directory to set the variables

The local database that was used during development is in folder `database-test`

put this folder in your `mysql` folder
I.E. 
```
xampp/var/mysql/database-test
C:\xampp\mysql\data\database-test
```
