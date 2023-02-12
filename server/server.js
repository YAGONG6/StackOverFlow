// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const  usercontroller = require('./UserController');
const Data = require('./DataModule');

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

let User = require('./models/user');
let Tag = require('./models/tags');
let Answer = require('./models/answers');
let Question = require('./models/questions');

const app = express();
app.use(session({ secret: 'sk', cookie: {} }));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = new express.Router();
app.use('/posts', router);

router.get('/answers', async (req, res) => {
  res.json(await Answer.find());
});

router.get('/answers/:id', async (req, res) => {
  res.json(await Answer.findById(req.params.id));
});

router.post('/user/register', usercontroller.registerUser);

router.post('/user/login', usercontroller.Login);

router.get('/user/logout', usercontroller.requireLogin, (req, res) => {
  delete req.session.user;
  res.sendStatus(200);
});

router.get('/user/me', async (req, res) => {
  res.json(req.session.user || null);
});

/**
 * get all questions
 */
router.get('/questions', Data.get_allquestion);

router.get('/question/:id/inc', async function (req, res) {
  await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.sendStatus(200);
});

/**
 * get question by id
 */
router.get('/question/:id', Data.get_questionbyId);

/**
 * get all tags
 */
router.get('/tags', Data.get_alltags);

/**
 * get tag by id
 */
router.get('/tag/:id', async function (req, res) {
  res.json(await Tag.findById(req.params.id));
});

/**
 * delete tag by id
 */
router.delete('/tag/:id', Data.delete_tagbyId);

/**
 * get answer by id
 */
router.get('/answer/:id', async function (req, res) {
  res.json(await Answer.findById(req.params.id).populate('ans_by'));
});

/**
 * create new question
 */
router.post('/question', usercontroller.requireLogin, Data.post_newquestion);

/**
 * update question
 */
router.put('/question/:id', usercontroller.requireLogin, Data.update_question);

/**
 * delete question
 */
router.delete('/question/:id', usercontroller.requireLogin, async function (req, res) {
  await Question.findByIdAndRemove(req.params.id);
  res.sendStatus(200);
});

/**
 * create new answer
 */
router.post('/question/:id/answer', usercontroller.requireLogin, Data.post_newanswer);

/**
 * update answer
 */
router.put('/answer/:id', usercontroller.requireLogin, async function (req, res) {
  await Answer.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
});

/**
 * update tag
 */
router.put('/tag/:id', usercontroller.requireLogin, async function (req, res) {
  await Tag.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
});

/**
 * delete answer
 */
router.delete('/answer/:aid', usercontroller.requireLogin, Data.delete_answerbyId);

/**
 * question vote
 */
router.post('/question/:id/vote', usercontroller.requireLogin, usercontroller.requireReputation, Data.vote_question);

/**
 * answer vote
 */
router.post('/answer/:id/vote', usercontroller.requireLogin, usercontroller.requireReputation, Data.vote_answer);

/**
 * question comment
 */
router.post('/question/:id/comment', usercontroller.requireLogin, Data.comment_question);

/**
 * answer comment
 */
router.post('/answer/:id/comment', usercontroller.requireLogin, Data.comment_answer);

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/fake_so', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//'mongodb://localhost:27017/fake_so'
const db = mongoose.connection;

db.on('error', function (err) {
  console.error(err);
});

db.once('open', async function () {
  console.log('Database connected.');
  if (await User.count() === 0) {
    // insert a user with reputation= 100
    const u = new User({
      username: 'seed',
      email: 'seed@fakeso.com',
      password: bcrypt.hashSync('123456', 10),
      reputation: 120
    });
    await u.save();
    console.log('seed user added!');
  }
  // api routes and pages
  app.listen(8000, () => {
    console.log(`Server listening at http://localhost:8000`);
  });
});

process.on('SIGINT', async () => {
  await db.close();
  console.info('Server closed. Database instance disconnected');
  process.exit(0);
});
