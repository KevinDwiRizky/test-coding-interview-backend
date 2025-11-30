import { Request, Response } from "express";
import { TodoService } from "../core/TodoService";
import { IUserRepository } from "../core/IUserRepository";

export class TodoHandlers {
  constructor(
    private todoService: TodoService,
    private userRepo: IUserRepository
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, name } = req.body;

      if (!email || typeof email !== "string" || !email.trim()) {
        res.status(400).json({ error: "Email is required and cannot be empty" });
        return;
      }

      if (!name || typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "Name is required and cannot be empty" });
        return;
      }

      const user = await this.userRepo.create({
        email: email.trim(),
        name: name.trim(),
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }

  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const { userId, title, description, remindAt } = req.body;

      if (!userId || typeof userId !== "string") {
        res.status(400).json({ error: "userId is required and must be a string" });
        return;
      }

      const todo = await this.todoService.createTodo({
        userId,
        title,
        description,
        remindAt,
      });

      res.status(201).json(todo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("User with ID") && message.includes("not found")) {
        res.status(404).json({ error: message });
      } else if (message.includes("Title is required")) {
        res.status(400).json({ error: message });
      } else {
        console.error("Error creating todo:", error);
        res.status(500).json({ error: "Failed to create todo" });
      }
    }
  }

  async getTodos(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;

      if (!userId || typeof userId !== "string") {
        res.status(400).json({ error: "userId query parameter is required" });
        return;
      }

      const todos = await this.todoService.getTodosByUser(userId);
      res.status(200).json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  }

  async completeTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const todo = await this.todoService.completeTodo(id);
      res.status(200).json(todo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.includes("not found")) {
        res.status(404).json({ error: message });
      } else {
        console.error("Error completing todo:", error);
        res.status(500).json({ error: "Failed to complete todo" });
      }
    }
  }
}
