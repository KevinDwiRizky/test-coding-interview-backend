import express from "express";
import { InMemoryUserRepository } from "../infra/InMemoryUserRepository";
import { InMemoryTodoRepository } from "../infra/InMemoryTodoRepository";
import { SimpleScheduler } from "../infra/SimpleScheduler";
import { TodoService } from "../core/TodoService";
import { TodoHandlers } from "./handlers";

async function bootstrap() {
  const userRepo = new InMemoryUserRepository();
  const todoRepo = new InMemoryTodoRepository();
  const scheduler = new SimpleScheduler();
  const todoService = new TodoService(todoRepo, userRepo);

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  const handlers = new TodoHandlers(todoService, userRepo);

  app.post("/users", (req, res) => handlers.createUser(req, res));
  app.post("/todos", (req, res) => handlers.createTodo(req, res));
  app.get("/todos", (req, res) => handlers.getTodos(req, res));
  app.patch("/todos/:id/complete", (req, res) => handlers.completeTodo(req, res));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  scheduler.scheduleRecurring("reminder-processing", 30000, async () => {
    await todoService.processReminders();
  });

  app.listen(PORT, () => {
    console.log(`Todo Reminder Service running on port ${PORT}`);
    console.log("Repositories and services initialized.");
    console.log("Reminder processing scheduled every 30 seconds.");
  });

  process.on("SIGINT", () => {
    console.log("\nShutting down gracefully...");
    scheduler.stop("reminder-processing");
    process.exit(0);
  });
}

bootstrap().catch(console.error);
