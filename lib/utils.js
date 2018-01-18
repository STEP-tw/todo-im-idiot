let getTodosInfoInBlocks = {};
getTodosInfoInBlocks['/editTodos.html'] = (todoData) => {
  let block = title = "";
  todoData.forEach((element) => {
    title = utils.toS(element.title);
    block += `<div class="todos" onclick=editTodo(${title})><h2>Title:  ${element.title}</h2>`;
    block += `<h4>Description:</h4><p>${element.description}</p></div>`;
  });
  return block;
}
getTodosInfoInBlocks['/viewTodos.html'] = (todoData) => {
  let block = title = "";
  todoData.forEach((element) => {
    title = utils.toS(element.title);
    block += `<div class="todos" onclick=ViewTodo(${title})><h2>Title:  ${element.title}</h2>`;
    block += `<h4>Description:</h4><p>${element.description}</p></div>`;
  });
  return block;
}
getTodosInfoInBlocks['/deleteTodos.html'] = (todoData) => {
  let block = title = "";
  todoData.forEach((element) => {
    title = utils.toS(element.title);
    block += `<div class="todos" onclick=RemoveTodo(${title})><h2>Title:  ${element.title}</h2>`;
    block += `<h4>Description:</h4><p>${element.description}</p></div>`;
  });
  return block;
}
let utils = {};
utils.getFileData = (fs, file, encoding) => {
  let fileContent = '';
  if (encoding) {
    return fs.readFileSync(file, encoding);
  }
  return fs.readFileSync(file);
}
utils.parseData = (data) => {
  data = data.replace(/\+/g, " ");
  return decodeURIComponent(data);
};
utils.getFileType = (url) => {
  return url.slice(url.lastIndexOf('.') + 1);
}
utils.getMIMEType = (url) => {
  let fileType = utils.getFileType(url);
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
utils.getDateAndTime = () => {
  let date = new Date();
  date = date.toString().split(' ');
  return date;
};

utils.getDateAndTimeInArray = () => {
  let dateAndTime = utils.getDateAndTime();
  let time = dateAndTime[4];
  let day = dateAndTime[2];
  let month = dateAndTime[1];
  let year = dateAndTime[3];
  return `[ ${day}/${month}/${year} ${time} ]`;
};
utils.getGETRequests = (url) => `${utils.getDateAndTimeInArray()} GET  ${url}`;
utils.getPOSTRequests = (url) => `${utils.getDateAndTimeInArray()} POST ${url}`;
utils.writeAndTerminate = function(res, data) {
  res.write(data);
  res.end();
}
utils.toS = (object) => JSON.stringify(object, null, 2);
utils.getTodoinBlock = (todo) => {
  let block = `<div id="itemsBlock"><label id="date">${todo.date}</label><br />`;
  block += `<input type=text value=${todo.title} id='title'><br />`;
  block += `<textarea rows=5 cols=40 id='description'>${todo.description}</textarea><br />`
  let item = todo.item1;
  let i = 2;
  while (item) {
    block += `<input type=text value=${item} id=item${i-1}><br />`
    item = todo[`item${i}`];
    i++;
  }
  // block += `<input type=submit value="✚ ADD ITEM" onclick="addTextBox("itemsBlock")"><br />`;
  block += "<input type='submit' onclick=sendDataToServer()></div>"
  return block;
}
utils.getTodoinReadOnlyBlock = (todo) => {
  let block = `<div id="itemsBlock"><label id="date">${todo.date}</label><br />`;
  block += `<input type=text value=${todo.title} id='title' readonly><br />`;
  block += `<textarea rows=5 cols=40 id='description' readonly>${todo.description}</textarea><br />`
  let item = todo.item1;
  let i = 2;
  while (item) {
    block += `<input type=text value=${item} id=item${i-1} readonly><br />`
    item = todo[`item${i}`];
    i++;
  }
  block += "</div>";
  return block;
}
utils.getRequestedFileData = function(fs, url, res, encoding) {
  let fileName = `./public${url}`;
  res.setHeader('Content-Type', utils.getMIMEType(url));
  if (encoding) return utils.getFileData(fs, fileName, encoding);
  return utils.getFileData(fs, fileName);
}
utils.sendRequestedFile = function(fs, url, res, encoding) {
  let fileName = `./public${url}`;
  res.setHeader('Content-Type', utils.getMIMEType(url));
  if (encoding) {
    fs.readFile(fileName, encoding, (err, data) => {
      if (err) throw err;
      res.write(data);
      res.end();
    });
    return;
  }
  fs.readFile(fileName, (err, data) => {
    if (err) throw err;
    if (!res.finished) {
      res.write(data);
      res.end();
    }
  });
  return;
}
utils.getTodosInfoInBlocks = getTodosInfoInBlocks;
module.exports = utils;
