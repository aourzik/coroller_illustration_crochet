import { useCallback, useRef, useState } from "react";

// File d'attente de notifications éphémères.
// push(message, tone?, options?)
//   tone    : "info" | "success" | "error"
//   options : { duration?: ms, action?: { label, onClick } }
export function useToasts() {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(1);
    const timers = useRef(new Map());

    const dismiss = useCallback((id) => {
        const t = timers.current.get(id);
        if (t) {
            clearTimeout(t);
            timers.current.delete(id);
        }
        setToasts((list) => list.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (message, tone = "info", options = {}) => {
            const id = nextId.current++;
            const duration = options.duration ?? 4000;
            setToasts((list) => [...list, { id, message, tone, action: options.action }]);
            timers.current.set(
                id,
                setTimeout(() => dismiss(id), duration)
            );
            return id;
        },
        [dismiss]
    );

    return { toasts, push, dismiss };
}
