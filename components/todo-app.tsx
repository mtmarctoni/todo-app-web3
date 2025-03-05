"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/hooks/use-web3"
import type { Todo } from "@/types/todo"
import { TodoList } from "@/components/todo-list"
import { TodoForm } from "@/components/todo-form"
import { ConnectWallet } from "@/components/connect-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export default function TodoApp() {
  const { connected, contract, address, connecting } = useWeb3()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">("all")
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (connected && contract) {
      setError(null)
      fetchTodos()
    } else if (!connecting) {
      setLoading(false)
      if (connected && !contract) {
        setError("Contract not initialized. Please reconnect your wallet.")
      }
    }
  }, [connected, contract, connecting])

  const fetchTodos = async () => {
    try {
      setLoading(true)

      if (!contract) {
        setError("Contract not initialized.")
        toast({
          title: "Error fetching todos",
          description: "Contract not initialized. Please reconnect your wallet.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const todoCount = await contract.todoCount()
      const fetchedTodos: Todo[] = []

      for (let i = 1; i <= todoCount; i++) {
        const todo = await contract.todos(i)
        if (todo.id.toString() !== "0") {
          fetchedTodos.push({
            id: todo.id.toString(),
            content: todo.content,
            completed: todo.completed,
          })
        }
      }

      setTodos(fetchedTodos)
    } catch (error) {
      console.error("Error fetching todos:", error)
      toast({
        title: "Error fetching todos",
        description: "There was an error loading your todos from the blockchain.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (content: string) => {
    try {
      if (!contract) {
        toast({
          title: "Error creating todo",
          description: "Contract not initialized. Please reconnect your wallet.",
          variant: "destructive",
        })
        return
      }
      const tx = await contract.createTodo(content)
      await tx.wait()

      toast({
        title: "Todo created",
        description: "Your todo has been added to the blockchain.",
      })

      fetchTodos()
    } catch (error) {
      console.error("Error adding todo:", error)
      toast({
        title: "Error creating todo",
        description: "There was an error adding your todo to the blockchain.",
        variant: "destructive",
      })
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      if (!contract) {
        toast({
          title: "Error updating todo",
          description: "Contract not initialized. Please reconnect your wallet.",
          variant: "destructive",
        })
        return
      }

      const tx = await contract.toggleCompleted(id)
      await tx.wait()

      toast({
        title: "Todo updated",
        description: "Your todo status has been updated on the blockchain.",
      })

      fetchTodos()
    } catch (error) {
      console.error("Error toggling todo:", error)
      toast({
        title: "Error updating todo",
        description: "There was an error updating your todo on the blockchain.",
        variant: "destructive",
      })
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      if (!contract) {
        toast({
          title: "Error deleting todo",
          description: "Contract not initialized. Please reconnect your wallet.",
          variant: "destructive",
        })
        return
      }
      const tx = await contract.deleteTodo(id)
      await tx.wait()

      toast({
        title: "Todo deleted",
        description: "Your todo has been removed from the blockchain.",
      })

      fetchTodos()
    } catch (error) {
      console.error("Error deleting todo:", error)
      toast({
        title: "Error deleting todo",
        description: "There was an error removing your todo from the blockchain.",
        variant: "destructive",
      })
    }
  }

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed
    if (activeFilter === "completed") return todo.completed
    return true
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="backdrop-blur-lg bg-card/80 border-none shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Web3 Todo App
            </CardTitle>
            <CardDescription>Your decentralized task manager on the blockchain</CardDescription>
          </div>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          {!connected ? (
            <ConnectWallet />
          ) : (
            <>
              <div className="mb-6">
                  <TodoForm onAddTodo={addTodo} />
                  {error && (
                    <div className="mb-4 p-3 text-sm border rounded-lg border-destructive/50 bg-destructive/10 text-destructive">
                      {error}
                    </div>
                  )}                  
              </div>

              <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveFilter(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  {loading ? (
                    <TodoSkeleton />
                  ) : (
                    <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
                  )}
                </TabsContent>

                <TabsContent value="active" className="mt-0">
                  {loading ? (
                    <TodoSkeleton />
                  ) : (
                    <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
                  )}
                </TabsContent>

                <TabsContent value="completed" className="mt-0">
                  {loading ? (
                    <TodoSkeleton />
                  ) : (
                    <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                </p>
                <p>Total tasks: {todos.length}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TodoSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      ))}
    </div>
  )
}

