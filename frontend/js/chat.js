function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight - 50) + 'px';
}

console.log('Chat.js script is loaded and running');

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('Document loaded, initializing chat...');

    // Проверим, загружены ли нужные элементы
    const clipElement = document.getElementById('clip');
    const fileInputElement = document.getElementById('fileInput');
    const sendButton = document.getElementById('Send');
    const textMessageElement = document.getElementById('textMessege');
    const chatElement = document.getElementById('main');

    if (!clipElement || !fileInputElement || !sendButton || !textMessageElement || !chatElement) {
        console.error('One or more elements are missing in the DOM');
        return;
    }

    loadMessages();
    setInterval(loadMessages, 5000); // Автоматическая загрузка сообщений каждые 5 секунд
});

// Функция загрузки сообщений
async function loadMessages() {
    console.log('Loading messages...');
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        const response = await fetch('/messages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Используем токен для аутентификации
            }
        });

        if (response.ok) {
            const messages = await response.json();
            const chat = document.getElementById('main');
            chat.innerHTML = ''; // Очищаем чат перед добавлением новых сообщений

            messages.forEach(msg => {
                var newElement = document.createElement('div');
                newElement.className = (msg.user_id == localStorage.getItem('user_id')) ? 'messege-text-right' : 'messege-text-left';
                newElement.innerHTML = `<p>${msg.content.replace(/\n/g, '<br>')}</p><p>${new Date(msg.datetime).toLocaleTimeString().substring(0, 5)}</p>`;
                chat.appendChild(newElement);
            });

            chat.scrollTop = chat.scrollHeight; // Прокрутка к последнему сообщению
        } else {
            console.error('Ошибка загрузки сообщений:', response.statusText);
        }
    } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
    }
}

// Функция отправки текстового сообщения
async function SendMessage() {
    const text = document.getElementById('textMessege');
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        console.error('User ID or token is missing');
        return;
    }

    if (text.value.length != 0) {
        const currentDate = new Date();
        const newMessage = {
            user_id: parseInt(userId, 10),
            content: text.value,
            datetime: currentDate.toISOString()
        };

        console.log('Sending message:', newMessage);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Используем токен для аутентификации
                },
                body: JSON.stringify(newMessage)
            });

            if (response.ok) {
                console.log('Message sent successfully');
                text.value = ''; // Очищаем поле ввода после отправки сообщения
                autoResize(text); // Перерасчет высоты поля
                loadMessages(); // Обновляем чат
                window.scrollTo({ // Прокрутка к последнему сообщению
                    top: document.body.scrollWidth,
                    behavior: 'smooth'
                });
            } else {
                console.error('Ошибка отправки сообщения:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    }
}

// Обработка клика по значку "скрепка"
document.getElementById('clip').addEventListener('click', function () {
    console.log('Clip icon clicked');
    var fileInput = document.getElementById('fileInput');
    if (fileInput) {
        console.log('Opening file input dialog');
        fileInput.click(); // Открываем диалог выбора файла
    } else {
        console.error('File input element not found');
    }
});

// Обработка выбора файла
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
    var file = event.target.files[0];
    if (file) {
        console.log('File selected:', file.name);
        const formData = new FormData();
        formData.append('file', file); // Добавляем файл в форму для отправки

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Используем токен для аутентификации
                },
                body: formData // Отправляем файл на сервер
            });

            if (response.ok) {
                const data = await response.json();
                const filePath = data.filePath;
                console.log('File uploaded successfully:', filePath);

                const currentDate = new Date();
                var newMessege = `
                    <div class="messege-file-right">
                        <div class="file-container">
                            <div class="file-icon">
                                <img src="imeges/файлик.png" alt="file icon">
                            </div>
                            <div class="file-name">
                                <a href="${filePath}" download="${file.name}">${file.name}</a>
                            </div>
                        </div>
                        <p>${currentDate.toLocaleTimeString().substring(0, 5)}</p>
                    </div>`;

                var chat = document.getElementById('main');
                var newElement = document.createElement('div');
                newElement.innerHTML = newMessege;
                chat.appendChild(newElement);

                chat.scrollTop = chat.scrollHeight; // Прокручиваем чат к новому сообщению
            } else {
                console.error('Ошибка загрузки файла:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
        }
    } else {
        console.error('No file selected');
    }
}
