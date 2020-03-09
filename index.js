const server = require('./server');

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`YOUR SHIT IS WORKING NOW! GET TO WORK BITCH!: http://localhost:${PORT}`);
});
