function selectedCountry(country) {
    var phone = document.getElementById("phone");
    switch(country.value) {
        case "Россия":
            phone.value = "+7";
            break;
        case "Беларусь":
            phone.value = "+375";
            break;
        case "Китай":
            phone.value = "+86";
            break;
    }
}

document.getElementById("regist-form").addEventListener("submit", checkForm)
function checkForm(event) {
    event.preventDefault();
    var form = document.getElementById("regist-form");

    var Country = form.Country.value;
    var phone = form.phone.value.split("").filter(char => char !== " ").join("");
    
    var fail = "";
    if (Country == "Россия" && (phone.length != 12 || phone.substring(0,2) != "+7")) {
        fail = "Некорректный номер телефона.";
    } else if (Country == "Беларусь" && (phone.length != 13 || phone.substring(0,4) != "+375")) {
        fail = "Некорректный номер телефона.";
    } else if (Country == "Китай" && (phone.length != 14 || phone.substring(0,3) != "+86")) {
        fail = "Некорректный номер телефона.";
    } else {
        phoneNum = phone.substring(1, phone.length);
        if (isNaN(phoneNum) || isNaN(parseFloat(phoneNum))) {
            fail = "Некорректный номер телефона.";
        }
    }
    
    
    if (fail != "") {
        document.getElementById("error").innerHTML = fail;
    } else {
        // window.location="ссылка" - переносит на другой сайт, но поставь return false
    }
}