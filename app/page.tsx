import TodoApp from "@/components/todo-app"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <TodoApp />
      </div>
    </main>
  )
}

