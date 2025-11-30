import { Todo } from "../domain/Todo";
import { ITodoRepository } from "./ITodoRepository";
import { IUserRepository } from "./IUserRepository";

export class TodoService {
  constructor(
    private todoRepo: ITodoRepository,
    private userRepo: IUserRepository
  ) {}

  async createTodo(data: any): Promise<Todo> {
    if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
      throw new Error("Title is required and cannot be empty or whitespace only");
    }

    const user = await this.userRepo.findById(data.userId);
    if (!user) {
      throw new Error(`User with ID "${data.userId}" not found`);
    }

    const todo = await this.todoRepo.create({
      userId: data.userId,
      title: data.title.trim(),
      description: data.description,
      status: "PENDING",
      remindAt: data.remindAt ? new Date(data.remindAt) : undefined,
    });

    return todo;
  }

  async completeTodo(todoId: string): Promise<Todo> {
    const todo = await this.todoRepo.findById(todoId);

    if (!todo) {
      throw new Error(`Todo with ID "${todoId}" not found`);
    }

    const updated = await this.todoRepo.update(todoId, {
      status: "DONE",
      updatedAt: new Date(),
    });

    if (!updated) {
      throw new Error(`Failed to update todo with ID "${todoId}"`);
    }

    return updated;
  }

  async getTodosByUser(userId: string): Promise<Todo[]> {
    return this.todoRepo.findByUserId(userId);
  }

  async processReminders(): Promise<void> {
    const now = new Date();
    const dueTodos = await this.todoRepo.findDueReminders(now);

    for (const todo of dueTodos) {
      if (todo.status === "PENDING") {
        try {
          await this.todoRepo.update(todo.id, {
            status: "REMINDER_DUE",
            updatedAt: new Date(),
          });
        } catch (error) {
          console.error(`Failed to process reminder for todo ${todo.id}:`, error);
        }
      }
    }
  }
}
