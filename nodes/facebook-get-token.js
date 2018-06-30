module.exports = function(RED) {
  var FB = require('fb').default;
  //   scope: 'email, user_about_me, user_birthday, user_location, publish_actions',
  var client_id = '1091641737667695'
  var client_secret = '2dd5b543ae238586154c8e538c2241c3'
  function FaceBookGetTokenNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          var wallPost = {
            message: msg.payload
          };
          FB.api('oauth/access_token', {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'publish_actions'
          }, function (res) {
              node.send({payload: res})
          });
      })
  }
  RED.nodes.registerType("facebook-get-token",FaceBookGetTokenNode);
}
