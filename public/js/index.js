// utils imports
import getTimeDifference from './utils/getTimeDifference.js';
import copyToClipboard from './utils/copyToClipboard.js';

// Importing DOM elements
const emailList = document.getElementById('email-list');

// getting latest codes and start listening to new once
const getCodes = async () => {
  //get codes and sending times
  await new Promise((res) => setTimeout(res, 1000)); // timer for making shure IMAP is connected

  const { data } = await fetch('/codes')
    .then((res) => res.json())
    .catch((err) => console.log(console.error(err.message)));

  // remove loading text 'Wait a moment...'
  emailList.innerText = '';
  // for all found codes, add them to UI
  data.forEach((el) => addCode(el));

  // listening in real-time to newly sent codes
  const eventSource = new EventSource('/event');
  eventSource.onmessage = async function (event) {
    const data = JSON.parse(event.data);
    addCode(data);
  };
};

// adding code to UI interface
const addCode = (el) => {
  const time = getTimeDifference(new Date(el.date).getTime());
  const code = el.code;
  const emailElement = emailElementContent(time, code);
  // if first 5 email was add, add newly on top
  if (emailList.childElementCount > 5) {
    emailList.append(emailElement);
  } else {
    emailList.prepend(emailElement);
  }
};

// creating a email message div with code and copy code to clipboard
const emailElementContent = (timeDifference, verificationCode) => {
  const div = document.createElement('div');
  div.classList.add('email-item');
  div.innerHTML = `<strong>Verification Code</strong>
     <div class="email-date">From: Adobe | ${timeDifference}</div>
     <p style="margin-top: 20px;">Code: <strong>${verificationCode}</strong></p>
     <button class="copy-btn">Copy Code</button>`;

  div.querySelector('.copy-btn').addEventListener('click', (e) => copyToClipboard(verificationCode, e.target));

  return div;
};

// Run function after DOM Content was loaded
window.addEventListener('DOMContentLoaded', getCodes);
