/* eslint-disable no-unused-vars */
/**
 * Button click
 */
function buttonClicked() {
  const file = document.getElementById('image_file').value;
  if (file != null) {
    document.getElementById('image').innerHTML = `<img src="${file}>"`;
  }
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    alert('Supported');
  }
  console.log(`clicked ${file}`);
}

/**
 * Handles the file change
 * @param {Event} evt the event
 */
function handleFileSelect(evt) {
  const file = evt.target.files[0];

  // Only process image files.
  if (!file.type.match('image.*')) {
    alert('Unsupported Image File');
    document.getElementById('form').reset();
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const postData = {};
    postData.data = event.target.result;
    postData.type = file.type;

    const xhr = new XMLHttpRequest();
    const url = '/gcode';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
      } else if (xhr.readyState === 4 && xhr.status === 400) {
        alert(`Error: ${xhr.responseText}`);
        document.getElementById('image_form').reset();
      }
    };

    xhr.onerror = () => {
      console.log('error');
      alert(`Error: ${xhr.responseText}`);
    };

    xhr.onabort = () => {
      alert('aborted');
    };

    xhr.send(JSON.stringify(postData));
  };

  // Read in the image file as binary string.
  reader.readAsBinaryString(file);
}
