const sample = 'hello world';

const reverseStr = (str) => {
  return str ? reverseStr(str.substring(1)) + str[0] : str;
}

const res = reverseStr(sample);
console.log(res);