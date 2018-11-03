/* eslint-disable no-unused-vars */

// data to be sent as the body of the POST
const postData = {
  data: '',
  type: '',
};

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

  // do nothing if no file is selected
  if (file == null) {
    postData.type = '';
    postData.type = '';
    return;
  }

  // only allow images
  if (!file.type.match('image.*')) {
    alert('Unsupported Image File');
    document.getElementById('form').reset();
    postData.type = '';
    postData.data = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    postData.data = event.target.result;
    postData.type = file.type;
  };

  // Read in the image file as binary string.
  reader.readAsBinaryString(file);
}

/**
 * Handle the submission of the form
 */
const submitForm = () => {
  if (postData.data.length && postData.type.length) {
    console.log(postData.data.length, postData.type.length);
    const xhr = new XMLHttpRequest();
    const url = '/gcode';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.getElementById('gcode')
            .innerHTML = xhr.responseText.replace(/\n/g, '<br>');
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
  } else {
    alert('Please select a file!');
  }
};