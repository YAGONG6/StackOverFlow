import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { chunk, getDateTimeString, SERVER_HOST } from '../helper';
import { useLocation } from 'react-router-dom';
import { parse } from 'qs';
import { AppContext } from '../appContext';
import { useNavigate } from 'react-router';

export default function QuestionListPage () {
  const { user } = useContext(AppContext);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const q = useMemo(() => parse(location.search.replace('?', '')), [location]);

  useEffect(() => {
    axios.get(SERVER_HOST + '/posts/questions?q=' + encodeURIComponent(q.search || ''))
      .then(res => {
        setPage(0);
        setList(res.data);
      });
  }, [q]);

  function getNoQuestionText () {
    if (!list.length) {
      return <h3 style={{ textAlign: 'center' }}>No Question Found</h3>;
    }
  }

  let totalPage = list.length === 0 ? 0 : Math.ceil(list.length / 5) - 1;

  return <div>
    <table>
      <tbody>
      <tr style={{ fontWeight: 'bold' }}>
        <td style={{ textAlign: 'center' }} width={200}>{list.length} Questions</td>
        <td style={{ textAlign: 'center' }}>{q.title || 'All Questions'}</td>
        <td style={{ textAlign: 'right' }} width={200}>
          {!!user && <button type="button" onClick={() => navigate('/question/new')}>Ask A
            Question</button>}
        </td>
      </tr>
      <tr style={{ fontWeight: 'bold' }}>
        <td style={{ textAlign: 'center' }} width={200}>
          {
            page > 0 && <button type={'button'} onClick={() => setPage(page - 1)}>Prev page</button>
          }
        </td>
        <td style={{ textAlign: 'center' }}></td>
        <td style={{ textAlign: 'right' }} width={200}>

          {
            page < totalPage && <button type={'button'} onClick={() => setPage(page + 1)}>Next page</button>
          }
        </td>
      </tr>
      {list.slice(page * 5, page * 5 + 5).map((question) => {
        return (
          <tr key={question._id}>
            <td style={{ textAlign: 'center' }} className={'question'}>
              <div>{question.views} Views</div>
              <div>{question.answers.length} Answers</div>
            </td>
            <td style={{ textAlign: 'center' }} className={'question'}>
              <div style={{ textAlign: 'center' }} className="summary">Summary: {question.summary}</div>
              <div className="title"
                   onClick={() => navigate(`/question/${question._id}`)}>Title: {question.title}</div>     

              {
                chunk(question.tags).map((row, i) => 
                   <React.Fragment key={i}>
                    {
                      row.map(tag => <span key={tag._id} className="tag">{tag.name}</span>)
                    }
                    <br/>
                  </React.Fragment>
                )
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
    {
      getNoQuestionText()
    }
  </div>;
}