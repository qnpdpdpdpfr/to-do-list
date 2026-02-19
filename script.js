const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter button");

let todos = [];
let filter = "all";

addBtn.addEventListener("click", addTodo);
filterBtns.forEach(btn =>
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    render();
  })
);

function addTodo() {
  if (input.value.trim() === "") return;

  todos.push({
    text: input.value,
    done: false,
  });

  input.value = "";
  render();
}

function toggleTodo(index) {
  todos[index].done = !todos[index].done;
  render();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  render();
}

function render() {
  list.innerHTML = "";

  todos
    .filter(todo => {
      if (filter === "done") return todo.done;
      if (filter === "active") return !todo.done;
      return true;
    })
    .forEach((todo, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="${todo.done ? "done" : ""}" onclick="toggleTodo(${index})">
          ${todo.text}
        </span>
        <button onclick="deleteTodo(${index})">삭제</button>
      `;
      list.appendChild(li);
    });
}
