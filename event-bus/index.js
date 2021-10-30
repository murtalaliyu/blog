const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
	console.log('Received event:', req.body.type);
	const event = req.body;

	events.push(event);	// persist event

	// emit to all listeners
	axios.post('http://posts-clusterip-srv:4000/events', event);  // emit event to posts pod through its cluster ip service
	/*axios.post('http://localhost:4001/events', event);
	axios.post('http://localhost:4002/events', event);
	axios.post('http://localhost:4003/events', event);*/

	res.send({ status: 'OK' });
});


app.get('/events', (req, res) => {
	res.send(events);
});




// ----------------------------------------------------------------------------
app.listen(4005, () => {
	console.log('Listening on 4005');
});
