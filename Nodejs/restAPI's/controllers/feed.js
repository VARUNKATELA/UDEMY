const { validationResult } = require('express-validator');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      title: 'First Post',
      content: 'This is the first Post'
    }]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect', errors: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post Created !!',
    post: { id: new Date().toISOString(), title: title, content: content }
  });
}