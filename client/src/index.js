import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import QuestionListPage from './components/QuestionListPage';
import QuestionDetailPage from './components/QuestionDetailPage';
import NewAnswerPage from './components/NewAnswerPage';
import NewQuestionPage from './components/NewQuestionPage';
import TagListPage from './components/TagListPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import Profile from './components/Profile';
import EditTagPage from './components/EditTagPage';

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<FakeStackOverflow/>}>
        <Route path={'/allquestions'} element={<QuestionListPage/>}/>
        <Route path={'/question/new'} element={<NewQuestionPage/>}/>
        <Route path={'/question/:id/answer'} element={<NewAnswerPage/>}/>
        <Route path={'/question/:id'} element={<QuestionDetailPage/>}/>
        <Route path={'/tags'} element={<TagListPage/>}/>
        <Route path={'/register'} element={<RegisterPage/>}/>
        <Route index element={<LoginPage/>}/>
        <Route path={'/profile'} element={<Profile/>}/>
        <Route path={'/tag/:id/edit'} element={<EditTagPage/>}/>
        <Route path={'/question/:id/edit'} element={<NewQuestionPage/>}/>
        <Route path={'/answer/:aid/edit'} element={<NewAnswerPage/>}/>
      </Route>
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);
