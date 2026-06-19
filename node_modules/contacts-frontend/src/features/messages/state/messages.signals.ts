import { signal } from '@preact/signals-react';

export type Message = {
  id: string;
  _id?: string;
  from: string;
  to: string;
  content: string;
  createdAt?: string;
  pending?: boolean;
};

export const messagesSignal = signal<Message[]>([]);
export const presenceSignal = signal<Record<string, boolean>>({});
export const messagingConnectedSignal = signal(false);
export const messagingErrorSignal = signal<string | null>(null);
