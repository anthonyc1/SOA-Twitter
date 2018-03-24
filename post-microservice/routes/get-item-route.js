var express = require('express'),
 bodyParser = require('body-parser'),
 mongoose = require('mongoose'),
 mongoose_item = require('../mongoose/services/addItemService.js');

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/item/:id', function(req, res){
	id = req.params.id;
	var item = mongoose_item.getItem(mongoose.Types.ObjectId(id));
	item.then(function(item){
		console.log(item);
		if (item){
			res.send({status: "OK", item: {
				id: id,
				username: item.username,
				property:{
					likes: item.likes
				},
				retweeted: item.retweeted,
				content: item.content,
				timestamp: item.timestamp
			}})
		}
		 else {
			res.send({status: "error", error: "no item found"});
		}
	}).catch(err => {
		console.log(err);
	})
});

module.exports = router;