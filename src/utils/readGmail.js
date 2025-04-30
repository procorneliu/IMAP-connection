// imports
import imap from '../config/imapClient.js';
import { simpleParser } from 'mailparser';
import extractVerificationCode from './extractVerificationCode.js';

// getting latest sent codes
export function fetchAdobeCodes() {
  return new Promise((resolve, reject) => {
    const data = [];
    const parsedCount = { value: 0 };
    const searchCriteria = ['ALL', ['FROM', 'message@adobe.com']];

    imap.search(searchCriteria, (err, results) => {
      if (err || !results || !results.length) {
        return reject(err || 'No messages!');
      }

      const sortedResults = results.sort((a, b) => a - b);
      const toFetch = sortedResults.slice(-+process.env.EMAIL_NUM);

      const f = imap.fetch(toFetch, { bodies: '' });

      f.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, async (err, parsed) => {
            parsedCount.value++;

            if (!err) {
              const match = extractVerificationCode(parsed.text);
              if (match) {
                data.push({ date: parsed.date, code: match });
              }
            }

            if (parsedCount.value === toFetch.length) return resolve(data);
          });
        });
      });

      f.once('error', reject);
    });
  });
}

// Handling newly send codes
export function handleNewAdobeCodes() {
  return new Promise((resolve, reject) => {
    const searchCriteria = ['UNSEEN', ['FROM', 'message@adobe.com']];

    imap.search(searchCriteria, (err, results) => {
      if (err) {
        return reject(err);
      }

      if (!results || !results.length) {
        return resolve(null);
      }

      const latestEmailId = results[results.length - 1];
      const fetchOptons = { bodies: '', markSeen: true };
      const f = imap.fetch(latestEmailId, fetchOptons);

      f.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, (err, parsed) => {
            if (err) {
              return reject(err);
            }

            const match = extractVerificationCode(parsed.text);
            if (match) {
              return resolve({ date: parsed.date, code: match });
            } else {
              return resolve(null);
            }
          });
        });
      });

      f.once('error', reject);
    });
  });
}
