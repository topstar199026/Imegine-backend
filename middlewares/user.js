const _user = async (socket, next) => {
	try {
		const user = {
			id: '1',
			sample: 'sample',
		};
		socket.user = user;
		next();
	} catch (e) {
		next(new Error("unknown user"));
	}
}

module.exports = {
	_user,
};