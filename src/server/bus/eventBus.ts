import { EventMessage } from '../types/index.js';

export type EventCallback = (event: EventMessage) => Promise<void> | void;

/**
 * Sovereign Event Bus
 * Models Kafka-style pub/sub architecture partitioned by nation_id.
 * Satisfies PRD §6 and Architecture ADR-001 (cloud-agnostic, portable).
 */
export class SovereignEventBus {
  private static instance: SovereignEventBus;
  private subscribers: Map<string, EventCallback[]> = new Map();
  private eventLog: EventMessage[] = [];
  private maxLogSize: number = 500;

  private constructor() {}

  public static getInstance(): SovereignEventBus {
    if (!SovereignEventBus.instance) {
      SovereignEventBus.instance = new SovereignEventBus();
    }
    return SovereignEventBus.instance;
  }

  /**
   * Subscribe to a topic
   */
  public subscribe(topic: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(topic) || [];
      this.subscribers.set(topic, callbacks.filter((cb) => cb !== callback));
    };
  }

  /**
   * Publish an event to the bus
   */
  public async publish(topic: string, nation_id: string, payload: any): Promise<EventMessage> {
    const event: EventMessage = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      topic,
      nation_id,
      payload,
      timestamp: new Date().toISOString(),
    };

    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    const callbacks = this.subscribers.get(topic) || [];
    // Fan out asynchronously to all subscribers
    for (const callback of callbacks) {
      try {
        await callback(event);
      } catch (err) {
        console.error(`[EventBus] Error handling topic ${topic}:`, err);
      }
    }

    return event;
  }

  /**
   * Get recent events (optionally filtered by nation_id or topic)
   */
  public getEvents(nation_id?: string, topic?: string): EventMessage[] {
    return this.eventLog.filter((e) => {
      if (nation_id && e.nation_id !== nation_id) return false;
      if (topic && e.topic !== topic) return false;
      return true;
    });
  }

  /**
   * Clear event log (for testing)
   */
  public clear(): void {
    this.eventLog = [];
    this.subscribers.clear();
  }
}
