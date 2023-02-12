import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  SERVER_HOST } from '../helper';
import { useNavigate, useParams } from 'react-router';

export default function NewAnswerPage () {
  const [message, setMessage] = useState('');
  const [data, setData] = useState({ text: '' });
  const { id , aid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (aid) {
      axios.get(SERVER_HOST + `/posts/answer/${aid}`)
        .then(res => {
          setData(res.data);
        });
    }
  }, [aid]);

  function onSubmit (e) {
    e.preventDefault();
    let msg = '';
    if (!data.text) {
      msg += 'Please input text content.\n';
    }
    if (msg) {
      setMessage(msg);
      return;
    }
    if (aid) {
      axios.put(SERVER_HOST + `/posts/answer/${aid}`, data)
        .then(res => {
          navigate('/profile');
        })
        .catch(err => {
          setMessage(err.response?.data ?? err.message);
        });
    } else {
      axios.post(SERVER_HOST + `/posts/question/${id}/answer`, data)
        .then(res => {
          navigate(`/question/${id}`);
        })
        .catch(err => {
          setMessage(err.response?.data ?? err.message);

        });
    }

  }

  function onInput (e) {
    setData(prevState => ({
      ...prevState,
      [e.target.getAttribute('name')]: e.target.value
    }));
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>{aid ? 'Edit Answer' : 'New Answer'}</h1>
        {
          !!message && (
            <div className="form-group">
              <div className="tip">{message}</div>
            </div>
          )
        }

        <div className="form-group">
          <h4>Answer Text</h4>
          <textarea rows="15" name="text" value={data.text} onInput={onInput}/>
        </div>

        <div className="form-group">
          <button>{aid ? 'Submit' : 'Post Answer'}</button>
          {
            !!aid && <button style={{ marginLeft: 10 }} onClick={() => {
              if (window.confirm('Are you sure?')) {
                axios.delete(SERVER_HOST + `/posts/answer/${aid}`)
                  .then(res => {
                    navigate('/profile');
                  })
                  .catch(err => {
                    window.alert(err.response?.data ?? err.message);
                  });
              }
            }}>Delete
            </button>
          }
        </div>

      </form>
    </div>
  );
}
