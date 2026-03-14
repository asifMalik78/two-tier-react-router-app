import { eq, desc } from "drizzle-orm";
import { db, todos, initDb } from "~/db.server";
import type { Route } from "./+types/api.todos";

// GET /api/todos
export async function loader({}: Route.LoaderArgs) {
  await initDb();
  const result = await db.select().from(todos).orderBy(desc(todos.created_at));
  return Response.json(result);
}

// POST /api/todos - create, update, delete
export async function action({ request }: Route.ActionArgs) {
  await initDb();
  const method = request.method;

  if (method === "POST") {
    const { title, description } = await request.json();
    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }
    const result = await db.insert(todos).values({
      title: title.trim(),
      description: description?.trim() || null,
    });
    return Response.json({ id: result[0].insertId, title: title.trim(), description: description?.trim() || null, completed: false });
  }

  if (method === "PUT") {
    const { id, title, description, completed } = await request.json();
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }
    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    if (completed !== undefined) updates.completed = completed;
    await db.update(todos).set(updates).where(eq(todos.id, id));
    return Response.json({ success: true });
  }

  if (method === "DELETE") {
    const { id } = await request.json();
    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }
    await db.delete(todos).where(eq(todos.id, id));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
