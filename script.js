
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');


addBtn.addEventListener('click', function() {
    const text = input.value; // 입력창에 쓴 글자 가져오기

    if (text === '') {
        alert('할 일을 입력해주세요!');
        return;
    }


    const li = document.createElement('li');
    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn">삭제</button>
    `;

 
    li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
    });

    todoList.appendChild(li);
    input.value = '';
});
