/* ---------------------------------------------------------------------- Global Variables ----------------------------------------------------------------------*/


let allTodos;
let titleData;

const defaultTodos = [

    { title: 'Get Groceries', dueDate: '2020-03-01', description: 'Go to Ralphs and get your groceries', isComplete: true },

    { title: 'Finish CS project', dueDate: '2020-03-15', description: 'Complete creationg of to-do app', isComplete: false },

    { title: 'Create VDJ set', dueDate: '2020-03-14', description: '', isComplete: false },

    { title: 'Create Radio Mix', dueDate: '2020-03-25', description: 'Create Aries SZN mix for first episode of radio show', isComplete: false },

    { title: 'Gym 3x/wk', dueDate: '2020-03-08', description: 'Go to the gym three times each week', isComplete: true },

    { title: 'Keep up with CS readings, reps, and project', dueDate: '2020-03-04', description: 'Survival', isComplete: false }

  ];

let pendingTodos, completedTodos, expiredTodos;


/* ---------------------------------------------------------------------- Functions ----------------------------------------------------------------------*/


// Creates todo card
function createElementFromTodo (todo) {
    
    const titleText = todo.title;
    const dueDateText = todo.dueDate;
    
    let addCompleteButton = todo.isComplete 
    ? ''
    : '<button class="action complete">Complete</button>'; 

    const todoCard = 
    $(
        `<div class="todo">

        </div>`
    );

    todoCard.html(`<h3><span class="title">${titleText}</span>
    <span class="due-date">${dueDateText}</span></h3>
    <pre>Click on the left below the icons to expand the left drawer
    
When you're done, click complete on this todo.</pre>
<footer class="actions">
${addCompleteButton}
<button class="action delete">Delete</button>
</footer>`)

    return (todoCard).data('todo', todo);
};


//Renders created todo cards
function renderTodos () {
    // Displays allTodos

    $('main .content').empty();
    
    storeData();
    splitTodos();

    pendingTodos.forEach(function (todoItem) {
        let renderedItem = createElementFromTodo(todoItem);
        $('.pending-todos').append(renderedItem);
    });

    expiredTodos.forEach(function (todoItem) {
        let renderedItem = createElementFromTodo(todoItem);
        $('.expired-todos').append(renderedItem);
    });
    
    completedTodos.forEach(function (todoItem) {
        let renderedItem = createElementFromTodo(todoItem);
        $('.completed-todos').append(renderedItem);
    });

};


//Creates new todo card using completed data from todo creation form
function createToDoFromForm () {
    
    const completeForm = $('.todo-form')

    const formTitle = $('#todo-title').val();
    const formDueDate = $('#todo-due-date').val();
    const formDescrip = $('#todo-descripton').val();

    const newTodo = { title: `${formTitle}`, dueDate: `${formDueDate}`, dscription: `${formDescrip}`, isComplete: false };

    completeForm.trigger('reset'); 

    return (newTodo);
};


// Determines if a todo card item is current or past due/expired
function isCurrent(todo) {

    const todoDueDate = new Date(todo.dueDate);
    const now = new Date();
    
    return now < todoDueDate;
};


// Stores complete, expired, and pending todo card items in separate arrays
function splitTodos () {

    completedTodos = allTodos.filter(function (element){
        return element.isComplete === true;
    });

    expiredTodos = allTodos.filter(function (element){
        return !isCurrent(element) && element.isComplete === false;
    });

    pendingTodos = allTodos.filter(function (element){
        return isCurrent(element) && element.isComplete === false;
    });

};


//Stores todo card items existing in "allTodos" at the time of running into localStorage, so that we can retrieve it later, allowing the data to persist when the app is exited or reloaded.
function storeData () {

    localStorage.setItem('allTodos', JSON.stringify(allTodos));

};


//Retrieves data stored in localStorage under the 'allTodos' key, allowing us to retrieve previously stored data if the app is exited or relaoded. If there is no data, allTodos is given default values as a starting point instead.
function retrieveData () {

    const foundTodos = localStorage.getItem('allTodos');

    allTodos = !foundTodos
    ? defaultTodos
    : JSON.parse(foundTodos);
    
};

function fetchDefaultTodos () {
    return defaultTodos;
}



/* ---------------------------------------------------------------------- Click Handlers ----------------------------------------------------------------------*/


//Expands left-hand menu
$('.left-drawer').click(function(event){
    
    let clicked = event.target;
    if ($(clicked).hasClass('left-drawer')){
        $('#app').toggleClass('drawer-open');
    }
});


//Activates "add todo" button
$('.add-todo').click(function(){
    $('.modal').addClass('open');
});


//Activates "create todo" button and enables submit button for todo creation form
$('.create-todo').click(function(event){
    
    $('.modal').removeClass('open');

    event.preventDefault();
    
    allTodos.unshift(createToDoFromForm());
    
    $('.todo-form').reset;
    
    renderTodos();

});


//Activates "cancel" button in todo creation form
$('.cancel-create-todo').click(function(){
    $('.modal').removeClass('open');
});


//Enables "complete" button on pending todo cards which moves them to "Completed Todos" list
$('main').on('click', '.action.complete', function () {
    
    let completedTodo = $(this).closest('.todo');
    completedTodo.data().todo.isComplete = true;

    completedTodo.slideUp(function () {
        renderTodos();
    });

});


//Enables "delete" button on todo cards
$('main').on('click', '.action.delete', function () {
    
    const deleteTarget = $(this).closest('.todo');
    const deleteTargetData = deleteTarget.data('todo');
    const deleteTargetIndex = allTodos.indexOf(deleteTargetData);

    allTodos.splice(deleteTargetIndex, 1);

    deleteTarget.slideUp(function () {
         renderTodos();
     });

});


//Enables "Remove Completed Todos" button in sidebar
$('.remove-completed').click(function(){
    
    completedTodosAll = allTodos.filter(function (element){
        return !element.isComplete === true;
    });

    allTodos = completedTodosAll;

    renderTodos();

});


//Enables "Remove Expired Todos" button in sidebar
$('.remove-expired').click(function(){

    expiredTodosAll = allTodos.filter(function (element){
        return isCurrent(element);
    });

    allTodos = expiredTodosAll;

    renderTodos();

});


//Allows users to click the title of a todo-item and move it to either completed or pending by then clicking the title of that list.
$('main').on('click', '.todo .title', function () {

    titleData = $(this).parents('.todo').data().todo;
    
    $('main').on('click', '#pending-todos', function (){
        titleData.isComplete = false;
        titleData = null;
        renderTodos();
    })

    $('main').on('click', '#completed-todos', function (){
        titleData.isComplete = true;
        titleData = null;
        renderTodos();
    })

});


//Enables "custom" button in "Due Date" area of "Create todo form", revealing a date-input field when clicked.
$('#custom').click(function(event){
    
    event.preventDefault();

    if ($('#todo-due-date').css('display') === 'none'){
        $('#todo-due-date').css('display', 'initial');
    }

    $('.todo-form').reset;

});


//My attempt at getting the buttons for "today" and a bit of expirementing for how to get "tomorrow" to work. I was able to get the dates, but wasn't able to figure out how to pre-fill the values in the date input field with those dates.
$('#today').click(function(event){
    
    event.preventDefault();

    if ($('#todo-due-date').css('display') === 'none'){
        $('#todo-due-date').css('display', 'initial');
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1)
    let currDate = $('#todo-due-date').val();

    console.log(currDate);

    currDate = today;

    console.log(currDate);

    $('.todo-form').reset;

});
/* ---------------------------------------------------------------------- Runtime Code ----------------------------------------------------------------------*/

//Retrieves data from localStorage, if any (else retrieves default data), on app startup and loads them once the application is ready
$(document).ready(retrieveData);
$(document).ready(renderTodos);