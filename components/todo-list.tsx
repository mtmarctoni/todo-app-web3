"use client"

import type { Todo } from "@/types/todo"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">No tasks found</h3>
        <p className="text-muted-foreground">Add a new task to get started</p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-lg bg-card border"
          >
            <div className="flex items-center space-x-3">
              <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {todo.content}
              </label>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(todo.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

