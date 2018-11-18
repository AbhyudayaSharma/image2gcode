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
    postData.data = '';
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
    let options = null;
    try {
      options = validateAndGetOptions();
    } catch (e) {
      alert(e);
      return;
    }

    postData.options = options;
    xhr = new XMLHttpRequest();
    const url = '/gcode';
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
      delete postData.options; // delete options when not needed.
      if (xhr.readyState === 4 && xhr.status === 200) {
        document.getElementById('gcode')
            .innerHTML = xhr.responseText; // .replace(/\n/g, '<br>');
        document.getElementById('submit_btn').disabled = false;
        document.getElementById('submit_btn').innerText = 'Submit';
        document.getElementById('reset_btn').disabled = false;
        document.getElementById('gcode_container')
            .setAttribute('style', ''); // make it visible
        window.scrollTo(0, document.body.scrollHeight); // scroll to bottom
        const gcode = document.getElementById('gcode').value;
        const fileURL = makeTextFile(gcode.replace(/\n/g, '\r\n')); // CRLF
        document.getElementById('download_btn').setAttribute('href', fileURL);
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
      '<img src="/public/img/loading.gif" class="loading"' +
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
  document.getElementById('tool_diameter').setAttribute('value', '1');
  document.getElementById('feed').setAttribute('value', '50');
  document.getElementById('retract').setAttribute('value', '0');
  document.getElementById('gcode_container')
      .setAttribute('style', 'display: none;'); // make it invisible
  document.getElementById('max_size').setAttribute('value', '0');
  postData.data = '';
  postData.type = '';
  document.getElementById('submit_btn').disabled = false;
  document.getElementById('submit_btn').innerText = 'Submit';
  document.getElementById('reset_btn').disabled = false;
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

/**
 * Validates the form input
 * @return {any} an object containing the verified data
 * @throws {Error} if the data is not valid.
 */
const validateAndGetOptions = () => {
  const options = {};
  let toolDiameter = document.getElementById('tool_diameter').value;
  toolDiameter = parseInt(Number(toolDiameter), 10);
  let feed = document.getElementById('feed').value;
  feed = parseInt(Number(feed), 10);
  let retract = document.getElementById('retract').value;
  retract = parseInt(Number(retract), 10);

  // Mandatory
  if (toolDiameter !== NaN && toolDiameter > 0 && toolDiameter <= 8) {
    options.toolDiameter = toolDiameter;
  } else {
    throw new Error('Tool Diameter should be an integer between 1 and 8');
  }

  // Not mandatory
  if (feed !== NaN && feed > 0 && feed <= 100) {
    options.feed = feed;
  } else throw new Error('Feed should be an integer between 1 and 100');

  if (retract != NaN && retract >= 0 && retract <= 100) {
    options.retract = retract;
  } else throw new Error('Retract should be an integer between 0 and 100');

  const size = Number(document.getElementById('max_size').value);
  if (size === 1) {
    options.width = 210;
    options.height = 297;
  } else if (size === 2) {
    options.width = 210;
    options.height = 148;
  }

  console.log(options);

  return options;
};

let textFile = null;

/**
 * Creates a file on the current GCode
 * @param {String} text the text to be written to the file
 * @return {String} URL to the file created.
 */
const makeTextFile = (text) => {
  const data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);
  return textFile;
};
