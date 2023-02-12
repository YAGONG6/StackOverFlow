import React, { useState } from 'react';
import axios from 'axios';
import { SERVER_HOST } from '../helper';
import { useNavigate } from 'react-router';

export default function RegisterPage () {
  const [message, setMessage] = useState('');
  const [data, setData] = useState({ username: '', email: '', password: '', confirm: '' });
  const navigate = useNavigate();

  function onSubmit (e) {
    e.preventDefault();
    let msg = '';
    if (!data.username) {
      msg += 'Please input username.\n';
    }
    if (!data.email) {
      msg += 'Please input email.\n';
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      msg += 'Please input a valid email.\n';
    }
    if (!data.password) {
      msg += 'Please input password.\n';
    } else if (data.password !== data.confirm) {
      msg += 'Passwords do not match.\n';
    }
    if (msg) {
      setMessage(msg);
      return;
    }
    axios.post(SERVER_HOST + `/posts/user/register`, data)
      .then(res => {
        navigate('/');
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
        <h1>Register</h1>

        {
          message && (
            <div className="form-group">
              <div className="tip">{message}</div>
            </div>
          )
        }

        <div className="form-group">
          <h4>Username</h4>
          <input name="username" value={data.username} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Email</h4>
          <input name="email" type={'email'} value={data.email} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Password</h4>
          <input name="password" type={'password'} value={data.password} onInput={onInput}/>
        </div>

        <div className="form-group">
          <h4>Confirm Password</h4>
          <input name="confirm" type={'password'} value={data.confirm} onInput={onInput}/>
        </div>

        <div className="form-group">
          <button>Register</button>
        </div>

      </form>
    </div>
  );
}