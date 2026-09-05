import { useCallback, useRef, useState } from "react";

// File d'attente de notifications éphémères (auto-disparition après 4 s).
// tone : "info" | "success" | "error".
export function useToasts() {
    const [toasts, setToasts] = useState([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    }, []);

    const push = useCallback(
        (message, tone = "info") => {
            const id = nextId.current++;
            setToasts((list) => [...list, { id, message, tone }]);
            setTimeout(() => dismiss(id), 4000);
        },
        [dismiss]
    );

    return { toasts, push, dismiss };
}
