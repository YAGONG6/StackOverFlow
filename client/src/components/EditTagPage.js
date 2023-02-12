import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../helper';
import { useNavigate, useParams } from 'react-router';

export default function EditTagPage () {
  const [message, setMessage] = useState('');
  const [data, setData] = useState({ name: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(SERVER_HOST + `/posts/tag/${id}`)
      .then(res => {
        setData(res.data);
      });

  }, [id]);

  function onSubmit (e) {
    e.preventDefault();
    let msg = '';
    if (!data.name) {
      msg += 'Please input text content.\n';
    }
    if (msg) {
      setMessage(msg);
      return;
    }

    axios.put(SERVER_HOST + `/posts/tag/${id}`, data)
      .then(res => {
        navigate('/profile');
      })
      .catch(err => {
        setMessage(err.response?.data ?? err.message);
      });

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
        <h1>{'Edit Tag'}</h1>
        {
          !!message && (
            <div className="form-group">
              <div className="tip">{message}</div>
            </div>
          )
        }

        <div className="form-group">
          <h4>Tag Name</h4>
          <textarea rows="15" name="name" value={data.name} onInput={onInput}/>
        </div>

        <div className="form-group">
          <button>Submit</button>
          <button style={{ marginLeft: 10 }} onClick={() => {
            if (window.confirm('Are you sure?')) {
              axios.delete(SERVER_HOST + `/posts/tag/${id}`)
                .then(res => {
                  navigate('/profile');
                })
                .catch(err => {
                  window.alert(err.response?.data ?? err.message);
                });
            }
          }}>Delete
          </button>
        </div>
      </form>
    </div>
  );
}