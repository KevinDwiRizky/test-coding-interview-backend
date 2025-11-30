import { IScheduler } from "../core/IScheduler";

export class SimpleScheduler implements IScheduler {
  private intervals = new Map<string, NodeJS.Timeout>();

  scheduleRecurring(
    name: string,
    intervalMs: number,
    fn: () => void | Promise<void>
  ): void {
    // Stop any existing interval with the same name to avoid duplicates
    if (this.intervals.has(name)) {
      console.warn(`Scheduler: Stopping existing interval for task "${name}"`);
      this.stop(name);
    }

    const interval = setInterval(async () => {
      try {
        await fn();
      } catch (error) {
        // Log error but don't crash the process
        console.error(`Scheduler: Error in task "${name}":`, error);
      }
    }, intervalMs);

    this.intervals.set(name, interval);
    console.log(`Scheduler: Task "${name}" scheduled to run every ${intervalMs}ms`);
  }

  stop(name: string): void {
    const interval = this.intervals.get(name);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(name);
      console.log(`Scheduler: Task "${name}" stopped`);
    }
  }
}
