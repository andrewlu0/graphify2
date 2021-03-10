const express = require('express');
const router = express.Router();
const queryString = require('query-string')
const request = require('request')

router.get("/login", (req, res) => {
  const state = Math.random().toString(36).slice(5, 11).toUpperCase()
  res.cookie(process.env.STATE_KEY, state);
  const scope = "user-read-email playlist-read-private playlist-read-collaborative user-read-recently-played user-top-read";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      queryString.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state,
      })
  );
});

router.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  
  if (code === null) return res.json({ error: true, message: "No login code." });
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64"),
    },
    json: true,
  };
  // console.log(authOptions.headers.Authorization)
  request.post(authOptions, (error, response, { access_token, refresh_token }) => {
    if (error) console.log(error);
    // console.log(response.statusCode)
    if (!error && response.statusCode === 200) {
      const domain = process.env.PROJECT_ROOT
      res.cookie(process.env.ACCESS_TOKEN, access_token);
      res.cookie(process.env.REFRESH_TOKEN, refresh_token);
      res.cookie(process.env.REFRESH_CODE, code);
      if (process.env.NODE_ENV === "production") {
        res.redirect(process.env.PROJECT_ROOT + "/graph")
      } else {
        res.redirect("http://localhost:3000/graph")
      }
    }
  });
})

router.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString("base64")) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

module.exports = router;