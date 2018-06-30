module.exports = function(RED) {
    function TwitterCustomOutNode(n) {
        var Ntwitter = require('twitter-ng');
        var OAuth= require('oauth').OAuth;
        var request = require('request');
        RED.nodes.createNode(this,n);
        var node = this;
        var dm_user;        
        node.on('input', function(msg) {
            var credentials = msg.payload.credentials
            this.topic = msg.topic
            this.twitter = msg.twitter
            var twits = msg.payload.msgs
            if (credentials && credentials.consumer_key && credentials.consumer_secret && credentials.access_token && credentials.access_token_secret) {
                var twit = new Ntwitter({
                    consumer_key: credentials.consumer_key,
                    consumer_secret: credentials.consumer_secret,
                    access_token_key: credentials.access_token,
                    access_token_secret: credentials.access_token_secret
                });
                var oa = new OAuth(
                    "https://api.twitter.com/oauth/request_token",
                    "https://api.twitter.com/oauth/access_token",
                    credentials.consumer_key,
                    credentials.consumer_secret,
                    "1.0",
                    null,
                    "HMAC-SHA1"
                );
                if (msg.hasOwnProperty("payload")) {
                    node.status({fill:"blue",shape:"dot",text:"twitter.status.tweeting"});
                    if (twits.slice(0,2) == "D ") {
                            // direct message syntax: "D user message"
                            var t = twits.match(/D\s+(\S+)\s+(.*)/).slice(1);
                            dm_user = t[0];
                            twits = t[1];
                    }
                    if (twits.length > 280) {
                        twits = twits.slice(0,279);
                        node.warn(RED._("twitter.errors.truncated"));
                    }
                    if (msg.media && Buffer.isBuffer(msg.media)) {
                        var apiUrl = "https://api.twitter.com/1.1/statuses/update_with_media.json";
                        var signedUrl = oa.signUrl(apiUrl,
                            credentials.access_token,
                            credentials.access_token_secret,
                            "POST");

                        var r = request.post(signedUrl,function(err,httpResponse,body) {
                            if (err) {
                                node.error(err,msg);
                                node.status({fill:"red",shape:"ring",text:"twitter.status.failed"});
                            }
                            else {
                                var response = JSON.parse(body);
                                if (response.errors) {
                                    var errorList = response.errors.map(function(er) { return er.code+": "+er.message }).join(", ");
                                    node.error(RED._("twitter.errors.sendfail",{error:errorList}),msg);
                                    node.status({fill:"red",shape:"ring",text:"twitter.status.failed"});
                                }
                                else {
                                    node.status({});
                                }
                            }
                        });
                        var form = r.form();
                        form.append("status",twits);
                        form.append("media[]",msg.media,{filename:"image"});
                    }
                    else {
                        if (typeof msg.params === 'undefined') { msg.params = {}; }
                        if (dm_user) {
                            twit.newDirectMessage(dm_user,twits, msg.params, function (err, data) {
                                if (err) {
                                    node.status({fill:"red",shape:"ring",text:"twitter.status.failed"});
                                    node.error(err,msg);
                                }
                                node.status({});
                                node.send({payload: data})
                            });
                        } else {
                            twit.updateStatus(twits, msg.params, function (err, data) {
                                if (err) {
                                    node.status({fill:"red",shape:"ring",text:"twitter.status.failed"});
                                    node.error(err,msg);
                                }    
                                node.send({payload: {msg: "Sucesso"}})
                                node.status({});
                            });
                        }
                    }
                }
                else { node.warn(RED._("twitter.errors.nopayload")); }
            } else {
                this.error(RED._("twitter.errors.missingcredentials"));
            }
        })
    }
    RED.nodes.registerType("custom-twitter-node",TwitterCustomOutNode);
    
    RED.nodes.registerType("twitter-api-connection",function() {});
};
