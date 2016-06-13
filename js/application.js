var IndexPage = {
    tasks: [],

    init: function () {
        User.loadUser();
        if (!User.authorized) {
            window.location.replace('/spalah/clientapp/sign_in.html');
        }
        this.loadTasks();
        this.taskInput = document.getElementById('task-name');
        this.taskList = document.getElementById('tasks-list');
        document.getElementById('add-task-btn').addEventListener('click', this.sendCreateRequest.bind(this));
    },

    loadTasks: function () {
        var loadTasksCallback = function (data) {
            this.tasks = data;

            for(var i=0; i<data.length; i++) {
                var newItem = document.createElement('p');
                newItem.innerHTML = data[i].name;
                this.taskList.appendChild(newItem);
            }
        };
        $.ajax({
            url: 'http://spalah-home.herokuapp.com/tasks.json',
            method: 'GET',
            headers: User.accessHeaders,
            // Оборачиваем колбек функцию с помощью refreshTokenAndRunCallback. Смотри user.js
            success: User.refreshTokenAndRunCallback(loadTasksCallback.bind(this))
        });
    },

    sendCreateRequest: function () {
        event.preventDefault();

        var requestHeaders = User.accessHeaders;
        requestHeaders['Content-Type'] = 'application/json';

        var successCallback = function (data) {
            this.tasks.push({name: this.taskInput.value});

            var newItem = document.createElement('p');
            newItem.innerHTML = this.taskInput.value;
            this.taskList.appendChild(newItem);
        };

        $.ajax({
            url: 'http://spalah-home.herokuapp.com/tasks.json',
            method: 'POST',
            headers: requestHeaders,
            data: JSON.stringify({name: this.taskInput.value}),
            // Оборачиваем колбек функцию с помощью refreshTokenAndRunCallback. Смотри user.js
            success: User.refreshTokenAndRunCallback(successCallback.bind(this))
        });
    }
};