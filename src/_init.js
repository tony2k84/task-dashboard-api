var user = require('./model/user')
var taskType = require('./model/task-type');

module.exports.users = function(){
    console.log('initializing users started')
    user.register('Admin', 'admin', 'admin', 'admin');
    console.log('initializing users completed')
}

module.exports.taskTypes = function(){
    console.log('initializing task types started')
    taskType.add('Standard');
    console.log('initializing task types completed')
}