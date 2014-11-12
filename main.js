todos = [];
checked = [];

createTodo = function(_text) {
    var main = $("<div>").attr("class", "col-xs-12 todoElem");
    var row = $("<div>").attr("class", "row");
    var column = $("<div>").attr("class", "col-sm-11 col-sm-offset-0 col-xs-11 col-xs-offset-0");
    var checkBox = $("<input type='checkbox'>")
    var label = $("<span>").attr("class", "todoLabel").text(_text);
    var deleteButton = $("<div>").attr("class", "col-sm-1 col-xs-1").append($("<a>").attr("href", "#").attr("style", "color: black;").append($("<span style='display:none;'>").attr("class", "glyphicon glyphicon-minus-sign")));
    return main.append(row.append(column.append(checkBox).append(label)).append(deleteButton));
}
createTodoAndUpdateStorage = function(_text) {
    todos.push(_text);
    checked.push(false);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checked", JSON.stringify(checked));
    return createTodo(_text);
}

removeTodoStorage = function(todo) {
    var index = $(todo).prevAll().length - 1;
    todos.splice(index, 1);
    checked.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("checked", JSON.stringify(checked));
}
removeTodoFadeOut = function(todo) {
    todo.fadeOut(300, function() {$(this).remove()});
}
removeTodo = function(todo) {
    removeTodoStorage(todo);
    todo.remove();
}

$(document).on("click", ".todoElem input", function() {
    var index = $(this).parents(".todoElem").prevAll().length - 1;
    checked[index] = this.checked;
    localStorage.setItem("checked", JSON.stringify(checked));
    if (this.checked)
        $(this).parent().css("color", "#a9a9a9");
    else
        $(this).parent().css("color", "black");
});

$(document).on("mouseenter", ".todoElem", function() {
    $("a span", this).show();
});
$(document).on("mouseleave", ".todoElem", function() {
    $("a span", this).hide();
});

$(document).on("click", ".todoElem a", function(event) {
    event.preventDefault();
    removeTodo($(this).parents(".todoElem"));
});

$(document).on("blur", ".todoElem span", function(event) {
    var index = $(this).parents(".todoElem").prevAll().length - 1;
    todos[index] = $(this).text();
    localStorage.setItem("todos", JSON.stringify(todos));
});

$(document).ready(function() {
    if (localStorage.getItem("todos") !== null)
        todos = JSON.parse(localStorage.getItem("todos"));
    if (localStorage.getItem("checked") !== null)
        checked = JSON.parse(localStorage.getItem("checked"));
    if (todos.length != checked.length) {
        todos = [];
        checked = [];
    }
    for (var i = 0; i < todos.length; ++i) {
        var newTodo = createTodo(todos[i]);
        $("#listRow").append(newTodo);
        if (checked[i])
            $("input", newTodo).click();
    }

    $("#addTodoForm").submit(function() {
        if ($("#addTodoTextArea").val() !== "") {
            $("#listRow").append(createTodoAndUpdateStorage($("#addTodoTextArea").val()));
            $("#addTodoTextArea").val("");
        }
        return false;
    })

    $("#checkAllButton").click(function() {
        $(".todoElem input:not(:checked)").click();
    });
    $("#uncheckAllButton").click(function() {
        $(".todoElem input:checked").click();
    });
    $("#clearButton").click(function() {
        $("a", $(".todoElem input:checked").parents(".todoElem")).trigger("click");
    });
});