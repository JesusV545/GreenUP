const fs = require('fs');
const path = require('path');
const Comments = require('express').Router();
const { readFromFile, readAndAppend } = require('../../utils/fsUtils.js');
const uuid = require('../../utils/uuid');

const COMMENTS_SOURCE = path.join(__dirname, '../../db/comments.json');

Comments.get('/', async (req, res) => {
  try {
    const data = await readFromFile(COMMENTS_SOURCE);
    return res.json(JSON.parse(data));
  } catch (error) {
    return res.status(501).json({ message: 'Comments storage is not configured yet.' });
  }
});

Comments.post('/', (req, res) => {
  const { username, topic, tip } = req.body;

  if (!username || !tip) {
    return res.status(400).json({ message: 'Username and tip are required.' });
  }

  if (!fs.existsSync(COMMENTS_SOURCE)) {
    return res.status(501).json({ message: 'Comments storage is not configured yet.' });
  }

  const newComment = {
    username,
    tip,
    topic,
    comment_id: uuid(),
    created_at: new Date().toISOString(),
  };

  readAndAppend(newComment, COMMENTS_SOURCE);
  return res.status(201).json({ message: 'Comment added successfully.' });
});

module.exports = Comments;
