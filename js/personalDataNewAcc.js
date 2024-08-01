document.getElementById("regist-form").addEventListener("submit", checkForm)
function checkForm(event) {
    event.preventDefault();
    var form = document.getElementById("regist-form");

    var Surname = form.Surname.value;
    var Name = form.Name.value;
    var NickName = form.NickName.value;
    var password1 = form.password1.value;
    var password2 = form.password2.value;
    
    var fail = "";
    if (Surname.length < 2) {
        fail = "Фамилия дожна состоять не менее чем из 2 символов."
    } else if (Name.length < 2) {
        fail = "Имя дожно состоять не менее чем из 2 символов."
    } else if (ContainsInvalidCharacters(Surname) || ContainsInvalidCharacters(Name)) {
        fail = "Имя и фамилия могут состоять только из латиницы и кириллицы."
    } else if (NickName.length < 1) {
        fail = "Никнейм дожнен состоять не менее чем из 1 символа."
    } else if (password1.length < 8) {
        fail = "Пароль дожнен состоять не менее чем из 8 символов."
    } else if (password1 != password2) {
        fail = "Пароли не совпадают."
    } 
    
    
    if (fail != "") {
        document.getElementById("error").innerHTML = fail;
    } else {
        // window.location="ссылка" - переносит на другой сайт, но поставь return false
    }
}

function ContainsInvalidCharacters(str) {
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (!((charCode >= 1040 && charCode <= 1103)||(charCode >= 65 && charCode <= 90)||(charCode >= 97 && charCode <= 122))) {
            return true;
        }
    }
    return false;
  }