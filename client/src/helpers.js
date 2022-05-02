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