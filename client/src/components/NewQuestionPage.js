import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../helper';
import { useNavigate, useParams } from 'react-router';

export default function NewQuestionPage () {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [data, setData] = useState({
    title: '',
    summary: '',
    text: '',
    tags: '',
    answers: []
  });

  useEffect(() => {
    if (id) {
      axios.get(SERVER_HOST + `/posts/question/${id}`)
        .then(res => {
          setData({
            title: res.data.title,
            summary: res.data.summary,
            text: res.data.text,
            tags: res.data.tags.map(v => v.name).join(' ')
          });
        });
    }
  }, [id]);

  function onSubmit (e) {
    e.preventDefault();
    let msg = '';
    if (!data.title) {
      msg += 'Please input title.\n';
    }
    if (data.title.length > 50) {
      msg += 'Title should not be more than 50 characters.\n';
    }
    if (!data.summary) {
      msg += 'Please input summary.\n';
    }
    if (data.summary.length > 140) {
      msg += 'Summary should not be more than 140 characters.\n';
    }
    if (!data.text) {
      msg += 'Please input text.\n';
    }

    if (msg) {
      setMessage(msg);
      return;
    }
    if (id) {
      axios.put(SERVER_HOST + `/posts/question/${id}`, data)
        .then(res => {
          navigate('/profile');
        })
        .catch(err => {
          setMessage(err.response?.data ?? err.message);

        });
    } else {
      axios.post(SERVER_HOST + `/posts/question/`, data)
        .then(res => {
          navigate('/allquestions');
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
        {
          !!message && (
            <div className="form-group">
              <div className={'tip'}>{message}</div>
            </div>
          )
        }

        <div className="form-group">
          <h4>Question Title</h4>
          <small>This should not be more than 100 characters.</small>
          <input name="title" value={data.title} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Question Summary</h4>
          <small>This should not be more than 140 characters.</small>
          <input name="summary" value={data.summary} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Question Text</h4>
          <small>Add details.</small>
          <textarea name="text" rows="15" value={data.text} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Tags</h4>
          <small>Add keywords seperated by whitespaces.</small>
          <input name="tags" value={data.tags} onInput={onInput}/>
        </div>

        <div className={'form-group'}>
          <button>{id ? 'Submit' : 'Post Question'}</button>
          {
            !!id && <button style={{ marginLeft: 10 }} onClick={() => {
              if (window.confirm('Are you sure?')) {
                axios.delete(SERVER_HOST + `/posts/question/${id}`)
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