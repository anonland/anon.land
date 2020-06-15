//global vars..
const registerBTN = document.getElementById('registerBTN');
const registerForm = document.getElementById('register');
const loginForm = document.getElementById('login');
const loginBTN = document.getElementById('loginBTN');


// modal..
document.addEventListener('DOMContentLoaded', function () {
  let elems = document.querySelectorAll('.modal');
  let instances = M.Modal.init(elems);
});


// Register event listener..
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const newPassword = document.getElementById('newPassword');
  register(newPassword.value);
})


// Login event listener..
loginForm.addEventListener("submit", function (event) {
  console.log(loginForm);
  event.preventDefault();
  const userid = document.getElementById('userid');
  const password = document.getElementById('password');
  login(userid.value, password.value);
});


// login function..
function login(userid, password) {

  let userData = { userid, password };

  // http request..
  let xmlhttp = new XMLHttpRequest();

  xmlhttp.addEventListener('load', function () {

    if (this.status == 200) {
      // response of the backend  goes here
      let response = JSON.parse(xmlhttp.responseText);
      console.log(response);
      windows.location.href = response.redirect;
    }
  });

  xmlhttp.open('POST', '/login', true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(userData));
}


// register function..
function register(password) {


  let PW = { newPW: password }

  // http request..
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.addEventListener("load", function () {
    if (this.status == 200) {
      // Respuesta de la request BACKEND ACA xmlhttp.responseText
      console.log("respuesta ", xmlhttp.responseText);
      let response = JSON.parse(xmlhttp.responseText);
      window.location.href = response.redirect;
    }
  });

  xmlhttp.open("POST", "/register", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(JSON.stringify(PW));
}
