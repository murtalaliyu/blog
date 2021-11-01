const express = require('express');
const bodyParser = require('body-parser');		// parse POST request body
const { randomBytes } = require('crypto');		// generate random IDs
const cors = require('cors');					// to allow for internal HTTP requests between different IP/ports
const axios = require('axios');					// to allow for external HTTP requests

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

// get all posts (deprecated. query service is handling this request. this returns posts with no comments)
app.get('/posts', (req, res) => {
	res.send(posts);
});

// create a post
app.post('/posts/create', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;
	posts[id] = {
		id, title
	};

	// emit event to event-bus pod through its cluster ip service
	await axios.post('http://event-bus-clusterip-srv:4005/events', {
		type: 'PostCreated',
		data: {
			id, title
		}
	});

	res.status(201).send(posts[id]);
});

// listen for events
app.post('/events', (req, res) => {
	console.log('Received event:', req.body.type);		// log event receipt
	res.send({});		// acknowledge receipt
});





// ----------------------------------------------------------------------------
app.listen(4000, () => {
	console.log('v71');
	console.log('Listening on 4000');
});
