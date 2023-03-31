// GLOBAL VARIABLES
let tasksContainer = [];
let box = ``;
let mainIndex = 0;
let drag = null;
let clicked;
let oneTask;
let taskInput;
let mainBox;
let updateBtn;
let deleteBtn;
let updatedTaskInput;
let myTarget;
let currentStatus;
let updateInput = "";
// let taskDiv = "";
let taskBox;
let addBtn = document.querySelectorAll(".addBtn");

// Check local storage before add any task to show old tasks for user
(function checkLocalStorage() {
  if (JSON.parse(localStorage.getItem("AllTasks")) == null) {
    tasksContainer = [];
  } else {
    // Get data (array) from local storage and parsing it
    tasksContainer = JSON.parse(localStorage.getItem("AllTasks"));
    displayMyTasks();
  }
})();

// When press on add button
addBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let box = e.target.parentElement; // Box DIV
    console.log(box);
    mainBox = box.querySelector(".mainBox");
    taskBox = box.querySelector(".taskBox"); // Parent of task DIV

    function createEnterInput() {
      // Create div to add new task
      taskBox = document.createElement("div");
      taskBox.className = "taskBox ";
      mainBox.appendChild(taskBox);

      //  Create input to add new task
      taskInput = document.createElement("input");
      taskInput.className = "taskInput";
      taskInput.setAttribute("type", "text");
      taskInput.value = ""; // Let input element is empty
      taskInput.placeholder = "write your task here";
      taskBox.appendChild(taskInput);

      // Create delete btn
      deleteBtn = document.createElement("button");
      deleteBtn.className = "btn  del-btn"; // add class
      deleteBtn.innerHTML = `<ion-icon name="trash" ></ion-icon>`; // put delete icon in delete btn
      taskBox.append(deleteBtn);

      deleteBtn.addEventListener("click", (e) => {
        console.log("delete");

        let currentEnterBtn = e.target.closest(".taskBox"); // taskBox DIV

        // currentEnterBtn.innerHTML = "";
        currentEnterBtn.remove();

        console.log(taskInput == false);
      });
      clicked = true;
    }
    // ********************************** Add Button *******************************************************
    // Check on input element if showed or no
    if ((mainBox.innerHTML === "" && btn.innerHTML == "+ Add") || !taskInput) {
      console.log("not find ");
      createEnterInput();
    }

    // else if (taskBox.classList.contains("task") == false) {
    //   console.log("contains");
    //   console.log(taskBox.classList.contains("task"));
    //   createEnterInput();
    // if (taskInput.value == "") {
    //   console.log("4ayfCCCCCCC");
    //   taskInput.classList.add("borderDeleteinput");
    // }
    // }
    // else if (taskInput && taskBox.classList.contains("reStyleTaskBox")) {
    //   console.log("restyle");
    //   // if (taskInput) {
    //   if (taskInput.value == "") {
    //     console.log("4ayf");
    //     taskInput.classList.add("borderDeleteinput");
    //   }

    //   // console.log(taskInput.value);
    //   else {
    //     createEnterInput();
    //     console.log("else");
    //   }
    // }
    else if (
      taskInput.value === "" &&
      btn.innerHTML === "+ Add" &&
      taskInput.readOnly === false
    ) {
      console.log("empty");
      taskInput.classList.add("borderDeleteinput");
      taskInput.readOnly = false;
      clicked = true;
    } else if (
      taskInput.value &&
      taskInput.readOnly === false &&
      btn.innerHTML === "+ Add"
    ) {
      taskInput.classList.remove("borderDeleteinput");
      taskInput.classList.remove("borderUpdateinput");
      console.log(taskInput.value);

      oneTask = {
        taskStatus: taskInput.parentElement.parentElement.id,
        taskValue: taskInput.value,
      };

      mainIndex++;
      tasksContainer.push(oneTask); // push obj in array
      localStorage.setItem("AllTasks", JSON.stringify(tasksContainer));
      taskInput.readOnly = true;
      clearTaskBox();
      displayMyTasks();
      console.log(tasksContainer);
    } else if (
      taskInput.value &&
      taskInput.readOnly === true &&
      btn.innerHTML === "+ Add"
    ) {
      createEnterInput();
      taskInput.readOnly = false;
    }

    // ********************************** Update Button *******************************************************
    if (updatedTaskInput && btn.innerHTML === "Update") {
      if (updatedTaskInput.value == "") {
        console.log("updatedTaskInput");
        updatedTaskInput.classList.add("borderUpdateInput");
        clicked = false;
      } else {
        oneTask = {
          taskStatus: updatedTaskInput.parentElement.parentElement.id,
          taskValue: updatedTaskInput.value,
        };
        tasksContainer.splice(mainIndex, 1, oneTask); // replace the old task by the new task
        localStorage.setItem("AllTasks", JSON.stringify(tasksContainer));
        updatedTaskInput.readOnly = true;
        btn.innerHTML = "+ Add";
        btn.className = "btn addBtn ";
        updatedTaskInput.remove();
        clearTaskBox();
        displayMyTasks();
        console.log("updated", oneTask);
      }
    }
  });
});

function clearTaskBox() {
  mainBox = document.querySelectorAll(".mainBox");
  for (let i = 0; i < mainBox.length; i++) {
    mainBox[i].innerHTML = "";
  }
}

//*******************DISPLAY TASKS*************************************************
// To display your tasks dynamically on the board
function displayMyTasks() {
  let taskNotStarted = document.querySelector("#notStarted");
  let taskInProgress = document.querySelector("#inProgress");
  let taskCompleted = document.querySelector("#completed");

  for (let i = 0; i < tasksContainer.length; i++) {
    if (tasksContainer[i].taskStatus === "notStarted") {
      box = `
      <div class="taskBox reStyleTaskBox"  draggable="true" >${tasksContainer[i].taskValue}
      
    <button class="btn updateBtn">
      <ion-icon name="create" id="upIcon" onClick="updateMyTask(this , ${i})"></ion-icon>
      </button>
      <button class="btn del-btn">
      <ion-icon name="trash" id="delIcon" onClick="deleteMyTask(this ,${i})"></ion-icon>
      </button>
      </div>  `;
      taskNotStarted.innerHTML += box;
    } else if (tasksContainer[i].taskStatus === "inProgress") {
      box = `
      <div class="taskBox reStyleTaskBox"  draggable="true" >${tasksContainer[i].taskValue}
    
        <button class="btn  updateBtn">
          <ion-icon name="create"  onClick="updateMyTask(this , ${i} )"></ion-icon>
          </button>
          <button class="btn  del-btn">
          <ion-icon name="trash"   onClick="deleteMyTask(this ,${i})"></ion-icon>
        </button>
     
      </div>  `;
      taskInProgress.innerHTML += box;
    } else if (tasksContainer[i].taskStatus === "completed") {
      box = `
      <div class="taskBox reStyleTaskBox"  draggable="true" >${tasksContainer[i].taskValue}
         <button class="btn updateBtn">
          <ion-icon name="create" id="upIcon" onClick="updateMyTask(this , ${i})"></ion-icon>
          </button>
          <button class="btn del-btn">
          <ion-icon name="trash" id="delIcon"  onClick="deleteMyTask(this ,${i})"></ion-icon>
        </button>
    
    </div>  `;

      taskCompleted.innerHTML += box;
    }
    mainIndex = i + 1;
  }

  dragItem();
}

//******************************DRAG & DROP ITEMS ***********************/

// ************* TASK *************************
function dragItem() {
  let tasks = document.querySelectorAll(".taskBox");
  let mainBox = document.querySelectorAll(".mainBox"); // parent of task box

  //********* DRAG START ************

  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      myTarget = task;
      drag = myTarget;
      task.classList.add("dragging");
    });

    // For Phone
    task.addEventListener("touchstart", function (e) {
      drag = task;
      task.style.opacity = "0.5";
      [...e.changedTouches].forEach((touch) => {
        task.style.top = `${touch.pageY / 100}px`;
        task.style.left = `${touch.pageX / 100}px`;
        task.id = touch.identifier;
      });
    });
    task.addEventListener("touchmove", function (e) {
      e.preventDefault();
      [...e.changedTouches].forEach((touch) => {
        task.style.position = `absolute`;
        task.style.top = `${touch.pageY - 15}px`; // To move task from center on Y-axis
        task.style.left = `${touch.pageX - 125}px`; // To move task from center on X-axis
        task.id = touch.identifier;
        boardContainer.forEach((list) => {
          if (list.offsetTop < touch.pageY) {
            let currentList = list.querySelector(".tasks-list");
            currentList.style.background = "var(--second-BG-color)";
          } else {
            let currentList = list.querySelector(".tasks-list");
            currentList.style.background = "transparent";
          }
        });
      });
    });

    //****** DRAG END *************
    task.addEventListener("dragend", function dragEnd() {
      drag = null;
      task.classList.remove("dragging");
    });

    // For Phone
    task.addEventListener("touchend", function (e) {
      task.style.opacity = "1";
      [...e.changedTouches].forEach((touch) => {
        task.style.position = `relative`;
        task.style.top = `0px`;
        task.style.left = `0px`;
        task.id = touch.identifier;
        boardContainer.forEach((list) => {
          let currentList = list.querySelector(".tasks-list");
          currentList.style.background = "transparent";
          if (list.offsetTop < touch.pageY && drag !== null) {
            let choosingList = list.querySelector(".tasks-list");
            choosingList.appendChild(drag);
          }
        });
        drag = null;
      });
    });
  });

  //****************** BOX OF TASKS ************************* */
  mainBox.forEach((box) => {
    //****** DRAG OVER ***************
    box.addEventListener("dragover", (e) => {
      e.preventDefault();
      box.style.background = "rgb(20, 141, 111)";
      console.log("drag over");
    });

    //****** DRAG LEAVE **************
    box.addEventListener("dragleave", function dragLeave(e) {
      e.preventDefault();
      box.style.background = "rgb(19, 155, 121)";
      drag = null;
    });

    //****** DROP **************
    box.addEventListener("drop", () => {
      box.style.background = "rgb(19, 155, 121)";
      box.appendChild(myTarget);

      let currentValue = currentBox.innerText;
      myTarget.disabled = true;
    });
  });
}

//*********************** UPDATE ***********************************/
// To update my task

function updateMyTask(element, index) {
  taskBox = element.parentElement.parentElement;
  let box = taskBox.closest(".box");
  let taskValue = taskBox.innerText; // store the task and display it in the input element as below
  // let mainBox = document.querySelectorAll(".mainBox");
  let test = taskBox.parentElement.contains(updatedTaskInput);

  if (!test) {
    console.log("not");
    clicked = true;
    taskBox.removeAttribute("draggable");
    taskBox.innerHTML = `<input type="text"/>`; // put input element only in the div task to the user can update his task
    taskBox.firstElementChild.classList.add("taskInput");
    taskBox.firstElementChild.value = taskValue; // add current task to the new input element to update it as above
    taskBox.classList.remove("reStyleTaskBox");
    updatedTaskInput = taskBox.firstElementChild; // to select the task  what i want to update it
    let addBtnStyle = box.querySelector(".addBtn");
    addBtnStyle.innerHTML = "Update";
    addBtnStyle.className = "updateTaskBtn";

    // change mainIndex to my updated task Index
    mainIndex = index;

    //  to make update one element only every press on edit icon
  } else {
    clicked = false;
  }
  console.log(updatedTaskInput);
  return updatedTaskInput;
}

// ********************DELETE***************************************************
// Delete my task
function deleteMyTask(element, index) {
  console.log(element);
  tasksContainer.splice(index, 1);
  localStorage.setItem("AllTasks", JSON.stringify(tasksContainer));
  clearTaskBox();
  displayMyTasks();
}
