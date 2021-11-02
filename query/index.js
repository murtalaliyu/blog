const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
/*
	QUICK EXAMPLE
	posts === {
		'ew8if3n': {
			id: 'ew8if3n',
			title: 'post title',
			comments: [
				{ id: '5bgi9g0', content: 'comment!' }
			]
		},
		'ew8if3n': {
			id: 'ew8if3n',
			title: 'post title',
			comments: [
				{ id: '5bgi9g0', content: 'comment!' }
			]
		}
	}
*/

const handleEvent = (type, data) => {
	if (type === 'PostCreated') {
		const { title, id } = data;
		posts[id] = { id, title, comments:[] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		post.comments.push({ id, content, status });
	}

	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;

		const post = posts[postId];
		const comment = post.comments.find(comment => {
			return comment.id === id;
		});
		comment.status = status;
		comment.content = content;
	}
};

// get query's posts data structure which returns all posts with associated comments
app.get('/posts', (req, res) => {
	res.send(posts);
});

// listen for events
app.post('/events', (req, res) => {
	console.log('Received event:', req.body.type);		// log event receipt

	const { type, data } = req.body;

	handleEvent(type, data);

	//console.log(posts);
	res.send({});
});










// ----------------------------------------------------------------------------
app.listen(4002, async () => {
	console.log('Listening on 4002');

	// get unsynced events
	const res = await axios.get('http://event-bus-clusterip-srv:4005/events');
	for (let event of res.data) {
		console.log('Processing event:', event.type);
		handleEvent(event.type, event.data);
	}
});
