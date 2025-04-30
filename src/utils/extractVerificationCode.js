export default function extractVerificationCode(text) {
  const match = text.match(/\b\d{6}\b/);
  return match ? match[0] : null;
}
