import './src/config/dotenv.js';
import path from 'path';
import express from 'express';
import cors from 'cors';
import oauth2Client from './src/config/oauth2Client.js';
import fetchEmails from './src/utils/fetchEmails.js';

const app = express();

app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/inbox', async (req, res) => {
  try {
    // get accest token
    const { token } = await oauth2Client.getAccessToken();
    // get emails from inbox
    const inbox = await fetchEmails(token);
    // send inbox data
    res.status(200).json({
      status: 'success',
      data: {
        token,
        inbox,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
