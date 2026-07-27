window.addEventListener('error', function(e) {
  document.body.innerHTML = '<div style="color:red; background:white; padding: 20px; z-index:9999; position:absolute; top:0; left:0; width:100%; height:100%;">' + e.message + '<br>' + e.filename + ':' + e.lineno + '</div>';
});
