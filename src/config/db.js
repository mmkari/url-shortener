const dbUser = "dbUser";
const dbPassword = "dbUserPw";
const dbName = "shortUrls";
const dbNameTests = "shortUrlsTests";

let resolvedDbName;
switch (process.env.NODE_ENV) {
  case "test":
    resolvedDbName = dbNameTests;
    break;
  default:
    resolvedDbName = dbName;
    break;
}

const MONGODB_URI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.bhoih.mongodb.net/${resolvedDbName}?retryWrites=true&w=majority`;

module.exports = MONGODB_URI;
