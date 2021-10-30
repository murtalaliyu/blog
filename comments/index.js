const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

// return all comments in a post
app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

// create a comment
app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const {content} = req.body;

	const comments = commentsByPostId[req.params.id] || [];		// get current comments or empty array
	comments.push({ id: commentId, content, status: 'pending' });

	commentsByPostId[req.params.id] = comments;		// replace old comments array with new

	// emit event
	await axios.post('http://event-bus-clusterip-srv:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			content,
			postId: req.params.id,
			status: 'pending'
		}
	});

	res.status(201).send(comments);		// returns all comments for this post
});

// listen for events
app.post('/events', async (req, res) => {
	console.log('Received event:', req.body.type);		// log event receipt

	const { type, data } = req.body;

	if (type === 'CommentModerated') {
		const { postId, id, status, content } = data;
		const comments = commentsByPostId[postId];

		const comment = comments.find(comment => {
			return comment.id === id;
		});
		comment.status = status;

		// emit event
		await axios.post('http://event-bus-clusterip-srv:4005/events', {
			type: 'CommentUpdated',
			data: {
				id,
				status,
				postId,
				content
			}
		});
	}

	res.send({});		// acknowledge receipt
});



// ----------------------------------------------------------------------------
app.listen(4001, () => {
	console.log('Listening on 4001');
});
