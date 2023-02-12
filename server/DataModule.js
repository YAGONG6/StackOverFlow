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

get_allquestion = async (req,res) => {
    const q = req.query.q || '';
    const conditions = q.trim().split(/\s+?/).filter(v => !!v);
    let list = await Question.find({})
        .populate('tags')
        .populate('answers')
        .populate('asked_by')
        .sort('-asked_date_time')
        .lean();
    let result = conditions.length === 0 ? list : [];
    for (const row of list) {
        for (const condition of conditions) {
            const c = condition.toLowerCase();
            const isTag = /^\[.+?\]$/.test(c);
            const tagMatch = isTag && row.tags.some(v => `[${v.name.toLowerCase()}]` === c);
            const contentMatch = !isTag && (row.title.toLowerCase().includes(c) || row.text.toLowerCase().includes(c) || row.summary.toLowerCase().includes(c));
            if (tagMatch || contentMatch) {
                result.push(row);
                break;
            }
        }
    }

    res.json(result);
}

get_questionbyId = async (req,res) => {
    let a = await Question.findById(req.params.id)
    .populate('tags')
    .populate('asked_by')
    .populate({ path: 'answers', options: { sort: { 'ans_date_time': -1 } }, populate: { path: 'ans_by' } })
    .populate({
        path: 'answers',
        options: { sort: { 'ans_date_time': -1 } },
        populate: { path: 'comments.comment_by' }
    })
    .populate({ path: 'comments', populate: { path: 'comment_by' } })
    res.json(a);
}

get_alltags = async (req,res) => {
    const t = req.query.t || '';
    const keyWord = t.trim().replace(/\s/g, '');
    const tags = await Tag.find({ name: { $regex: keyWord } }).lean();
    const questions = await Question.find({}).lean();
    for (const tag of tags) {
        tag.questions = questions.filter(q => q.tags.map(v => v.toString()).indexOf(tag._id.toString()) >= 0).length;
    }
    res.json(tags);
}

delete_tagbyId = async (req,res) => {
    await Question.updateMany({}, {
        $pullAll: {
          tags: [req.params.id],
        },
      });
    await Tag.findByIdAndRemove(req.params.id);
    res.sendStatus(200);
}

post_newquestion = async (req,res) => {
  const tags = [];
  if (req.body.tags) {
    const requestTagsArray = req.body.tags.trim().split(/\s+?/);
    for (const tag of requestTagsArray) {
      const savedTag = await Tag.find({ name: tag });
      if (savedTag.length) {
        tags.push(savedTag[0]);
      } else {
        if (req.session.user.reputation < 100) {
          res.status(401).send('Not able to create tag because your reputation is lower than 100.');
          return;
        }
        const newTag = new Tag({ name: tag, created_by: req.session.user._id });
        await newTag.save();
        tags.push(newTag);
      }
    }
  }
  req.body.tags = tags.map(v => v._id);
  const question = new Question({ ...req.body, asked_by: req.session.user._id });
  await question.save();
  res.sendStatus(201);
}

update_question = async (req,res) => {
  const tags = [];
  if (req.body.tags) {
    const requestTagsArray = req.body.tags.trim().split(/\s+?/);
    for (const tag of requestTagsArray) {
      const savedTag = await Tag.find({ name: tag });
      if (savedTag.length) {
        tags.push(savedTag[0]);
      } else {
        if (req.session.user.reputation < 100) {
          res.status(401).send('Not able to create tag because your reputation is lower than 100.');
          return;
        }
        const newTag = new Tag({ name: tag, created_by: req.session.user._id });
        await newTag.save();
        tags.push(newTag);
      }
    }
  }
  req.body.tags = tags.map(v => v._id);
  await Question.findByIdAndUpdate(req.params.id, req.body);
  res.sendStatus(200);
}

post_newanswer = async (req,res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.sendStatus(404);
    return;
  }
  const answer = new Answer({ ...req.body, ans_by: req.session.user._id });
  await answer.save();
  question.answers.push(answer);
  await question.save();
  res.sendStatus(201);
}

delete_answerbyId = async (req,res) => {
    await Question.updateMany(
        {},
        { $pullAll: { answers: [req.params.aid] } },
      );
    await Answer.findByIdAndRemove(req.params.aid);
    res.sendStatus(201);
}

vote_question = async (req,res) => {
    const q = await Question.findById(req.params.id);
    const vote = q.votes.find(v => v.vote_by.toString() === req.session.user._id.toString());
    if (vote) {
        q.votes.splice(q.votes.indexOf(vote), 1);
    }
    q.votes.push({ vote_up: req.body.vote_up, vote_by: req.session.user._id });
    await q.save();
    let u = await User.findById(q.asked_by);    
    if (vote) {
        u.reputation -= vote.vote_up ? 5 : -10;
    }
    u.reputation += req.body.vote_up ? 5 : -10;
    await u.save();
    res.sendStatus(200);
}

vote_answer = async (req,res) => {
    const q = await Answer.findById(req.params.id);
    const vote = q.votes.find(v => v.vote_by.toString() === req.session.user._id.toString());
    if (vote) {
        q.votes.splice(q.votes.indexOf(vote), 1);
    }
    q.votes.push({ vote_up: req.body.vote_up, vote_by: req.session.user._id });
    await q.save();
    let u = await User.findById(q.ans_by);
    if (vote) {
        u.reputation -= vote.vote_up ? 5 : -10;
    }
    u.reputation += req.body.vote_up ? 5 : -10;
    await u.save();
    res.sendStatus(200);
}

comment_question = async (req,res) => {
    await Question.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { text: req.body.text, comment_by: req.session.user._id } } },
    );
    res.sendStatus(200);
}

comment_answer = async (req,res) => {
    await Answer.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { text: req.body.text, comment_by: req.session.user._id } } },
    );
    res.sendStatus(200);
}

module.exports ={
    get_allquestion,
    get_alltags,
    get_questionbyId,
    post_newquestion,
    update_question,
    delete_tagbyId,
    post_newanswer,
    delete_answerbyId,
    vote_question,
    vote_answer,
    comment_question,
    comment_answer
}