// Create web server
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const { isLoggedIn } = require('../middleware');

// Create comment
router.post('/posts/:postId/comments', isLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = new Comment(req.body);
        comment.author = req.user._id;
        comment.post = post._id;
        await comment.save();

        post.comments.push(comment._id);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request', error: error.message });
    }
});

// Get comments
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate('comments');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.status(200).json(post.comments);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request', error: error.message });
    }
});

// Update comment
router.put('/posts/:postId/comments/:commentId', isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.commentId, author: req.user._id });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.text = req.body.text;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request', error: error.message });
    }
});

// Delete comment
router.delete('/posts/:postId/comments/:commentId', isLoggedIn, async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.params.commentId, author: req.user._id });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        await comment.remove();

        res.status(200).

