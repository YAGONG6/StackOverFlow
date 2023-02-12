import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { chunk, getDateTimeString, SERVER_HOST } from '../helper';
import { AppContext } from '../appContext';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

export default function Profile () {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [qList, setQList] = useState([]);
  const [aList, setAList] = useState([]);
  const [tList, setTList] = useState([]);

  useEffect(() => {
    (async () => {
      const res1 = await axios.get(SERVER_HOST + '/posts/questions');
      setQList(res1.data.filter(v => v.asked_by._id === user._id));

      const res2 = await axios.get(SERVER_HOST + '/posts/answers');
      setAList(res2.data.filter(v => v.ans_by === user._id));

      const res3 = await axios.get(SERVER_HOST + '/posts/tags');
      setTList(res3.data.filter(v => v.created_by === user._id));
    })();
  }, [user._id]);

  return <div>
    <h1>Profile</h1>
    <p>Name: {user.username}</p>
    <p>Email: {user.email}</p>
    <p>Reputation: {user.reputation}</p>
    <p>Joined at: {getDateTimeString(user.joined).date}</p>
    <h1>My Questions ({qList.length})</h1>
    <table>
      <tbody>
      {qList.map((question) => {
        return (
          <tr key={question._id}>
            <td style={{ textAlign: 'center' }} className={'question'}>
              <div>{question.views} Views</div>
              <div>{question.answers.length} Answers</div>
            </td>
            <td style={{ textAlign: 'center' }} className={'question'}>
              <div style={{ textAlign: 'center' }} className="summary">Summary: {question.summary}</div>
              <div className="title"
                   onClick={() => navigate(`/question/${question._id}/edit`)}>(Editable) {question.title}</div>

              {
                chunk(question.tags).map((row, i) => {
                  return <React.Fragment key={i}>
                    {
                      row.map(tag => <span key={tag._id} className="tag">{tag.name}</span>)
                    }
                    <br/>
                  </React.Fragment>;
                })
              }
            </td>

            <td style={{ textAlign: 'right' }} className={'question'}>
              <div>Asked By <span className="askedBy">{question.asked_by.username}</span></div>
              <div>On <span className="askedOn">{getDateTimeString(question.asked_date_time).date}</span></div>
              <div>At <span className="askedAt">{getDateTimeString(question.asked_date_time).time}</span></div>
            </td>
          </tr>
        );
      })
      }
      </tbody>
    </table>

    <h1>My Answers ({aList.length})</h1>
    <ol>
      {
        aList.map(v => <li key={v._id}>
          <Link to={`/answer/${v._id}/edit`}>(Editable) {v.text}</Link>
        </li>)
      }
    </ol>

    <h1>My Tags ({tList.length})</h1>
    {
      tList.map(tag => {
        return (
          <div key={tag._id} className="tag-big" style={{ textAlign: 'center', marginRight: 20, marginBottom: 20 }}>
            <div className="tag-big-title"
                 onClick={() => navigate(`/tag/${tag._id}/edit`)}>(Editable) {tag.name}</div>
            <div>{tag.questions} Question(s)</div>
          </div>
        );
      })
    }
  </div>;
}