const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    const text = input.value;
    const date = dateInput.value || "기한 없음";
    const priority = priorityInput.value;
    const priorityLabel = priority === '1' ? '낮음' : priority === '2' ? '보통' : '높음';

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
            <span class="todo-text">${text}</span>
            <div class="todo-meta">마감: ${date} | 중요도: ${priorityLabel}</div>
        </div>
    `;

    // 체크박스 토글 (완료/취소)
    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
    });

    // 드래그 앤 드롭 로직
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    todoList.appendChild(li);

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
