require("dotenv").config();

const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const fileRoutes = require("./routes/files");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/files", fileRoutes);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).send("Token not provided");

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) return res.status(401).send("Invalid Token");
    req.user = decoded;
    next();
  });
};

app.get("/protected", verifyJWT, (req, res) => {
  res.send(`Hello ${req.user.name}, you have access!`);
});

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'>Login with Google</a>");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const payload = {
      email: user.emails[0].value,
      name: user.displayName,
    };

    const token = jwt.sign(payload, "jwt_secret_key", { expiresIn: "1h" });

    console.log("Generated JWT:", token);

    // res.redirect(`http://localhost:5173/dashboard?token=${token}`);
    res.json({ token });
  }
);

app.get("/dashboard", verifyJWT, (req, res) => {
  res.send(`Welcome ${req.user.name}`);
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// app.get("/", (req, res) => {
//   res.send("ConsentChain backend is running!");
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
