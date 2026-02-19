const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    const text = input.value;
    const date = dateInput.value;
    const priority = priorityInput.value;
    
    let priorityText = '';
    if (priority === '1') priorityText = '낮음';
    else if (priority === '2') priorityText = '보통';
    else if (priority === '3') priorityText = '높음';

    if (!text || !date) {
        alert('할 일과 마감 기한을 모두 입력해주세요.');
        return;
    }

    const li = document.createElement('li');
    li.classList.add(`priority-${priority}`);

    li.innerHTML = `
        <div class="todo-info">
            <span class="text"><strong>${text}</strong></span>
            <div class="todo-details">
                <span>📅 마감 기한: ${date}</span>
                <span>⭐ 중요도: ${priorityText}</span>
            </div>
        </div>
        <button class="check-btn">✔</button>
    `;

    li.querySelector('.check-btn').addEventListener('click', () => {
        li.style.opacity = '0';
        li.style.transform = 'translateX(20px)';
        li.style.transition = '0.3s';
        setTimeout(() => {
            li.remove();
        }, 300);
    });

    todoList.appendChild(li);

    input.value = '';
    dateInput.value = '';
    priorityInput.value = '1';
});
