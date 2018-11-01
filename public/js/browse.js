/**
 * Button click
 */
function buttonClicked() {
  const file = document.getElementById('image_file').value;
  if (file != null) {
    document.getElementById('image').innerHTML = `<img src=${file}>`;
  }
  console.log(`clicked ${file}`);
}
