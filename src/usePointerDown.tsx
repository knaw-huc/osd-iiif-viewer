import type {PointerEvent as ReactPointerEvent} from 'react';
import {hasMoved} from './util/hasMoved';

type PointerDownOptions = {
  onClick?: (event: PointerEvent) => void;
  onDrag?: (event: PointerEvent) => void;
  onDragEnd?: (event: PointerEvent) => void;
  dragThreshold?: number;
  clickTimeLimit?: number;
};

/**
 * Tell a click apart from a drag, and leave the drag itself to the viewer
 */
export function usePointerDown({
  onClick,
  onDrag,
  onDragEnd,
  dragThreshold = 5,
  clickTimeLimit = Infinity,
}: PointerDownOptions) {
  return function handlePointerDown(event: ReactPointerEvent) {
    const from = {x: event.clientX, y: event.clientY};
    const startTime = Date.now();
    const gesture = new AbortController();
    const {signal} = gesture;
    let dragging = false;

    window.addEventListener('pointermove', (move) => {
      const to = {x: move.clientX, y: move.clientY};
      dragging ||= hasMoved(from, to, dragThreshold);
      if (dragging) {
        onDrag?.(move);
      }
    }, {signal});

    window.addEventListener('pointerup', (up) => {
      gesture.abort();
      if (dragging) {
        onDragEnd?.(up);
      } else if (Date.now() - startTime <= clickTimeLimit) {
        onClick?.(up);
      }
    }, {signal});

    window.addEventListener('pointercancel', () => gesture.abort(), {signal});
  };
}
