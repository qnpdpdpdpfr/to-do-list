const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

function getDDay(targetDate) {
    if (!targetDate) return "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);
    
    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "D-Day";
    return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;
}

addBtn.addEventListener('click', () => {
    const text = input.value;
    const dateValue = dateInput.value;
    const priority = priorityInput.value;
    const dDayText = getDDay(dateValue);

    if (!text) {
        alert('할 일을 입력해주세요.');
        return;
    }

    const li = document.createElement('li');
    li.className = `priority-${priority}`;
    li.draggable = true;

    li.innerHTML = `
        <div class="handle">≡</div>
        <input type="checkbox" class="checkbox">
        <div class="todo-content">
            <div class="todo-header">
                <span class="todo-text">${text}</span>
                ${dateValue ? `<span class="d-day">${dDayText}</span>` : ""}
            </div>
            ${dateValue ? `<div class="todo-date">마감: ${dateValue}</div>` : ""}
        </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            li.classList.add('completed');
            todoList.appendChild(li);
        } else {
            li.classList.remove('completed');
            todoList.prepend(li);
        }
    });

    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    todoList.prepend(li);

    input.value = '';
    dateInput.value = '';
    priorityInput.value = '1';
});

todoList.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    todoList.insertBefore(draggingItem, nextSibling);
});
