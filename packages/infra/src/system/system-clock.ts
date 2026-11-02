import type { Clock } from "@cashpilot/application";

/** L'heure réelle de la machine. */
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
