function hashChange(url) {
  return new Promise(function(res, rej) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        res(xhttp.responseText);
        //document.getElementById('html').innerHTML = xhttp.responseText;
      } else {
        //rej(xhttp);
      }
    };
    xhttp.open('GET', '/api/html?url=' + url, true);
    xhttp.send();
  });
}
if (window.HashChangeEvent) {
  window.addEventListener('hashchange', function() {
    hashChange(location.hash.slice(1))
      .then(res => {
        console.log(res);
        var iframe = document.getElementById('ifm');
        var frameDoc = iframe.document;
        if (iframe.contentWindow) {
          frameDoc = iframe.contentWindow.document;
          frameDoc.open();
          frameDoc.writeln(res);
          frameDoc.close();
        } else {
          console.log('error');
        }
      })
      .catch(e => {
        console.log(e);
      });
  });
}
hashChange(location.hash.slice(1))
  .then(res => {
    var iframe = document.getElementById('ifm');
    var frameDoc = iframe.document;
    if (iframe.contentWindow) {
      frameDoc = iframe.contentWindow.document;
      frameDoc.open();
      frameDoc.writeln(res);
      frameDoc.close();
    } else {
      console.log('error');
    }
  })
  .catch(e => console.log(e));
