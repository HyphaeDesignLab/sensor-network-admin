export const humanReadableTitle = (s) => {
  let str = s.split('');
  let nextCap = false;
  for (let i = 0; i < str.length; i++) {
    if(i === 0 || nextCap) {
      str[i] = str[i].toUpperCase();
      nextCap = false;
    }
    if (str[i] === '.' || str[i] === '_' || str[i] === '-') {
      str[i] = ' ';
      nextCap = true;
    }
  }
  return str.join('');
}

export const saveDataAsFile = (filename, data) => {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data)], { type: "text/json" });
  const link = document.createElement("a");

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

  const evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(evt);
  link.remove()
};