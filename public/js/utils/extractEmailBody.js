function decodeBase64(encoded) {
  // replace on encoded is converting base64ulr format into base64-encoded string
  // atob is decoding base64-encoded string into plain text
  return atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
}

export default function extractEmailBody(msgData) {
  if (msgData.payload.body?.data) {
    return decodeBase64(msgData.payload.body.data);
  } else if (msgData.payload.parts) {
    for (const part of msgData.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
  }
  return '';
}
