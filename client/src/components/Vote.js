import React from 'react';

export function Vote ({ user, onVote, votes }) {

  return (
    <div>
      <button className={'plain'} disabled={!user} onClick={() => onVote({ vote_up: true })}>Vote
        Up {votes.filter(v => v.vote_up).length}</button>
      <button className={'plain'} style={{ marginLeft: 10 }} disabled={!user}
              onClick={() => onVote({ vote_up: false })}>Vote
        Down {votes.filter(v => !v.vote_up).length}</button>
    </div>
  );

}