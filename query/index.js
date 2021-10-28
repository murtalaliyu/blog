const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	if (type === 'PostCreated') {
		const { title, id } = data;
		posts[id] = { id, title, comments:[] };
	}

	if (type === 'CommentCreated') {
		const { id, content, postId } = data;

		const post = posts[postId];
		post.comments.push({ id, content });
	}

	//console.log(posts);
	res.send({});
});










// ----------------------------------------------------------------------------
app.listen(4002, () => {
	console.log('Listening on 4002');
});
