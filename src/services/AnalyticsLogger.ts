import { IAnalyticsEvent } from "../types/interfaces";

export class AnalyticsLogger {
  static logEvent(event: IAnalyticsEvent): void {
    const timestamp = new Date(event.timestamp).toISOString();
    const logMessage = `[${timestamp}] ${event.eventType}: ${event.details}`;

    if (event.componentId !== undefined) {
      console.log(`${logMessage} (Component: ${event.componentId})`);
    } else {
      console.log(logMessage);
    }

    console.table({
      Event: event.eventType,
      Component: event.componentId || "N/A",
      Details: event.details,
      Time: timestamp,
    });
  }
}
