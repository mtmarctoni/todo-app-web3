import { expect } from "chai"
import { ethers } from "hardhat"
import type { Contract } from "ethers"

describe("TodoList", () => {
  let todoList: Contract

  beforeEach(async () => {
    const TodoList = await ethers.getContractFactory("TodoList")
    todoList = await TodoList.deploy()
    await todoList.waitForDeployment()
  })

  it("should create a new todo", async () => {
    await todoList.createTodo("Test todo")
    const todo = await todoList.todos(1)

    expect(todo.id).to.equal(1)
    expect(todo.content).to.equal("Test todo")
    expect(todo.completed).to.equal(false)
  })

  it("should toggle todo completion status", async () => {
    await todoList.createTodo("Test todo")
    await todoList.toggleCompleted(1)

    let todo = await todoList.todos(1)
    expect(todo.completed).to.equal(true)

    await todoList.toggleCompleted(1)

    todo = await todoList.todos(1)
    expect(todo.completed).to.equal(false)
  })

  it("should delete a todo", async () => {
    await todoList.createTodo("Test todo")
    await todoList.deleteTodo(1)

    const todo = await todoList.todos(1)
    expect(todo.id).to.equal(0)
    expect(todo.content).to.equal("")
    expect(todo.completed).to.equal(false)
  })

  it("should track the correct todo count", async () => {
    expect(await todoList.todoCount()).to.equal(0)

    await todoList.createTodo("First todo")
    expect(await todoList.todoCount()).to.equal(1)

    await todoList.createTodo("Second todo")
    expect(await todoList.todoCount()).to.equal(2)

    await todoList.deleteTodo(1)
    // Note: todoCount doesn't decrease when deleting
    expect(await todoList.todoCount()).to.equal(2)
  })
})

