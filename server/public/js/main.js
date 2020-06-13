//global vars..
const registerBTN = document.getElementById('registerBTN');
const registerForm = document.getElementById('register');

// modal..
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal');
  let instances = M.Modal.init(elems);
});
console.log(registerForm);
// Evento del boton de registro
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newPassword = document.getElementById('newPassword');
 register(newPassword.value);
})

// funcion de login PENDIENTE
function login(user, password) { }

// funcion de registro
function register(password) {


  let PW = { newPW: password }

  // http request..
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.addEventListener("load", function () {
    if (this.status == 200) {
      // Respuesta de la request BACKEND ACA xmlhttp.responseText
      let response = JSON.parse(xmlhttp.responseText);
      console.log(response);
      //window.location.href = response.redirect;
    }
  });

  xmlhttp.open("POST", "/register", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(PW));
  console.log(PW);
}
