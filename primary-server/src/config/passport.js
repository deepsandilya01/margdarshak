import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import env from "./env.js";

// Check if credentials exist (to prevent crash if not configured in .env)
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value.toLowerCase()
              : null;

          if (!email) {
            return done(new Error("No email found from Google profile"), null);
          }

          // 1. Check if user already exists by googleId
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          }

          // 2. Check if user exists by email
          user = await User.findOne({ email });
          if (user) {
            // Link Google to existing account
            user.googleId = profile.id;
            user.authProvider = "both";
            if (!user.avatar && profile.photos && profile.photos[0]) {
              user.avatar = profile.photos[0].value;
            }
            await user.save({ validateBeforeSave: false });
            return done(null, user);
          }

          // 3. Create new user
          const newUser = new User({
            name: profile.displayName || "Google User",
            email,
            googleId: profile.id,
            authProvider: "google",
            avatar:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
          });

          // Save the new user (password is not required for google auth)
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

export default passport;
