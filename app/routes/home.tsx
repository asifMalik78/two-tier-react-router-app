import { useEffect, useState } from "react";
import type { Route } from "./+types/home";

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
}

const API = "/api/todos";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Todo App" },
    { name: "description", content: "A minimal todo app" },
  ];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const res = await fetch(API);
    const data = await res.json();
    setTodos(data);
    setLoading(false);
  }

  async function addTodo() {
    if (!title.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    fetchTodos();
  }

  async function toggleComplete(todo: Todo) {
    await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    fetchTodos();
  }

  async function deleteTodo(id: number) {
    await fetch(API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTodos();
  }

  async function updateTodo(id: number) {
    if (!editTitle.trim()) return;
    await fetch(API, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editTitle, description: editDescription }),
    });
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    fetchTodos();
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
          Powerful Todo App
        </h1>

        <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="flex flex-col gap-2 mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
            >
              Add
            </button>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
          />
        </form>

        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-sm text-gray-400">No todos yet. Add one above.</p>
        ) : (
          <ul className="space-y-1">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                <button
                  onClick={() => toggleComplete(todo)}
                  className={`w-5 h-5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-gray-900 border-gray-900 dark:bg-gray-100 dark:border-gray-100"
                      : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-2.5 h-2.5 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex flex-col gap-1.5">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateTodo(todo.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                      className="w-full px-2 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateTodo(todo.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      placeholder="Description (optional)"
                      className="w-full px-2 py-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded text-xs text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateTodo(todo.id)}
                        className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-sm ${
                          todo.completed
                            ? "line-through text-gray-400 dark:text-gray-600"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <p
                          className={`text-xs mt-0.5 ${
                            todo.completed
                              ? "line-through text-gray-300 dark:text-gray-700"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {todo.description}
                        </p>
                      )}
                    </div>
                    <div className="hidden group-hover:flex gap-1 shrink-0">
                      <button
                        onClick={() => startEdit(todo)}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1.5 py-0.5"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-xs text-gray-400 hover:text-red-500 px-1.5 py-0.5"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <p className="mt-6 text-xs text-gray-400">
            {todos.filter((t) => t.completed).length} of {todos.length} completed
          </p>
        )}
      </div>
    </div>
  );
}
