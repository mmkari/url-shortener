const request = require("supertest");
const expect = require("chai").expect;
const createApp = require("./app");
const models = require("./models");

let Shortened = require("./models/shortened.model");

const PORT = 8080;
const SHORTENED_REGEXP = /^http:\/\/localhost\/.{16}$/;

const getUrlParamEncoded = (url) => `url=${encodeURIComponent(url)}`;

describe("Loading express", function () {
  let server;
  before(async () => {
    try {
      // before all tests
      const app = createApp(); // create the app
      await models.createConnection(); // connect to test DB
      server = await app.listen(PORT); // start test server
    } catch (error) {
      console.log("ERROR BEFORE ALL:", error);
    }
  });
  afterEach(async () => {
    try {
      await models.dropDatabase(); // clear DB content after each test case
    } catch (error) {
      console.log("ERROR AFTER EACH:", error);
    }
  });
  after(async () => {
    try {
      if (server) {
        await server.close(); // close test server
      }
      await models.closeConnection(); // close connection to test DB
    } catch (error) {
      console.log("ERROR AFTER ALL:", error);
    }
  });

  describe("GET endpoint", function () {
    it("responds 404 to GET at /", function testRoot(done) {
      request(server).get("/").expect(404, done);
    });
    it("responds 404 on GET at /:id on a nonexistant id", function testPath(done) {
      request(server).get("/test").expect(404, done);
    });
    it("responds 200 to GET at /:id when id exists", async function testExisting() {
      const input = {
        hash: "TESTHASH1234abcd",
        original: "www.test.com",
      };
      // create the above object in DB
      let shortened = new Shortened(input);
      const createdObject = await shortened.save().catch(() => {
        return null;
      });
      expect(createdObject).to.deep.include(input); // should return passed values
      // test that the created shortened URL exists and is returned with status 200
      await request(server).get(`/${input.hash}`).expect(200, input.original);
    });

    const EXPIRATION_TIMEOUT = 300000;
    const CHECK_EXPIRED_TIMEOUT = 5000;
    describe(`Expiration (timeout ${
      EXPIRATION_TIMEOUT / 1000
    }s -- MongoDB may take 60+ seconds to delete)`, function () {
      it("responds 404 to GET at /:id when id has expired", async function testTtlExisting() {
        const dateWeekAgo = new Date();
        dateWeekAgo.setDate(dateWeekAgo.getDate() - 7);
        const input = {
          hash: "expired012341234",
          original: "www.expired.com",
          createdAt: dateWeekAgo.toISOString(),
        };

        // create the above object in DB
        let shortened = new Shortened(input);
        const createdObject = await shortened.save().catch(() => {
          return null;
        });

        // it may take mongo upto 60+ seconds to delete the expired document
        let totalWait = 0;
        while (totalWait < EXPIRATION_TIMEOUT - 2000) {
          await new Promise((r) => setTimeout(r, CHECK_EXPIRED_TIMEOUT));
          request(server)
            .get(`/${input.hash}`)
            .then((response) => {
              if (response.status !== 200) {
                totalWait = EXPIRATION_TIMEOUT;
              }
            });
          totalWait += CHECK_EXPIRED_TIMEOUT;
        }

        // the shortened url should have expired
        await request(server).get(`/${input.hash}`).expect(404);
      }).timeout(EXPIRATION_TIMEOUT);
    });
  });

  describe("POST endpoint", function () {
    it("responds 200 on a valid post request", function testGoodPost(done) {
      const URL = "www.example.com/items/fine";
      request(server)
        .post("/")
        .send(getUrlParamEncoded(URL))
        .expect(200, SHORTENED_REGEXP, done);
    });
    it("responds 400 on a malformed post request: wrong param name", function testBadPost(done) {
      const URL = "www.example.com/items/wrongname";
      const param = `site=${encodeURIComponent(URL)}`; // wrong param name
      request(server).post("/").send(param).expect(400, {}, done); // expect empty response
    });
  });

  describe("BOTH endpoints", function () {
    it("shortens an url and returns the original", async function testExisting() {
      const url = "http://www.test.com/123";

      // post the original url and receive a shortened url
      let response;
      await request(server)
        .post("/")
        .send(getUrlParamEncoded(url))
        .expect(200, SHORTENED_REGEXP)
        .then((res) => {
          response = res.text;
        });

      // request and get the original url
      const urlId = response.split("/").pop();
      await request(server).get(`/${urlId}`).expect(200, url);
    });
  });
});
