const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const listFilter = document.getElementById('list-filter');
const deleteModeBtn = document.getElementById('delete-mode-btn');
const deleteActions = document.getElementById('delete-actions');
const selectAllWrapper = document.getElementById('select-all-wrapper');
const selectAllCheckbox = document.getElementById('select-all-checkbox');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let isDeleteMode = false;

const darkModeToggle = document.getElementById('dark-mode-toggle');
function updateDarkModeUI(isDark) {
    document.body.setAttribute('data-theme', isDark ? 'dark' : '');
    document.getElementById('mode-icon').textContent = isDark ? '☀️' : '🌙';
    document.getElementById('mode-text').textContent = isDark ? '라이트모드' : '다크모드';
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}
updateDarkModeUI(localStorage.getItem('darkMode') === 'enabled');
darkModeToggle.addEventListener('click', () => updateDarkModeUI(document.body.getAttribute('data-theme') !== 'dark'));

function getDDay(targetDate) {
    if (!targetDate) return "";
    const diff = new Date(targetDate).setHours(0,0,0,0) - new Date().setHours(0,0,0,0);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "D-Day" : (days > 0 ? `D-${days}` : `D+${Math.abs(days)}`);
}

function renderTodos() {
    todoList.innerHTML = '';
    const filter = listFilter.value;
    
    todos.forEach((todo, index) => {
        if (filter !== 'all' && todo.priority !== filter) return;
        const li = document.createElement('li');
        li.className = `priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
        const checkboxHTML = isDeleteMode 
            ? `<input type="checkbox" class="del-checkbox" data-index="${index}">`
            : `<input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleComplete(${index})">`;
        li.innerHTML = `
            ${checkboxHTML}
            <div class="todo-content">
                <div class="todo-info">
                    <span class="todo-text">${todo.text}</span>
                    ${todo.date ? `<span style="font-size:0.75rem; opacity:0.6; display:block;">마감: ${todo.date}</span>` : ""}
                </div>
                <span class="d-day">${getDDay(todo.date)}</span>
            </div>
        `;
        todoList.appendChild(li);
    });
}

window.toggleComplete = (index) => {
    todos[index].completed = !todos[index].completed;
    const item = todos.splice(index, 1)[0];
    item.completed ? todos.push(item) : todos.unshift(item);
    saveAndRender();
};

function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

deleteModeBtn.addEventListener('click', () => {
    isDeleteMode = true;
    deleteActions.classList.remove('hidden');
    selectAllWrapper.classList.remove('hidden');
    renderTodos();
});

selectAllCheckbox.addEventListener('change', () => {
    document.querySelectorAll('.del-checkbox').forEach(cb => cb.checked = selectAllCheckbox.checked);
});

cancelDeleteBtn.addEventListener('click', () => {
    isDeleteMode = false;
    deleteActions.classList.add('hidden');
    selectAllWrapper.classList.add('hidden');
    renderTodos();
});

confirmDeleteBtn.addEventListener('click', () => {
    const selected = document.querySelectorAll('.del-checkbox:checked');
    if (selected.length === 0) return alert('항목을 선택하세요.');
    if (confirm('정말 삭제하시겠습니까?')) {
        const indices = Array.from(selected).map(cb => parseInt(cb.dataset.index)).sort((a,b)=>b-a);
        indices.forEach(i => todos.splice(i, 1));
        isDeleteMode = false;
        deleteActions.classList.add('hidden');
        selectAllWrapper.classList.add('hidden');
        saveAndRender();
    }
});

addBtn.addEventListener('click', () => {
    if (!input.value) return alert('할 일을 입력하세요');
    todos.unshift({ text: input.value, date: dateInput.value, priority: priorityInput.value, completed: false });
    input.value = '';
    saveAndRender();
});

listFilter.addEventListener('change', renderTodos);
renderTodos();
