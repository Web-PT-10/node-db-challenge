const server = require('./server');

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
	console.log(`THIS SHIZ IS ON! GET TO WORK!: http://localhost:${PORT}`);
});
