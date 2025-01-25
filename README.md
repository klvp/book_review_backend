# Book Review Backend

## Versions used in this frontend

- Node.js: v20.17.0
- MongoDB: 7.0.12
- MongoDB Compass

## Steps to Run the Server

1. **Run the MongoDB Server and Open MongoDB Compass**

   - Start your MongoDB server by running cmd `brew services start mongodb-community@7.0` in MAC (check how to start for windows).
   - Open MongoDB Compass and connect to the local MongoDB server at `mongodb://localhost:27017/books_review`.
   - Note: `books_review` is the name of the database.
   - Once you start the server, 3 collection `books,reviews and users` will get created in `books_review` DB (refresh the mongoDB)
   - Insert the books data which is in feedData.json file into the `books` collection

2. **Clone the Repository**

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

3. **Install All Required Packages**

   ```sh
   npm install
   ```

4. **Create a `.env` File in the Root Folder (in same level of server.js)**

   Add the following details to the `.env` file:

   ```env
   PORT=3000
   MONGO_URL=mongodb://localhost:27017/books_review
   JWT_SECRET_TOKEN=random1234
   ```

5. **Run the Server**
   ```sh
   npm run dev
   ```

Your Express server should now be running and accessible.
