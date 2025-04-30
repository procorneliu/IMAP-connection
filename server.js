// IMPORTS
import './src/config/dotenv.js';
import path from 'path';
import express from 'express';
import cors from 'cors';
import imap from './src/config/imapClient.js';
import { fetchAdobeCodes, handleNewAdobeCodes } from './src/utils/readGmail.js';

// instantiating express app
const app = express();
// here are stored all connected clients
const clients = [];

// Allowing CROSS-ORIGIN requests
app.use(cors());

// for html from public to work
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// listeting to newly sent messages
imap.on('mail', async () => {
  try {
    const data = await handleNewAdobeCodes();
    const message = `data: ${JSON.stringify(data)}\n\n`;

    // sending new message to all connected clients
    for (const client of clients) {
      client.write(message);
    }
  } catch (err) {
    console.log(err);
  }
});

// request to get latest codes
app.get('/codes', async (req, res) => {
  try {
    const data = await fetchAdobeCodes();
    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
});

// request for staying always connected and listening to new events
app.get('/event', (req, res) => {
  // setting headers for an eventSource
  res.setHeader('Content-type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // add new client
  clients.push(res);

  // when a client is leaving, remove from clients[]
  req.on('close', () => {
    const index = clients.indexOf(res);
    if (index !== -1) clients.splice(index, 1);
  });
});

// starting server
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}...`);
});
