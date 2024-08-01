function editNickname() {
    if (document.getElementById('nickname').value.length >0 &&  document.getElementById('nickname').value != 'Старый Никнейм') {
        // "изменить никнейм в аккаунте"
    } 
}
function editPassword() {
    password = document.getElementById('password');
    text = document.getElementById('passwordHelpStr');
    if (password.placeholder == "Старый пароль") {
        if (password.value == "Старый пароль") { // Тут надо сравнивать с паролем из базы
            password.placeholder = "Новый пароль";
            text.innerHTML = "Введите новый пароль.";
            password.value = "";
        } else {
            text.innerHTML = "Введён неверный пароль.";
        }
    } else if (password.placeholder == "Новый пароль") {
        if (ContainsInvalidCharacters(password.value)) {
            text.innerHTML = "Пароль не может содержать пробелы.";
        } else if (password.value.length<8) {
            text.innerHTML = "Пароль дожнен состоять не менее чем из 8 символов.";
        } else {
            // сохранить новый пароль в базу
            text.innerHTML = "Новый пароль сохранен.";
            password.placeholder == "Старый пароль"
            password.value = "";
        }
    }
}
function ContainsInvalidCharacters(str) {
    for (let i = 0; i < str.length; i++) {
        if (str.slice(i,i+1) == " ") {
            return true;
        }
    }
    return false;
}
function editAvatar() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        document.getElementById('avatar').src = objectUrl;
        // +сохранить новую аву
    }
}