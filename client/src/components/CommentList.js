import React, { useState } from 'react';
import { getDateTimeString } from '../helper';

export function CommentList ({ user, comments, onAdd }) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState({ text: '' });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  let totalPage = comments.length === 0 ? 0 : Math.ceil(comments.length / 3) - 1;

  return (
    <React.Fragment>
      {
        (
          <tr className={'comment'}>
            <td colSpan={2} style={{ textAlign: 'left' }}>
              <form style={{ margin: 0 }} onSubmit={async (e) => {
                e.preventDefault();
                if(data.text.length > 140){
                  setMessage('Comments can not more than 140 chars!');
                  return ;
                }
                if(user.reputation < 100){
                  setMessage('Your reputation is not enough, can not make a comment!');
                  return ;
                }
                onAdd(data);
                setData({ text: '' });
              }
              }>
                {
                !!message && (
                  <div className="form-group">
                    <div className="tip">{message}</div>
                  </div>
                  )
                }
                {
                  show && user && (
                    <>
                      <input style={{ display: 'inline-block', width: 200, height: 25 }} placeholder={'Add comment...'}
                             required
                             name="text" value={data.text} onInput={e => setData({ ...data, text: e.target.value })}/>
                      <button type={'submit'} style={{ marginLeft: 10 }}>Submit</button>
                    </>
                  )
                }

                <button type={'button'} style={{ marginLeft: 10 }}
                        onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'} comments
                </button>

              </form>
            </td>
            <td className={'comment'} style={{ textAlign: 'right' }}>
              {
                totalPage && show > 0 && (
                  <>
                    {page > 0 && <button type={'button'} onClick={() => setPage(page - 1)}>Prev page</button>}
                    {page < totalPage &&
                      <button style={{ marginLeft: 10 }} type={'button'} onClick={() => setPage(page + 1)}>Next
                        page</button>}
                  </>
                )
              }
            </td>
          </tr>
        )
      }
      {
        comments.length > 0 && show && (
          <>
            {
              comments.slice(page * 3, page * 3 + 3).map((v) => {
                return (
                  <tr key={v._id} style={{ fontSize: 'small' }} className={'comment'}>
                    <td colSpan={2} style={{ padding: 5 }}>{v.text}</td>
                    <td style={{ textAlign: 'right', padding: 5 }}>
                      <div>Commented By <span className="askedBy">{v.comment_by.username}</span></div>
                      <div>On <span className="askedOn">{getDateTimeString(new Date(v.comment_date)).date}</span></div>
                      <div>At <span className="askedAt">{getDateTimeString(new Date(v.comment_date)).time}</span></div>
                    </td>
                  </tr>
                );
              })
            }
          </>
        )
      }
    </React.Fragment>

  );
}