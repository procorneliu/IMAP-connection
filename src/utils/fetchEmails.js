// Get all emails from inbox using access token
export default async function fetchEmails(token) {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}
