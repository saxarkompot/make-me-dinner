const db = require('../models/db');

module.exports = {
	get: function (imageId, imageContext) {
		if(imageId && imageContext && Number.parseInt(imageId) != imageId)
			imageContext += "_" + imageId;

		return db.Image.find({
			where:{
				$or: {
					id: imageId,
					context: imageContext
				}
			}
		});
	},
	add: function (image) {
		return db.Image.create(image);
	}
}