module.exports = function(RED) {
  var FB = require('fb').default;
  //   scope: 'email, user_about_me, user_birthday, user_location, publish_actions',
  // var client_id = '1091641737667695'
  // var client_secret = '2dd5b543ae238586154c8e538c2241c3'
  // var redirect_uri = 'https://localhost:1880/login'
  // var grant_type = 'client_credentials'
  function FaceBookGetTokenNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          FB.api('oauth/access_token', {
            client_id: msg.payload.client_id,
            client_secret: msg.payload.client_secret,
            redirect_uri: msg.payload.redirect_uri,
            grant_type: msg.payload.grant_type
          }, function (res) {
              node.send({payload: res})
          });
      })
  }
  RED.nodes.registerType("facebook-get-token",FaceBookGetTokenNode);
}
