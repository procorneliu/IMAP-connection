function decodeBase64(encoded) {
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
