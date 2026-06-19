import { useSyncExternalStore } from 'react';
import type { ReadonlySignal, Signal } from '@preact/signals-react';

type SubscribableSignal<T> = Signal<T> | ReadonlySignal<T>;

export function useSignalValue<T>(source: SubscribableSignal<T>): T {
  return useSyncExternalStore(
    (onStoreChange) => source.subscribe(() => onStoreChange()),
    () => source.value,
    () => source.value,
  );
}
