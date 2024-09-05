// Select factors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// 날짜 계산을 위한 변수들
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const today = new Date();


document.getElementById("monthYear1").innerHTML = months[today.getMonth()] + ', ' + today.getFullYear();

const startDayOfWeek = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
const dates = document.getElementById("dates");

printDates(dates);

// Add event 
todoForm.addEventListener('submit', addTodo);
todoList.addEventListener('click', handleTodoClick);

// 날짜 출력
function printDates(event){
    // 시작하는 요일에 맞춰서 그 앞에 빈 칸을 넣어주기 위한 반복문
        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDate = document.createElement("div");
            event.appendChild(emptyDate);
        }
        
        // 시작하는 요일 뒤 부터 차례대로 div 데이터 입력을 위한 반복문
        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement("div");

            const dateText = document.createElement("span");
            dateText.textContent = i;

            if (i === today.getDate()) {
                dateText.style.cssText = 'color : red';
            }
            dateElement.appendChild(dateText);

            event.appendChild(dateElement);  
        }
    }


function addTodo(event) {
    event.preventDefault(); // 

    const todoText = todoInput.value.trim();
    if (todoText === '') return;

    const li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML = `
        <input type="checkbox" id="checkBoxId">
        <span>${todoText}</span>
        <div>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    todoList.appendChild(li);
    todoInput.value = '';
}

function handleTodoClick(event){
    const target = event.target;

    if (target.type === 'checkbox') {
        const todoItem = target.closest('li');
        const todoText = todoItem.querySelector('span');

        if (target.checked) {
            todoText.style.textDecoration = 'line-through';
        } else {
            todoText.style.textDecoration = 'none';
        }
    } else if (target.classList.contains('delete-btn')) {
        target.closest('li').remove();
    }
}


const allDateElements = dates.querySelectorAll('div');

allDateElements.forEach(dateElement => {
    dateElement.addEventListener('click', changeScreen);
});

function changeScreen(event){
    const target = event.target;
    const bigCal = target.parentElement.parentElement.parentElement.parentElement;
    
    document.getElementById("selectedDate").innerHTML = months[today.getMonth()] +' '+ target.textContent +', ' + today.getFullYear();
    afterClickDate.classList.toggle('show');
    bigCal.remove();
}

function saveToDos() {
    const toDos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        toDos.push({ text: item.querySelector('span').innerText,
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function loadToDos() {
    const savedToDos = JSON.parse(localStorage.getItem('toDos'));
    if (savedToDos) {
        savedToDos.forEach(todo => {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            if (todo.completed) li.classList.add('completed');

            li.innerHTML = `
            <input type="checkbox" id="checkBoxId">
            <span>${todo.text}</span>
            <div>
                <button class="delete-btn">Delete</button>
            </div>
            `;

            todoList.appendChild(li);
        });
    }
}

window.addEventListener('load', loadToDos);

todoForm.addEventListener('submit', () => {
    addTodo(event);
    saveToDos();
});

todoList.addEventListener('click', () => {
    handleTodoClick(event);
    saveToDos();
})