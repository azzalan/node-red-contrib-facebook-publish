module.exports = function(RED) {
  var graph = require('fbgraph')
  var conf = {
    client_id: '1091641737667695',
    client_secret: '2dd5b543ae238586154c8e538c2241c3',
    scope: 'email, user_about_me, user_birthday, user_location, publish_actions',
    redirect_uri:'http://localhost:1880/auth'
  }
  graph.authorize({
    "client_id": conf.client_id,
    "redirect_uri": conf.redirect_uri,
    "client_secret": conf.client_secret,
    }, function (err, facebookRes) {
      var facebookRes = facebookRes
  })
  function FaceBookPublishNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = facebookRes;
          node.send(msg);
      })
  }
  RED.nodes.registerType("facebook-publish",FaceBookPublishNode);
}
