var express = require('express'),
    bodyParser = require('body-parser'),
    Memcached = require('memcached'),
    mongoose = require('mongoose'),
    mongoose_item = require('../mongoose/services/itemService.js'),
    mongoose_user = require('../mongoose/services/userService.js');;
var jwt = require('jsonwebtoken');

var memcached = new Memcached('127.0.0.1:11211');
var lifetime = 86400;

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.post('/search', async function(req, res) {
    var configVars = req.app.get('configVars');
    var usersfollowed = [];
    var flag = true;
    var following = (!req.body.following) ? req.body.following : true;
    if (following != false) {
        try {
            var decoded = await jwt.verify((req.cookies.token), configVars.secret);
            if (decoded) {
                var user = await mongoose_user.getFollowing(decoded.username, 100);
                usersfollowed = user.following;
            } else {
                flag = false;
            }
        } catch (error) {
            console.log(error)
            flag = false;
        }
    }
    if (flag) {
        var timestamp = (req.body.timestamp) ? req.body.timestamp : new Date().getTime();
        var limit = (req.body.limit) ? req.body.limit : 25;
        usersfollowed = (req.body.username) ? usersfollowed.concat([req.body.username]): (usersfollowed.length == 0) ? undefined : usersfollowed;
        var rank = (req.body.rank) ? req.body.rank : "interest";
        var parent = req.body.parent;
        var replies = (req.body.replies != undefined) ? req.body.replies : true;
        var hasMedia = (req.body.hasMedia != undefined) ? req.body.hasMedia : false ;
        var items = mongoose_item.searchItems({
            timestamp: timestamp,
            limit: limit,
            q: req.body.q,
            following: following,
            usersfollowed: usersfollowed,
            rank: rank,
            parent: parent,
            replies: replies,
            hasMedia: hasMedia
        });
        items.then(function(items) {
            res.send({
                status: "OK",
                items: items
            });
        }).catch(err => {
            console.log(err);
            res.send({
                status: "error",
                error: err
            })
        })
    } else {
        res.send({
            status: "error"
        });
    }
});

module.exports = router;
