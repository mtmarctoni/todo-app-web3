// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TodoList {
    uint public todoCount = 0;
    
    struct Todo {
        uint id;
        string content;
        bool completed;
    }
    
    mapping(uint => Todo) public todos;
    
    event TodoCreated(
        uint id,
        string content,
        bool completed
    );
    
    event TodoCompleted(
        uint id,
        bool completed
    );
    
    event TodoDeleted(
        uint id
    );
    
    function createTodo(string memory _content) public {
        todoCount++;
        todos[todoCount] = Todo(todoCount, _content, false);
        emit TodoCreated(todoCount, _content, false);
    }
    
    function toggleCompleted(uint _id) public {
        Todo memory _todo = todos[_id];
        _todo.completed = !_todo.completed;
        todos[_id] = _todo;
        emit TodoCompleted(_id, _todo.completed);
    }
    
    function deleteTodo(uint _id) public {
        require(_id <= todoCount, "Todo does not exist");
        
        // Delete the todo
        delete todos[_id];
        
        emit TodoDeleted(_id);
    }
}

