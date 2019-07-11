const db = require('../models/db');
const errors = require('./errors/errors');

module.exports = {
	get: function (imageId, imageContext) {
		if (imageId && imageContext && Number.parseInt(imageId) != imageId)
			imageContext += "_" + imageId;

		return db.Image.find({
			where: {
				$or: {
					id: imageId,
					context: imageContext
				}
			}
		});
	},
	add: function (image) {
		return db.Image.create(image);
	},
	addOrUpdate: function (imageId, imageContext, propsToUpdate) {
		return this.get(imageId, imageContext)
			.then(img => img
				? Object.assign(img).update(propsToUpdate)
				: (Number.parseInt(imageId) == imageId)
					? Promise.reject(new errors.NotFound("Category is not found"))
					: db.Image.create(propsToUpdate)
			)
	}
}