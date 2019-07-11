var express = require('express');
var router = express.Router({ mergeParams: true });
const imageProvider = require('../services/image.provider');
var multer = require('multer');
var upload = multer({ limits: { fileSize: 5000000 } });

router.get('/:imageId', function (req, res, next) {
 // if (req.session["image" + req.params.imageContext])
 //  res.type("jpeg") && res.end(new Buffer(req.session["image" + req.params.imageContext].buffer));
  //else
    imageProvider.get(req.params.imageId, req.params.imageContext)
      .then(result => res.type("jpeg") && res.send(result.content))
      .catch(next);
});

router.post('/', upload.single('image'), postImage);
router.post('/:imageId', upload.single('image'), postImage);

function postImage(req, res, next) {
  imageContext = req.params.imageContext + '_' + (req.params.imageId || 'default');
  imageProvider.add({context: imageContext, content: new Buffer(req.file.buffer)})
    .then(result => res.json({ name: 'image' + req.params.imageContext }))
    .catch(next);
  //res.type("jpeg") && res.send(new Buffer(req.file.buffer));
}

module.exports = router;
