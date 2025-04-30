import Imap from 'imap';

// imap client
const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
});

// when client is ready open inbox
imap.once('ready', () => {
  imap.openBox('INBOX', true, (err, box) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Inbox 📥 opened to receive emails.');
    }
  });
});

// on errors
imap.once('error', (err) => console.log(err));
// start imap connection
imap.connect();

export default imap;
