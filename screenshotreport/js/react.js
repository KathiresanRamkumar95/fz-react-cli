function changeImage() {
  for (var i = fileObj.diff.length - 1; i >= 0; i--) {
    var node = document.createElement('div');
    var textnode = document.createTextNode(fileObj.diff[i]);
    node.appendChild(textnode);
    document.getElementById('list').appendChild(node).className = 'mcC';
    node.onclick = function() {
      var temp = document.getElementsByClassName('mcCsel');
      if (temp.length > 0) {
        temp[0].className = 'mcC';
      }
      this.className += ' mcCsel';
      document.getElementById('origin').src =
        './my_ui_reference/' + this.innerText;
      document.getElementById('tested').src = './my_ui_test/' + this.innerText;
      document.getElementById('diff').src = './my_ui_diff/' + this.innerText;
    };

    if (i == 0) {
      node.onclick(node);
    }
  }
}
