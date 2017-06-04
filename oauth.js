'use strict'

const axios = require('axios')

/*

  Figured out how to do this by reading
  https://github.com/5ika/smilodon/blob/master/src/index.js
  
  The main trick is that mastodon allows grant_type='password' so we
  don't need to actually fire up a browser, as most of the bots auth
  examples seem to do.

  Thanks so much, 5ika!

*/

function register(server, appname, appurl = 'http://example.org') {
  const params = {
    client_name: appname,
    redirect_uris: appurl,
    scopes: 'read write follow'
  };
  return axios.post(`${server}/api/v1/apps`, params)
    .then((response) => {
      const result = { }
      result.id = response.data.client_id;
      result.secret = response.data.client_secret;
      result.server = server;
      return result
    })
    .catch((error) => console.error(error));
}

function authorize(registration, email, password) {
  if(!registration.secret || !registration.id)
    throw 'You need to register the app first'
  const params = {
    client_id: registration.id,
    client_secret: registration.secret,
    grant_type: 'password',
    scope: 'read write follow',
    username: email,
    password: password,
  };
  return axios.post(`${registration.server}/oauth/token`, params)
    .then((response) => {
      console.log('response ', response)
      const result = {}
      result.username = email;
      result.password = password;
      result.token = response.data.access_token;
      return result;
    })
    .catch((error) => console.error(error));
}

module.exports.register = register
module.exports.authorize = authorize

/*

Use like: 

const user = {
  username: 'botaccount@example.org',
  password: 'botpassword'
};

oauth.register('https://w3c.social', 'testing 3')
  .then(reg => {
    console.log('reg:', reg)
    oauth.authorize(reg, user.username, user.password)
      .then(access => {
        console.log('access:', access)
        // access.token is what you want
      })
  })

*/
