import { signal } from '@preact/signals-react';

export const messagesSignal = signal<any[]>([]);
export const presenceSignal = signal<Record<string, boolean>>({});
