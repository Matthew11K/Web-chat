function autiResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight - 50 + 'px';
}

function SendMessege() {
    var text = document.getElementById('textMessege');
    if (text.value.length != 0) {
        const currentDate = new Date();
        var newMessege = '<div class="messege-text-right"><p>' + text.value.replace(/\n/g, '<br>') + '</p><p>' + currentDate.toLocaleTimeString().substring(0, 5) + '</p></div>';
        var chat = document.getElementById('main');
        var lastElement = chat.lastElementChild;
        var newElement = document.createElement('div');
        newElement.innerHTML = newMessege;
        chat.insertBefore(newElement, lastElement);
        text.value = ''; 
    }
    autiResize(text);
}

function handleAvatarClick() {
    alert('Аватар или никнейм был нажат');
}

document.getElementById('clip').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

function handleFileSelect(event) {
    var file = event.target.files[0];
    if (file) {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            const currentDate = new Date();
            var newMessege = `
                <div class="messege-file-right">
                    <div class="file-container">
                        <div class="file-icon">
                            <img src="imeges/файлик.png" alt="file icon">
                        </div>
                        <div class="file-name">
                            <a href="${fileReader.result}" download="${file.name}">${file.name}</a>
                        </div>
                    </div>
                    <p>${currentDate.toLocaleTimeString().substring(0, 5)}</p>
                </div>`;
            var chat = document.getElementById('main');
            var lastElement = chat.lastElementChild;
            var newElement = document.createElement('div');
            newElement.innerHTML = newMessege;
            chat.insertBefore(newElement, lastElement);
        };
        fileReader.readAsDataURL(file);
    }
}