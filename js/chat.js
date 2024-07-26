function autiResize(textarea) {
    textarea.style.height ='auto';
    textarea.style.height = textarea.scrollHeight -50 +'px';
}
function SendMessege() {
    var text = document.getElementById('textMessege');
    if (text.value.length != 0) {
        const currentDate = new Date();
        var newMessege = '<div class="messege-text-right"><p>' + text.value.replace(/\n/g, '<br>') + '</p><p>' + currentDate.toLocaleTimeString().substring(0,5) + '</p></div>';
        var chat = document.getElementById('main');
        var lastElement = chat.lastElementChild;

        var newElement = document.createElement('div');
        newElement.innerHTML = newMessege;

        chat.insertBefore(newElement, lastElement);
        text.value = ''; 
    }
    
    autiResize(text);

    window.scrollTo({
        top: document.body.scrollWidth,
        behavior: 'smooth'
    });
       
}


