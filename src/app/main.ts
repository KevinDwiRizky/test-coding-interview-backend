import { InMemoryUserRepository } from "../infra/InMemoryUserRepository";
import { InMemoryTodoRepository } from "../infra/InMemoryTodoRepository";
import { SimpleScheduler } from "../infra/SimpleScheduler";
import { TodoService } from "../core/TodoService";

async function bootstrap() {
  // Wire up dependencies
  const userRepo = new InMemoryUserRepository();
  const todoRepo = new InMemoryTodoRepository();
  const scheduler = new SimpleScheduler();
  const todoService = new TodoService(todoRepo, userRepo);

  console.log("Todo Reminder Service - Bootstrap Complete");
  console.log("Repositories and services initialized.");
  console.log("Note: HTTP server implementation left for candidate to add.");

  // Candidate should implement HTTP server here
  // Example: scheduler.scheduleRecurring('reminder-check', 60000, () => todoService.processReminders());

  // TODO: Implement HTTP server with the following routes:
  // POST /users - Create a new user
  // GET /users/:id - Get user by ID
  // POST /todos - Create a new todo
  // GET /todos/:id - Get todo by ID
  // PUT /todos/:id - Update a todo
  // DELETE /todos/:id - Delete a todo
  // GET /users/:userId/todos - Get all todos for a user
  // POST /todos/:id/share - Share a todo with another user
}

bootstrap().catch(console.error);
