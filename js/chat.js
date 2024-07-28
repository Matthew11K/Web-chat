function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight - 50) + 'px';
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadMessages();
    setInterval(loadMessages, 5000);
});

async function loadMessages() {
    try {
        const response = await fetch('/messages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const messages = await response.json();
            const chat = document.getElementById('main');
            chat.innerHTML = '';

            messages.forEach(msg => {
                var newElement = document.createElement('div');
                newElement.className = (msg.user_id == localStorage.getItem('user_id')) ? 'messege-text-right' : 'messege-text-left';
                newElement.innerHTML = `<p>${msg.content.replace(/\n/g, '<br>')}</p><p>${new Date(msg.datetime).toLocaleTimeString().substring(0, 5)}</p>`;
                chat.appendChild(newElement);
            });

            chat.scrollTop = chat.scrollHeight;
        } else {
            console.error('Ошибка загрузки сообщений:', response.statusText);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function SendMessage() {
    var text = document.getElementById('textMessege');
    if (text.value.length != 0) {
        const currentDate = new Date();
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        if (isNaN(userId)) {
            console.error('User ID is missing or invalid in localStorage');
            return;
        }

        const newMessage = {
            user_id: userId,
            content: text.value,
            datetime: currentDate.toISOString()
        };

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newMessage)
            });

            if (response.ok) {
                text.value = '';
                autoResize(text);
                loadMessages();
            } else {
                console.error('Ошибка отправки сообщения:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
}


