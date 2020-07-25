// ids..
const postForm = document.getElementById('postForm');
const publishBTN = document.getElementById('publishBTN');

// navbar..
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.dropdown-trigger');
  let instances = M.Dropdown.init(elems);
});

// Modal upload btn..
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal');
  let instances = M.Modal.init(elems);
});

document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
});


function publishForm(mediaFile, postTXT, section, date) {
  let postDate = new Date();
  let formData = {
    postDate: date,
    imgFile: mediaFile,
    TXT: postTXT,
    Section: section
  }
  // http request..
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.addEventListener("load", function () {
    if (this.status == 200) {
      // Respuesta de la request BACKEND ACA
      let response = JSON.parse(xmlhttp.responseText);
    }
  });



  xmlhttp.open("POST", "/exp", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(formData));

}
// event listener click function..
publishBTN.addEventListener('click', function () {

  const mediaFile = document.getElementById('mediaFile').value;
  const postTXT = document.getElementById('postTXT').value;
  const section = document.getElementById('section').value;
  let date = new Date()

 // let date = date.now();
  if(postTXT == "" || postTXT.length<=5){
    alert("el texto de la publicación está vacío, o es muy corto");
    return false;
  }else{
    console.log('acá esta la fecha! ' + date);
  publishForm(mediaFile, postTXT, section, date);
// hacer una especie de request que si se publicó que me redirija al post..
}
});

