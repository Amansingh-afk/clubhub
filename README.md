# CMS Backend

This repository contains the backend code for the CMS (Club Management System) project. It provides the API endpoints and handles the business logic and data management for the CMS.

## Technologies Used

- Node.js: JavaScript runtime environment
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for data storage
- Mongoose: Object Data Modeling (ODM) library for MongoDB
- JWT: JSON Web Tokens for authentication
- Bcrypt: Library for hashing passwords
- Nodemailer: for sending emails.

## Getting Started

To get started with the backend, follow these steps:

1. Clone the repository:

   ```git clone https://github.com/Amansingh-afk/clubhub.git ```
   
2. Install the dependencies:
```
cd clubhub
npm install
```

3. Seed the databse
    `node server/config/seed.js`
   
4. Set up the environment variables:

  Rename the .env.example file to .env.
  Modify the .env file to include your configuration settings (such as MongoDB connection string, JWT secret, etc.).
  Start the server:

`npm start`
  The server will start running on `http://localhost:8000`. You can test the API endpoints using a tool like Postman.

### Folder Structure
The folder structure of the backend repository is as follows:

controllers/: Contains the controller functions that handle the logic for each API endpoint.

models/: Defines the Mongoose models for data schema and interactions with the MongoDB database.

middlewares/: Contains custom middleware functions used in the application.

routes/: Defines the API routes and their corresponding controller functions.

config/: Contains configuration files, such as database connection setup, database seed, etc.

utils/: Includes utility functions or helper modules, authentication modules, email sending modules.

tests/: Contains test files and configurations for unit testing.

app.js: Entry point of the application, where the Express app is configured.

server.js: Starts the server and listens for incoming requests.

### API Endpoints
The backend provides the following API endpoints:

GET /api/v1/super-admin/users: Get all users

POST /api/v1/register: Create a new user

PUT /api/v1/me/update: Update a user prodile

and much more....

#### Contributing
Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

### License
This project is licensed under the MIT License.
