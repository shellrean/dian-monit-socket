const express = require('express')
const bodyParser = require('body-parser')
const http = require('http');
const axios = require('axios')

const app = express();

app.use(bodyParser.json());

let io = require('socket.io').listen(app.listen(4000));

io.sockets.on('connection', function(socket) {
	socket.on('monitor', function(payload) {
		let socs = io.sockets.connected;
		let clients = Object.values(socs).filter(item => item.channel != null).map(item => ({user: item.user, key: item.channel}))
		io.emit('monit', clients)
	})

	socket.on('getin', function(payload) {
		socket.user = payload.user
		socket.channel = payload.channel

		io.emit('is_online_'+socket.channel, { user: payload.user, key: payload.channel })
		console.log('connect to channel'+socket.channel)
	})

	socket.on('disconnect', function(username) {
		io.emit('is_offline_'+socket.channel, { user: socket.user, key: socket.channel });
		console.log(' left to channel'+socket.channel)
	})

	socket.on('exit', function(payload) {
		io.emit('is_offline_'+socket.channel, { user: socket.user, key: socket.channel });
		console.log(' left to channel'+socket.channel)
		io.sockets.disconnect()
	})
})
console.log('Server run on port 4000')