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

    const checkbox = li.querySelector('.checkbox');
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            li.classList.add('completed');
            // 체크하면 맨 아래로 이동
            todoList.appendChild(li);
        } else {
            li.classList.remove('completed');
            // 체크 해제하면 맨 위로 이동 (또는 원하는 위치로 드래그 가능)
            todoList.prepend(li);
        }
    });

    // 드래그 기능
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    todoList.prepend(li); // 새 할 일은 맨 위에 추가

    input.value = '';
    dateInput.value = '';
    priorityInput.value = '1';
});

// 드래그 앤 드롭 순서 변경
todoList.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    todoList.insertBefore(draggingItem, nextSibling);
});
