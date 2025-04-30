// Copy code to clipboard
export default function copyToClipboard(code, button) {
  navigator.clipboard.writeText(code).then(() => {
    // change styles when button is clicked
    button.innerText = 'Copied!';
    button.style.backgroundColor = '#17a110';
    button.disabled = true;

    // after 0.5sec. change how it was
    setTimeout(() => {
      button.innerText = 'Copy Code';
      button.style.backgroundColor = '#007BFF';
      button.disabled = false;
    }, 500);
  });
}
