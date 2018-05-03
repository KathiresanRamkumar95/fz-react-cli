var browser = 'chrome';

var selBrowser = function(getBrowser) {
  browser = getBrowser;
  changeImage();
};
function onClick() {
  var temp = document.getElementsByClassName('mcCsel');
  if (temp.length > 0) {
    temp[0].className = 'mcC';
  }
  this.className += ' mcCsel';
  document.getElementById('origin').src = './my_ui_reference/' + this.innerText;
  document.getElementById('tested').src = './my_ui_test/' + this.innerText;
  document.getElementById('diff').src = './my_ui_diff/' + this.innerText;
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
    for (var i = list.length - 1; i >= 0; i--) {
      var div = document.createElement('div');
      div.innerHTML = list[i];
      document.getElementById(component[list[i]]).append(div);
    }
  } else {
    document.getElementById('clear').style = 'display:none';
    document.getElementById('message').innerHTML =
      'This component not used by any other files.';
  }
}

function changeImage() {
  document.getElementById('list').innerHTML = '';
  if (fileObj.diff.length > 0) {
    for (var i = fileObj.diff.length - 1; i >= 0; i--) {
      var node = document.createElement('div');
      if (fileObj.diff[i].indexOf(browser) !== -1) {
        var textnode = document.createTextNode(fileObj.diff[i]);
        node.appendChild(textnode);
        document.getElementById('list').appendChild(node).className = 'mcC';
        node.onclick = onClick;
        if (i == 0) {
          node.onclick(node);
        }
      }
    }
  } else {
    var eleList = document.getElementsByClassName('mcCheight');
    for (var i = eleList.length - 1; i >= 0; i--) {
      eleList[i].style.display = 'none';
    }
    document.getElementById('empty').style.display = 'block';
  }
}

function info(toggle) {
  var freezer = document.getElementById('freezer');
  if (freezer.style.display == 'block') {
    document.getElementById('freezer').style.display = 'none';
    document.getElementById('refer').style.display = 'none';
  } else {
    document.getElementById('freezer').style.display = 'block';
    document.getElementById('refer').style.display = 'block';
  }
}

document.onkeydown = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ('key' in evt) {
    isEscape = evt.key == 'Escape' || evt.key == 'Esc';
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    document.getElementById('freezer').style.display = 'none';
    document.getElementById('refer').style.display = 'none';
  }
};
