module.exports = function(RED) {
  var FB = require('fb').default;
  function FaceBookPublishNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          var wallPost = {
            message: "Post com node-red"
          };
          var token = msg.access_token;
          FB.setAccessToken(token);
          FB.api('/1735471399882784/feed', 'post', wallPost, function (res) {
            node.send({payload: res})
          });
      })
  }
  RED.nodes.registerType("facebook-publish",FaceBookPublishNode);
}
