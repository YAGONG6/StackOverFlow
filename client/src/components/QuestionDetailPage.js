import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getDateTimeString, SERVER_HOST } from '../helper';
import { CommentList } from './CommentList';
import { Vote } from './Vote';
import { AppContext } from '../appContext';
import { useNavigate, useParams } from 'react-router';

export default function QuestionDetailPage () {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  function fetchData () {
    axios.get(SERVER_HOST + '/posts/question/' + id)
      .then(res => {
        setQuestion(res.data);
      });
  }

  useEffect(() => {
    axios.get(SERVER_HOST + '/posts/question/' + id + '/inc');
    axios.get(SERVER_HOST + '/posts/question/' + id)
      .then(res => {
        setQuestion(res.data);
      });
  }, [id]);

  if (!question) {
    return 'Loading...';
  }

  return <div>
    <table>
      <tbody>
      <tr>
        <td width={200} style={{ textAlign: 'center' }}>
          <p>{question.answers.length} Answers</p>
          <Vote user={user} votes={question.votes} onVote={(data) => {
            axios.post(SERVER_HOST + `/posts/question/${question._id}/vote`, data)
              .then(fetchData)
              .catch(err => {
                alert(err.response?.data ?? err.message);
              });
          }}/>
        </td>
        <td style={{ textAlign: 'center' }}><strong>{question.title}</strong></td>
        <td style={{ textAlign: 'right' }} width={200}>
          {
            !!user && (
              <button type="button" onClick={() => navigate('/question/new')}>
                Ask A Question
              </button>
            )
          }
        </td>
      </tr>
      <tr>
        <td className={'answer'} style={{ textAlign: 'center' }}>{question.views} Views</td>
        <td className={'answer'} style={{ textAlign: 'center' }}>{question.text}</td>
        <td className={'answer'} style={{ textAlign: 'right' }}>
          <div>Asked By <span className="askedBy">{question.asked_by.username}</span></div>
          <div>On <span className="askedOn">{getDateTimeString(question.asked_date_time).date}</span></div>
          <div>At <span className="askedAt">{getDateTimeString(question.asked_date_time).time}</span></div>
        </td>
      </tr>

      <CommentList user={user} comments={question.comments} onAdd={(data) => {
        axios.post(SERVER_HOST + `/posts/question/${question._id}/comment`, data)
          .then(fetchData);
      }}/>

      {question.answers.map((answer) => (
        <React.Fragment key={answer._id}>
          <tr>
            <td className={'answer'}>
              <Vote user={user} votes={answer.votes} onVote={(data) => {
                axios.post(SERVER_HOST + `/posts/answer/${answer._id}/vote`, data)
                  .then(fetchData)
                  .catch(err => {
                    alert(err.response?.data ?? err.message);
                  });
              }}/>
            </td>
            <td className={'answer'}>{answer.text}</td>
            <td style={{ textAlign: 'right' }} className={'answer'}>
              <div>Ans By <span className="askedBy">{answer.ans_by.username}</span></div>
              <div>On <span className="askedOn">{getDateTimeString(answer.ans_date_time).time}</span></div>
              <div>At <span className="askedAt">{getDateTimeString(answer.ans_date_time).date}</span></div>
            </td>
          </tr>
          <CommentList user={user} comments={answer.comments} onAdd={(data) => {
            axios.post(SERVER_HOST + `/posts/answer/${answer._id}/comment`, data)
              .then(fetchData);
          }}/>
        </React.Fragment>
      ))}
      <tr>
        <td colSpan={3} style={{ textAlign: 'center' }}>
          {
            !!user && (
              <button type="button" onClick={() => navigate(`/question/${id}/answer`)}>Answer Question</button>
            )
          }
        </td>
      </tr>
      </tbody>
    </table>
  </div>;
}