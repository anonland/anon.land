let commentBTN = document.getElementById('commentbtn');
let Section = document.getElementById('Section').value;
let postid = document.getElementById('postid').value;
// function for comment..
function comment(commentTXT, date) {
    let commentDate = new Date();
    let commentData = {
        commentTXT,
        commentDate: date
    }

    // http request..
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.addEventListener("load", function () {
        if (this.status == 200) {
            // Respuesta de la request BACKEND ACA
            let response = JSON.parse(xmlhttp.responseText);
        }
    });



    xmlhttp.open("POST", `/exp/${Section}/${postid}`, true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(commentData));

}

commentBTN.addEventListener('click', ()=>{
    let commentTXT = document.getElementById('commentTXT').value;
    let commentDate = new Date();

    if(commentTXT == "" || commentTXT == " "){
        alert("el texto de la publicación está vacío");
        return false;
    } else{
        comment(commentTXT, commentDate)
    }

});