const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const listFilter = document.getElementById('list-filter');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const modeIcon = document.getElementById('mode-icon');
const modeText = document.getElementById('mode-text');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateDarkModeUI(isDark) {
    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        modeIcon.textContent = '☀️';
        modeText.textContent = '라이트모드';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.removeAttribute('data-theme');
        modeIcon.textContent = '🌙';
        modeText.textContent = '다크모드';
        localStorage.setItem('darkMode', 'disabled');
    }
}

const savedDarkMode = localStorage.getItem('darkMode') === 'enabled';
updateDarkModeUI(savedDarkMode);

darkModeToggle.addEventListener('click', () => {
    const isNowDark = document.body.getAttribute('data-theme') !== 'dark';
    updateDarkModeUI(isNowDark);
});

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
        li.draggable = true;

        const dDayText = getDDay(todo.date);

        li.innerHTML = `
            <div class="handle">≡</div>
            <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-info">
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span class="todo-date">마감: ${todo.date}</span>` : ""}
                </div>
                ${todo.date ? `<span class="d-day">${dDayText}</span>` : ""}
            </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            const currentItem = todos.splice(index, 1)[0];
            if (todo.completed) {
                todos.push(currentItem);
            } else {
                todos.unshift(currentItem);
            }
            saveTodos();
            renderTodos();
        });

        li.addEventListener('dragstart', () => li.classList.add('dragging'));
        li.addEventListener('dragend', () => li.classList.remove('dragging'));

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

listFilter.addEventListener('change', renderTodos);

todoList.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    todoList.insertBefore(draggingItem, nextSibling);
});

renderTodos();
