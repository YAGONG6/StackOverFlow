import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { chunk, SERVER_HOST } from '../helper';
import { useNavigate } from 'react-router';
import { AppContext } from '../appContext';

export default function TagListPage () {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    axios.get(SERVER_HOST + '/posts/tags')
      .then(res => {
        setTags(res.data);
      });
  }, []);

  function getNoQuestionText () {
    if (!tags.length) {
      return <h3 style={{ textAlign: 'center' }}>No Question Found</h3>;
    }
  }

  return <div>
    <table>
      <tbody>
      <tr style={{ fontWeight: 'bold' }}>
        <td width={200} style={{ textAlign: 'center' }}>{tags.length} Tags</td>
        <td style={{ textAlign: 'center' }}>All Tags</td>
        <td width={200} style={{ textAlign: 'right' }}>
          {!!user && <button type="button" onClick={() => navigate('/question/new')}>Ask A
            Question</button>}
        </td>
      </tr>
      {
        chunk(tags, 3).map((row, index) => <tr key={index}>
          {row.map((tag) => {
            return (
              <td style={{ textAlign: 'center' }} key={tag._id}>
                <div className="tag-big">
                  <div className="tag-big-title"
                       onClick={() => navigate(`/allquestions?search=[${tag.name}]&title=Questions tagged [${tag.name}]`)}>{tag.name}</div>
                  <div>{tag.questions} Question(s)</div>
                </div>
              </td>
            );
          })}
        </tr>)
      }
      </tbody>
    </table>
    {
      getNoQuestionText()
    }
  </div>;
}