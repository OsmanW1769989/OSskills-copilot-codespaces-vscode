// Create web server for comments
// 1. Create web server
// 2. Create route for comments
// 3. Create route for post comments
// 4. Create route for delete comments
// 5. Create route for update comments

// Import modules
const express = require('express');
const router = express.Router();
const Comments = require('../models/comments');
const mongoose = require('mongoose');
const auth = require('../auth');

// Create route for comments
router.get('/', auth.verifyUser, (req, res, next) => {
    Comments.find({user: req.user._id})
        .populate('user')
        .then((comments) => {
            res.json(comments);
        }).catch(next);
});

// Create route for post comments
router.post('/', auth.verifyUser, (req, res, next) => {
    let comments = new Comments(req.body);
    comments.user = req.user._id;
    comments.save()
        .then((comments) => {
            res.statusCode = 201;
            res.json(comments);
        }).catch(next);
});

// Create route for delete comments
router.delete('/:id', auth.verifyUser, (req, res, next) => {
    Comments.findOneAndDelete({_id: req.params.id, user: req.user._id})
        .then((comments) => {
            if(comments == null) throw new Error("Comments not found!");
            res.json(comments);
        }).catch(next);
});

// Create route for update comments
router.put('/:id', auth.verifyUser, (req, res, next) => {
    Comments.findOneAndUpdate({_id: req.params.id, user: req.user._id}, {$set: req.body}, {new: true})
        .then((comments) => {
            if(comments == null) throw new Error("Comments not found!");
            res.json(comments);
        }).catch(next);
});

module.exports = router;