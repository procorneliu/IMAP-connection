// import googleapis package for oauth2 auth
import { google } from 'googleapis';

// Create OAUTH2 CLIENT
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

// Use the REFRESH TOKEN for generating new access tokens
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export default oauth2Client;
