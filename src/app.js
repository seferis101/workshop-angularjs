(function() {

    var appModule = angular.module("todo-app.tasks", []);
    angular.module("todo-app", ["todo-app.tasks"]);

    var defaultName = "New Task";
    function createTasksCtrl($scope, taskService, $filter) {
        // variables accessible in view (with data-binding)
        function reset() {
            $scope.task = {
                name: defaultName,
                completed: false
            };
        }
        reset();

        $scope.taskList = taskService.get();

        // function callable in view
        $scope.addTask = function () {
            taskService.add($scope.task);
            reset();
        };

        $scope.removeTask = function () {
            taskService.remove($scope.task);
            reset();
        };

        $scope.taskChanged = function (task) {
            taskService.update();
        };

        $scope.filterCompleted = function (task) {
            return $scope.showCompleted || !task.completed;
        };

        // private, not visible in view
        var doSomething = function () {
        };
    }
    appModule.controller('TasksCtrl', createTasksCtrl);

    function createService() {
        // private
        var taskListStore = "taskList";
        // if localStorage contains nothing (undefined is false), take empty array
        var taskList = angular.fromJson(localStorage[taskListStore]) || [];

        // assign public functions to this
        this.get = function () {
            return taskList;
        };

        this.add = function (task) {
            if (_.isEmpty(task.name) || task.name === defaultName) {
                return;
            }
            taskList.push(task);
            localStorage[taskListStore] = angular.toJson(taskList);
        };

        this.remove = function(task) {
            _.remove(taskList, task);
            localStorage[taskListStore] = angular.toJson(taskList);
        };

        this.update = function() {
            localStorage[taskListStore] = angular.toJson(taskList);
        };
    }
    // constructor function called with new
    // has to fill already created service instance
    appModule.service("taskService", createService);

})();

