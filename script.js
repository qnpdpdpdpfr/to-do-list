const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
    const text = input.value;
    const date = dateInput.value;
    const priority = priorityInput.value;
    const priorityLabel = priority === '1' ? '낮음' : priority === '2' ? '보통' : '높음';

    if (!text || !date) {
        alert('내용과 날짜를 입력하세요.');
        return;
    }

    const li = document.createElement('li');
    li.classList.add(`priority-${priority}`);
    li.draggable = true; // 4. 순서 변경을 위한 드래그 설정

    li.innerHTML = `
        <input type="checkbox" class="check-btn">
        <div class="todo-content">
            <div class="todo-info-text">
                <strong>${text}</strong>
                <div class="meta-info">📅 ${date} | ⭐ 중요도: ${priorityLabel}</div>
            </div>
        </div>
    `;

    // 2. 체크박스로 완료/취소 토글
    const checkbox = li.querySelector('.check-btn');
    checkbox.addEventListener('change', () => {
        li.classList.toggle('completed');
    });

    // 4. 드래그 앤 드롭 이벤트 (순서 바꾸기)
    li.addEventListener('dragstart', () => li.classList.add('dragging'));
    li.addEventListener('dragend', () => li.classList.remove('dragging'));

    todoList.appendChild(li);
    input.value = '';
});

// 순서 바꾸기 로직
todoList.addEventListener('dragover', e => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...todoList.querySelectorAll('li:not(.dragging)')];
    const nextSibling = siblings.find(sibling => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
    todoList.insertBefore(draggingItem, nextSibling);
});
