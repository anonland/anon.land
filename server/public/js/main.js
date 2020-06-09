//global vars..
const registerBTN = document.getElementById('registerBTN');


// modal..
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal');
  let instances = M.Modal.init(elems);
});

// Evento del boton de registro
registerBTN.addEventListener("click", function () {
  const newPassword = document.getElementById('newPassword');
  register(newPassword.value);
})

// funcion de login PENDIENTE
function login(usrID, password) { }

// funcion de registro
function register(password) {


  let PW = { newPW: password }

  // http request..
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.addEventListener("load", function () {
    if (this.status == 200) {
      // Respuesta de la request
    }
  });

  xmlhttp.open("POST", "url", true);

  xmlhttp.send(JSON.stringify(PW));
  console.log(PW);
}
