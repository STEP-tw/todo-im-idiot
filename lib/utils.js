const getFileData = (fs, file, encoding) => {
  if (encoding) return fs.readFileSync(file, encoding);
  return fs.readFileSync(file);
}
const parseData = (data) => {
  data = data.replace(/\+/g, " ");
  return decodeURIComponent(data);
};
const getFileType = (url) => {
  return url.slice(url.lastIndexOf('.') + 1);
}
const getMIMEType = (url) => {
  let fileType = getFileType(url);
  let MIMEs = {
    'gif': 'image/gif',
    'jpg': 'image/jpg',
    'png': 'image/png',
    'ico': 'image/ico',
    'html': 'text/html',
    '/public/': 'text/html',
    'css': 'text/css',
    'pdf': 'application/pdf',
    'js': 'text/javascript'
  };
  return MIMEs[fileType];
};
const getDateAndTime = () => {
  let date = new Date();
  date = date.toString().split(' ');
  return date;
};

const getDateAndTimeInArray = () => {
  let dateAndTime = getDateAndTime();
  let time = dateAndTime[4];
  let day = dateAndTime[2];
  let month = dateAndTime[1];
  let year = dateAndTime[3];
  return `[ ${day}/${month}/${year} ${time} ]`;
};
const getGETRequests = (url) => `${getDateAndTimeInArray()} GET  ${url}`;
const getPOSTRequests = (url) => `${getDateAndTimeInArray()} POST ${url}`;
const writeAndTerminate = function(res, data) {
  res.write(data);
  res.end();
}
const toS = (object) => JSON.stringify(object, null, 2);
const getTodosInfoInBlocks = (todoData) => {
  let block = "";
  let title = "";
  todoData.forEach((element) => {
    title = toS(element.title);
    block += `<div onclick=openTodo(${title})><h2>${element.title}</h2>`;
    block += `<p>${element.description}</p></div>`;
  });
  return block;
}
const getTodoinBlock = (todo) => {
  let block = `<div><label id="date">${todo.date}</label><br />`;
  block+=`<input type=text value=${todo.title} id='title'><br />`;
  block += `<textarea rows=5 cols=40 id='description'>${todo.description}</textarea><br />`
  let item=todo.item1;
  let i=2;
  while(item){
    block += `<input type=text value=${item} id=item${i-1}><br />`
    item=todo[`item${i}`];
    i++;
  }
  block+="<input type='submit' onclick=sendDataToServer()></div>"
  return block;
}
const getTodoinReadOnlyBlock = (todo) => {
  let block = `<div><label id="date">${todo.date}</label><br />`;
  block+=`<input type=text value=${todo.title} id='title' readonly><br />`;
  block += `<textarea rows=5 cols=40 id='description' readonly>${todo.description}</textarea><br />`
  let item=todo.item1;
  let i=2;
  while(item){
    block += `<input type=text value=${item} id=item${i-1} readonly><br />`
    item=todo[`item${i}`];
    i++;
  }
  block+="</div>";
  return block;
}
const getRequestedFileData = function(fs, url, res) {
  console.log(getGETRequests(url));
  let fileName = `./public${url}`;
  res.setHeader('Content-Type', getMIMEType(url));
  return getFileData(fs, fileName, 'utf8');
}
exports.toS = toS;
exports.getTodosInfoInBlocks = getTodosInfoInBlocks;
exports.getTodoinBlock = getTodoinBlock;
exports.getTodoinReadOnlyBlock = getTodoinReadOnlyBlock;
exports.getGETRequests = getGETRequests;
exports.getPOSTRequests = getPOSTRequests;
exports.getRequestedFileData = getRequestedFileData;
exports.getFileData = getFileData;
exports.writeAndTerminate = writeAndTerminate;
exports.getDateAndTime = getDateAndTime;
exports.getDateAndTimeInArray = getDateAndTimeInArray;
exports.getMIMEType = getMIMEType;
exports.parseData = parseData;
