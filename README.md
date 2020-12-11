# url-shortener

A service for shortening URLs.

## Instructions for Use

To run the app:

1. git clone
2. npm install
3. `npm run start` to run the server

Send a POST request to `http://localhost/` with an urlencoded `url` parameter in the body of the request. E.g. `www.example.com/test` -> `url=www.example.com%2Ftest`. The server returns a minified URL as raw text. An example response: `http://localhost/c9bfa41b03d3a2ca`.

To retrieve the original URL, send a GET request to `http://localhost/:id`, where `:id` is the 16-character long sequence obtained in the previous step. In the above example it is the string `c9bfa41b03d3a2ca`.
