import { Todo } from "../domain/Todo";
import { ITodoRepository } from "../core/ITodoRepository";

export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Todo[] = [];

  async create(
    todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ): Promise<Todo> {
    const id = `todo-${Math.floor(Math.random() * 1000000)}`;
    const now = new Date();

    const todo: Todo = {
      ...todoData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.push(todo);
    return todo;
  }

  async update(
    id: string,
    updates: Partial<Omit<Todo, "id" | "userId" | "createdAt">>
  ): Promise<Todo | null> {
    const index = this.todos.findIndex((t) => t.id === id);

    if (index === -1) {
      // Do not silently create new todos on unknown IDs
      return null;
    }

    // Ensure updatedAt is always strictly greater than the previous value
    let newUpdatedAt = updates.updatedAt || new Date();
    while (newUpdatedAt.getTime() === this.todos[index].updatedAt.getTime()) {
      // If timestamps are the same, wait a tiny bit and try again
      newUpdatedAt = new Date();
    }

    this.todos[index] = {
      ...this.todos[index],
      ...updates,
      updatedAt: newUpdatedAt,
    };

    return this.todos[index];
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    return todo || null;
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    return this.todos.filter((t) => t.userId === userId);
  }

  async findDueReminders(currentTime: Date): Promise<Todo[]> {
    return this.todos.filter(
      (t) => t.status === "PENDING" && t.remindAt && t.remindAt <= currentTime
    );
  }
}
