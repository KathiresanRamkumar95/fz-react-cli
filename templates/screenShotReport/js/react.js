let browser = 'chrome';

let selBrowser = function (getBrowser) {
  browser = getBrowser;
  changeImage();
};
function onClick () {
  let temp = document.getElementsByClassName('mcCsel');
  if (temp.length > 0) {
    temp[0].className = 'mcC';
  }
  this.className += ' mcCsel';
  document.getElementById('origin').src = `./my_ui_reference/${  this.innerText}`;
  document.getElementById('tested').src = `./my_ui_test/${  this.innerText}`;
  document.getElementById('diff').src = `./my_ui_diff/${  this.innerText}`;
  var name = document
    .getElementsByClassName('mcCsel')[0]
    .innerText.split('.')[0];
  if (name.indexOf('__') !== -1) {
    var name = name.split('__')[1];
    var list = mdata[name].referencedby;
  } else {
    var list = mdata[name].referencedby;
  }
  if (!list.length == 0) {
    document.getElementById('message').innerHTML = '';
    document.getElementById('Global').innerHTML = '';
    document.getElementById('Atom').innerHTML = '';
    document.getElementById('Molecule').innerHTML = '';
    document.getElementById('Template').innerHTML = '';
    document.getElementById('Organism').innerHTML = '';
    document.getElementById('Page').innerHTML = '';
    document.getElementById('clear').style = 'display:block';
    for (let i = list.length - 1; i >= 0; i--) {
      let div = document.createElement('div');
      div.innerHTML = list[i];
      document.getElementById(component[list[i]]).append(div);
    }
  } else {
    document.getElementById('clear').style = 'display:none';
    document.getElementById('message').innerHTML =
      'This component not used by any other files.';
  }
}

function changeImage () {
  document.getElementById('list').innerHTML = '';
  if (fileObj.diff.length > 0) {
    for (var i = fileObj.diff.length - 1; i >= 0; i--) {
      let node = document.createElement('div');
      if (fileObj.diff[i].indexOf(browser) !== -1) {
        let textnode = document.createTextNode(fileObj.diff[i]);
        node.appendChild(textnode);
        document.getElementById('list').appendChild(node).className = 'mcC';
        node.onclick = onClick;
        if (i == 0) {
          node.onclick(node);
        }
      }
    }
  } else {
    let eleList = document.getElementsByClassName('mcCheight');
    for (var i = eleList.length - 1; i >= 0; i--) {
      eleList[i].style.display = 'none';
    }
    document.getElementById('empty').style.display = 'block';
  }
}
