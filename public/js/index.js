// utils imports
import extractEmailBody from './utils/extractEmailBody.js';
import extractVerificationCode from './utils/extractVerificationCode.js';
import getTimeDifference from './utils/getTimeDifference.js';
import copyToClipboard from './utils/copyToClipboard.js';

// Importing DOM elements
const emailList = document.getElementById('email-list');

const MAX_EMAILS = 5;
let count = 0;

async function getAdobeCodes() {
  const inboxAndToken = await fetchInboxAndToken();
  if (!inboxAndToken) return (emailList.innerHTML = '<p>Failed to authenticate.</p>');
  const { token, inbox } = inboxAndToken;

  // get message Adobe code from first 5 messages
  for (let msg of inbox.messages) {
    if (count >= MAX_EMAILS) break;

    // get message data
    const msgData = await getMessageData(msg, token);
    const messageHeaders = msgData.payload.headers;

    // check if message is from Adobe
    const fromHeader = messageHeaders.find((header) => header.name === 'From').value.split(' ')[0];
    if (fromHeader !== 'Adobe') continue;

    // get message time of sending
    const dateHeader = messageHeaders.find((header) => header.name === 'Date').value;
    const timeDifference = getTimeDifference(new Date(dateHeader));

    // convert email data into plain text
    let body = extractEmailBody(msgData);

    //extracting verification code from message body
    const verificationCode = extractVerificationCode(body);
    if (!verificationCode) continue;

    // insert code in DOM
    const emailElement = emailElementContent(timeDifference, verificationCode);
    emailList.appendChild(emailElement);

    count++;
  }
}

// creating a email message div with code and copy code to clipboard
const emailElementContent = (timeDifference, verificationCode) => {
  const div = document.createElement('div');
  div.classList.add('email-item');
  div.innerHTML = `<strong>Verification Code</strong>
     <div class="email-date">From: Adobe | ${timeDifference}</div>
     <p style="margin-top: 20px;">Verification code: <strong>${verificationCode}</strong></p>
     <button class="copy-btn">Copy Code</button>`;

  div.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(verificationCode));

  return div;
};

// fetching inbox and token data
const fetchInboxAndToken = async () => {
  const { data } = await fetch('/inbox')
    .then((res) => res.json())
    .catch((err) => {
      console.error(err.message);
    });

  return data;
};

const getMessageData = async (msg, token) => {
  const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await msgResponse.json();
};

// Run function after DOM Content was loaded
window.addEventListener('DOMContentLoaded', getAdobeCodes);
