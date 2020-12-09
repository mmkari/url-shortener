const dbUser = "dbUser";
const dbPassword = "dbUserPw";
const dbName = "shortUrls";

const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.bhoih.mongodb.net/${dbName}?retryWrites=true&w=majority`;

module.exports = MONGODB_URI;
