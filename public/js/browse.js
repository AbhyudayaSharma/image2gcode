/* eslint-disable no-unused-vars */

// data to be sent as the body of the POST
const postData = {
  data: '',
  type: '',
};

// the post request
let xhr = new XMLHttpRequest();

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
    resetForm();
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
    xhr = new XMLHttpRequest();
    const url = '/gcode';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.getElementById('gcode')
            .innerHTML = xhr.responseText; // .replace(/\n/g, '<br>');
        document.getElementById('submit_btn').disabled = false;
        document.getElementById('submit_btn').innerText = 'Submit';
        document.getElementById('reset_btn').disabled = false;
        document.getElementById('gcode_container')
            .setAttribute('style', ''); // make it visible
        window.scrollTo(0, document.body.scrollHeight); // scroll to bottom
      } else if (xhr.readyState === 4 && xhr.status === 400) {
        alert(`Error: ${xhr.responseText}`);
        resetForm();
      }
    };

    xhr.onerror = () => {
      alert(`Error: ${xhr.responseText}`);
      resetForm();
    };

    xhr.onabort = () => {
      resetForm();
    };

    xhr.send(JSON.stringify(postData));
    document.getElementById('submit_btn').innerHTML =
      '<img src="/public/img/loading.gif" width="20px" height="20px" ' +
      'alt="Loading..."> Generating the GCode may take up to a minute...';
    document.getElementById('submit_btn').disabled = true;
    document.getElementById('reset_btn').disabled = true;
  } else {
    alert('Please select a file!');
  }
};

/**
 * Resets the form
 */
const resetForm = () => {
  document.getElementById('image_form').reset();
  document.getElementById('file_selector').setAttribute('value', '');
  document.getElementById('tool_diameter').setAttribute('value', '');
  document.getElementById('feed').setAttribute('value', '');
  document.getElementById('retract').setAttribute('value', '0');
  document.getElementById('gcode_container')
      .setAttribute('style', 'display: none;'); // make it invisible
  postData.data = '';
  postData.type = '';
};

/**
 * Copies the GCode from the TextArea to clipboard
 */
const copyGCodeToClipboard = () => {
  const gcode = document.getElementById('gcode');
  gcode.select();
  document.execCommand('copy');
  alert('GCode copied to clipboard!');
  gcode.selectionStart = 0;
  gcode.selectionEnd = 0;
};
