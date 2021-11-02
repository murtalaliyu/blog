import React, { useState } from 'react';
import axios from 'axios';

export default ({postId}) => {
	const [content, setContent] = useState('');

	const onSubmit = async (event) => {
		event.preventDefault();

		await axios.post(`http://bluepink.org/posts/${postId}/comments`, {
			content
		});

		setContent('');
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Comment</label>
					<input 
						value={content} 
						onChange={e => setContent(e.target.value)} 
						className="form-control" 
					/>
				</div>

				<button className="btn btn-primary">Create Comment</button>
			</form>
		</div>
	);
};
