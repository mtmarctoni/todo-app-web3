"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { motion } from "framer-motion"

interface TodoFormProps {
  onAddTodo: (content: string) => void
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      await onAddTodo(content)
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1"
        disabled={isSubmitting}
      />
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </motion.div>
    </form>
  )
}

