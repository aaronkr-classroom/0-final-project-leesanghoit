"use strict";

/**
 * =====================================================================
 * Define Express app and set it up
 * =====================================================================
 */

// modules
const express = require("express"),
  layouts = require("express-ejs-layouts"),
  { check, validationResult } = require("express-validator"), // express-validator 추가
  app = express();

// controllers 폴더의 파일을 요청
const pagesController = require("./controllers/pagesController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  talksController = require("./controllers/talksController"),
  trainsController = require("./controllers/trainsController"),
  gameController = require("./controllers/gameController"),
  errorController = require("./controllers/errorController");

const router = express.Router();
app.use("/", router);

const methodOverride = require("method-override");
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

/**
 * =====================================================================
 * Flash Messages and Session
 * =====================================================================
 */
const expressSession = require("express-session"),
  cookieParser = require("cookie-parser"),
  connectFlash = require("connect-flash");

router.use(cookieParser("secret_passcode"));
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(connectFlash());

/**
 * =====================================================================
 * Passport Configuration and Middleware
 * =====================================================================
 */
const passport = require("passport");
router.use(passport.initialize());
router.use(passport.session());

const User = require("./models/User");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

/**
 * =====================================================================
 * Define Mongoose and MongoDB connection
 * =====================================================================
 */

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ut-node:1234@ut-node.gq7g93s.mongodb.net/?retryWrites=true&w=majority&appName=UT-Node",
  {}
);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connect to MONGODB!!!");
});

/**
 * =====================================================================
 * Define app settings and middleware
 * =====================================================================
 */

app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");
router.use(layouts);
router.use(express.static("public"));

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

/**
 * =====================================================================
 * Define routes
 * =====================================================================
 */

/**
 * Pages
 */
router.get("/", pagesController.showHome);
router.get("/about", pagesController.showAbout);
router.get("/transportation", pagesController.showTransportation);

router.get("/users/login", usersController.login);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);

/**
 * Users
 */
router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  ], // express-validator를 사용하여 유효성 검사를 추가
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(error => error.msg));
      return res.redirect("/users/new");
    }
    next();
  },
  usersController.create,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put(
  "/users/:id/update",
  [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
  ], // express-validator를 사용하여 유효성 검사를 추가
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array().map(error => error.msg));
      return res.redirect(`/users/${req.params.id}/edit`);
    }
    next();
  },
  usersController.update,
  usersController.redirectView
);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);

/**
 * Subscribers
 */
router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView
);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView
);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView
);

/**
 * Courses
 */
router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post(
  "/courses/create",
  coursesController.create,
  coursesController.redirectView
);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put(
  "/courses/:id/update",
  coursesController.update,
  coursesController.redirectView
);
router.delete(
  "/courses/:id/delete",
  coursesController.delete,
  coursesController.redirectView
);

/**
 * Talks
 */
router.get("/talks", talksController.index, talksController.indexView);
router.get("/talks/new", talksController.new);
router.post(
  "/talks/create",
  talksController.create,
  talksController.redirectView
);
router.get("/talks/:id", talksController.show, talksController.showView);
router.get("/talks/:id/edit", talksController.edit);
router.put(
  "/talks/:id/update",
  talksController.update,
  talksController.redirectView
);
router.delete(
  "/talks/:id/delete",
  talksController.delete,
  talksController.redirectView
);

/**
 * Trains
 */
router.get("/trains", trainsController.index, trainsController.indexView);
router.get("/trains/new", trainsController.new);
router.post(
  "/trains/create",
  trainsController.create,
  trainsController.redirectView
);
router.get("/trains/:id", trainsController.show, trainsController.showView);
router.get("/trains/:id/edit", trainsController.edit);
router.put(
  "/trains/:id/update",
  trainsController.update,
  trainsController.redirectView
);
router.delete(
  "/trains/:id/delete",
  trainsController.delete,
  trainsController.redirectView
);

/**
 * Game
 */
router.get("/game", gameController.index, gameController.indexView);
router.get("/game/new", gameController.new);
router.post(
  "/game/create",
  gameController.create,
  gameController.redirectView
);
router.get("/game/:id", gameController.show, gameController.showView);
router.get("/game/:id/edit", gameController.edit);
router.put(
  "/game/:id/update",
  gameController.update,
  gameController.redirectView
);
router.delete(
  "/game/:id/delete",
  gameController.delete,
  gameController.redirectView
);

/**
 * =====================================================================
 * Errors Handling & App Startup
 * =====================================================================
 */
app.use(errorController.resNotFound);
app.use(errorController.resInternalError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
