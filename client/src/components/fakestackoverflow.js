import React, { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { SERVER_HOST } from '../helper';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { AppContext } from '../appContext';
import { parse } from 'qs';

// main entry
export default function FakeStackOverflow () {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const q = useMemo(() => parse(location.search.replace('?', '')), [location]);

  useEffect(() => {
    setSearch(q.search || '');
  }, [q.search]);

  useEffect(() => {
    axios.get(SERVER_HOST + `/posts/user/me`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  function logout () {
    axios.get(SERVER_HOST + `/posts/user/logout`)
      .then(res => {
        navigate('/');
        setUser(null);
      });
  }

  return (
    <div>
      <div>
        <div className={'navbar'}>
          <Link className={`nav-link`} to={'/allquestions'}>Questions</Link>
          <Link className={`nav-link`} to={'/tags'}>Tags</Link>

          {
            user ? <>
              <Link className={`nav-link`} to={'/profile'}>Profile</Link>

              <div
                className={`nav-link`}
                onClick={logout}
              >
                Logout
              </div>
            </> : <>
              <Link className={`nav-link`} to={'/'}>Login</Link>
              <Link className={`nav-link`} to={'/register'}>Register</Link>

            </>
          }

          <div className="nav-title">Fake StackOverflow</div>
          <input
            className={'nav-search'}
            placeholder="Search..."
            value={search}
            onInput={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                navigate(`/allquestions?search=${search}`);
              }
            }}
          />
        </div>
      </div>

      <main>
        {
          loading ? <p>Loading...</p> : <AppContext.Provider value={{ user, setUser }}>
            <Outlet/>
          </AppContext.Provider>
        }
      </main>
    </div>
  );
}
