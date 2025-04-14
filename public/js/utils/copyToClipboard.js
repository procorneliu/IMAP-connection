export default function copyToClipboard(code) {
  navigator.clipboard.writeText(code).then(() => alert('Code copied!'));
}
