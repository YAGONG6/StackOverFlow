export const SERVER_HOST = 'http://localhost:3000';

export const PAGES = {
  QUESTIONS_LIST: 0,
  QUESTION_DETAIL: 1,
  TAG_LIST: 2,
  NEW_ANSWER: 3,
  NEW_QUESTION: 4,
  LOGIN: 5,
  REGISTER: 6,
  PROFILE: 7,
  EDIT_TAG: 8,
};

function padZero (num) {
  return num < 10 ? `0${num}` : num;
}

export function getDateTimeString (date) {
  const d = new Date(date);
  return {
    date: `${new Intl.DateTimeFormat('en', { month: 'short' }).format(d)} ${padZero(d.getDate())}, ${d.getFullYear()}`,
    time: `${padZero(d.getHours())}:${padZero(d.getMinutes())}`
  };
}

export function chunk (array, size = 4) {
  let result = [];
  for (let j = 0; j < array.length; ++j) {
    if (j % size === 0) {
      result.push([]);
    }
    result[result.length - 1].push(array[j]);
  }
  return result;
}