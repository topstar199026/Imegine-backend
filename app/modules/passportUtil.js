const constants = require('../../constants');
const {Message, Constant} = constants;


var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

module.exports = function(passport) {
	var jwtOptions = {}
	jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	jwtOptions.secretOrKey = Constant.secretOrKey;

	var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('---user check request---')
        console.log(jwt_payload)
		// usually this would be a database call:
		var user = jwt_payload;
		if(user)
			next(null, user);
		else
			next(null,null);
	});
		
	passport.use(strategy);
};
