const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const conf = require("../config/config");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: conf.tokenSecret,
  algorithms: ["HS256"],
  issuer: "Minutes Made"
};

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    return done(null, jwtPayload.userId);
  })
);
