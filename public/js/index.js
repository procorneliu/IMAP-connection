// utils imports
import extractEmailBody from './utils/extractEmailBody.js';
import extractVerificationCode from './utils/extractVerificationCode.js';
import getTimeDifference from './utils/getTimeDifference.js';
import copyToClipboard from './utils/copyToClipboard.js';

// Importing DOM elements
const emailList = document.getElementById('email-list');

async function fetchEmails() {
  // const token = await fetch('/token').then((res) => res.json());
  // if (!token) {
  //   emailList.innerHTML = '<p>Failed to authenticate.</p>';
  //   return;
  // }

  // const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
  //   headers: { Authorization: `Bearer ${token}` },
  // });
  // const data = await response.json();
  // if (!data) {
  //   return (emailList.innerHTML = '<p>No verification codes found.</p>');
  // }
  const { data } = await fetch('/inbox')
    .then((res) => res.json())
    .catch((err) => {
      emailList.innerHTML = '<p>Failed to authenticate.</p>';
      console.log(err.message);
    });
  const { token, inbox } = data;

  let count = 0;
  const MAX_EMAILS = 5;

  for (let msg of inbox.messages) {
    if (count >= MAX_EMAILS) break;

    const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const msgData = await msgResponse.json();
    console.log(msgData);

    const from = msgData.payload.headers.find((h) => h.name === 'From')?.value || 'Unknown Sender';
    const dateHeader = msgData.payload.headers.find((h) => h.name === 'Date')?.value || '';

    const timeDifference = getTimeDifference(new Date(dateHeader));

    let body = extractEmailBody(msgData);

    const verificationCode = extractVerificationCode(body);
    if (!verificationCode) continue;

    const emailDiv = document.createElement('div');
    emailDiv.classList.add('email-item');

    emailDiv.innerHTML = elementListContent(from, timeDifference, verificationCode);

    emailDiv.querySelector('.copy-btn').addEventListener('click', () => copyToClipboard(verificationCode));

    emailList.appendChild(emailDiv);

    count++;
  }
}

const elementListContent = (from, timeDifference, verificationCode) => {
  return `<strong>Verification Code</strong>
     <div class="email-date">From: ${from} | ${timeDifference}</div>
     <p style="margin-top: 20px;">Verification code: <strong>${verificationCode}</strong></p>
     <button class="copy-btn">Copy Code</button>`;
};

window.onload = fetchEmails;
