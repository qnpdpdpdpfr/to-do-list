const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const listFilter = document.getElementById('list-filter');
const darkModeToggle = document.getElementById('dark-mode-toggle');


let todos = JSON.parse(localStorage.getItem('todos')) || [];
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

if (isDarkMode) {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️';
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

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

function renderTodos() {
    todoList.innerHTML = '';
    const filterValue = listFilter.value;

    todos.forEach((todo, index) => {
        if (filterValue !== 'all' && todo.priority !== filterValue) return;

        const li = document.createElement('li');
        li.className = `priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
        li.setAttribute('data-priority', todo.priority);
        li.draggable = true;

        li.innerHTML = `
            <div class="handle">≡</div>
            <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-header">
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span class="d-day">${getDDay(todo.date)}</span>` : ""}
                </div>
                ${todo.date ? `<div class="todo-date">마감: ${todo.date}</div>` : ""}
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            // 체크하면 배열의 끝으로 이동
            if (todo.completed) {
                const item = todos.splice(index, 1)[0];
                todos.push(item);
            } else {
                const item = todos.splice(index, 1)[0];
                todos.unshift(item);
            }
            saveTodos();
            renderTodos();
        });

        todoList.appendChild(li);
    });
}

addBtn.addEventListener('click', () => {
    if (!input.value) return alert('할 일을 입력해주세요.');
    const newTodo = {
        text: input.value,
        date: dateInput.value,
        priority: priorityInput.value,
        completed: false
    };
    todos.unshift(newTodo);
    saveTodos();
    renderTodos();
    input.value = '';
    dateInput.value = '';
});

// 다크모드
darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'disabled');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'enabled');
    }
});

listFilter.addEventListener('change', renderTodos);
renderTodos();
