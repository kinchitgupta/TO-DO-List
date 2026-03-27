/*document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo');
    const emptyimg = document.getElementById('no-tasks-img');
    const todosContanier = document.querySelector('.todos-container');

    const toggleemptyimg = () => {
        emptyimg.style.display = todoList.children.length === 0 ? 'block' : 'none';
        if(todosContanier){
        todoscontainer.style.width = taskList.children.length > 0 ?'100%' : '50%';
    }
};
    const addTask = (text, completed = false) => {
    
        const taskText = text || taskInput.value.trim();
        if (!taskText){
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''} />
        <span class="task-text">${taskText}</span>
        <div class="b1" >
        <button class="delete-btn">🪶</button>
        <button class="edit-btn">✖️</button>
        </div>
        `;
         
        const checkedbox = li.querySelector('.task-checkbox');
        const editBtn =li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('.task-text');

        if (completed){
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';

        }   
        checkedbox.addEventListener('change', () => {
            const isChecked = checkedbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
        });

        editBtn.addEventListener('click', () => {
            if(!checkedbox.checked){
                const newText = promt("edit your task", taskSpan.textcontent);
                if(newText && newText.trim() !==""){
                    taskSpan.textContent = newText.trim();
                }
            }
        });


       deleteBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to delete this task?")){
            li.remove();
            toggleemptyimg();
       }

    });


    todoList.appendChild(li);
    taskInput.value = "";
    toggleemptyimg();

 };

    addTaskBtn.addEventListener('click' , addTask);

    taskInput.addEventListener('keypress', (e) =>{
        if(e.key === 'Enter'){
            e.preventDefault();
            addTask();
        }
    });
});*/

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoList = document.getElementById('todo');
    const emptyimg = document.getElementById('no-tasks-img');
    const todosContainer = document.querySelector('.todos-container');

    let taskBeingEdited = null; // keep track of which task is being edited

    const toggleemptyimg = () => {
        emptyimg.style.display = todoList.children.length === 0 ? 'block' : 'none';
        if (todosContainer) {
            todosContainer.style.width = todoList.children.length > 0 ? '100%' : '50%';
        }
    };

    const addOrUpdateTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;

        // ✅ If editing, just update the existing task
        if (taskBeingEdited) {
            const taskSpan = taskBeingEdited.querySelector('.task-text');
            taskSpan.textContent = taskText;
            taskBeingEdited = null; // reset editing state
            taskInput.value = "";
            return;
        }

        // ✅ Else, create a new task
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''} />
        <span class="task-text">${taskText}</span>
        <div class="b1">
            <button class="delete-btn">🪶</button>
            <button class="edit-btn">✖️</button>
        </div>
        `;

        const checkedbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit-btn');   // DELETE now
        const deleteBtn = li.querySelector('.delete-btn'); // EDIT now
        const taskSpan = li.querySelector('.task-text');
        const progressbar = document.getElementById('process');
        const progressnumber = document.getElementById('number');

        if (completed) {
            li.classList.add('completed');
            deleteBtn.disabled = true;
            deleteBtn.style.opacity = '0.5';
            deleteBtn.style.pointerEvents = 'none';
        }

        checkedbox.addEventListener('change', () => {
            const isChecked = checkedbox.checked;
            li.classList.toggle('completed', isChecked);
            deleteBtn.disabled = isChecked;
            deleteBtn.style.opacity = isChecked ? '0.5' : '1';
            deleteBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress(false);
        });

        const updateProgress = (checkComletion = true) => {
            const totalTasks = todoList.children.length;
            const completedTasks = todoList.querySelectorAll('.task-checkbox:checked').length;

            progressbar.style.width = totalTasks ?`${(completedTasks / totalTasks) * 100}%` : '0%';
            progressnumber.textContent = `${completedTasks} / ${totalTasks}`;

            if(totalTasks > 0 && completedTasks === totalTasks){
                magic();
            }
        };

        // ✅ deleteBtn = EDIT (move text into input, update on next save)
        deleteBtn.addEventListener('click', () => {
            if (!checkedbox.checked) {
                taskInput.value = taskSpan.textContent;
                taskBeingEdited = li; // mark which task is being edited
                taskInput.focus();
            }
        });

        // ✅ editBtn = DELETE (remove directly)
        editBtn.addEventListener('click', () => {
            li.remove();
            toggleemptyimg();
            updateProgress();
        });

        todoList.appendChild(li);
        taskInput.value = "";
        toggleemptyimg();
        updateProgress(checkComletion);
    };

    // handle add button
    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addOrUpdateTask();
    });

    // handle Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addOrUpdateTask();
        }
    });
});

// 🎆 Real Firework Style Animation
const magic = () => {
    const duration = 4000; // whole show lasts 5 sec
    const animationEnd = Date.now() + duration;

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 🚀 Launch firework upward, then explode
    function launchFirework() {
        // random launch point
        const startX = Math.random();
        const startY = 1; // bottom of screen

        // 🎇 rocket going up
        confetti({
            particleCount: 1,
            startVelocity: 60,
            ticks: 60,
            gravity: 1,
            spread: 5,
            origin: { x: startX, y: startY },
            colors: ["#ffffff"], // rocket flash
        });

        // wait then explode ✨
        setTimeout(() => {
            confetti({
                particleCount: 100,
                startVelocity: 50,
                spread: 360,
                ticks: 80,
                origin: { x: startX, y: randomInRange(0.2, 0.4) }, // mid-air
                colors: ["#ff0000", "#ff9900", "#ffff00", "#00ffcc", "#00ccff", "#ffffff"],
            });
        }, 300);
    }

    // keep launching until time ends
    const interval = setInterval(() => {
        if (Date.now() > animationEnd) {
            clearInterval(interval);
            return;
        }
        launchFirework();
    }, 600); // new rocket every 0.6s
};




