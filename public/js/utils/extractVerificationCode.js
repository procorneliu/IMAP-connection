export default function extractVerificationCode(text) {
  const match = text.match(/\b\d{4,8}\b/);
  return match ? match[0] : null;
}
