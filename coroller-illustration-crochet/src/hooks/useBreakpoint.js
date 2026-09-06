import { useEffect, useState } from "react";

// Breakpoints du site (largeur de fenêtre).
export const MOBILE = 600;
export const TABLET = 900;

const read = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    return { isMobile: w <= MOBILE, isTablet: w <= TABLET, width: w };
};

// Renvoie { isMobile, isTablet, width }. Ne re-rend que quand on franchit
// une limite (pas à chaque pixel de resize).
export function useBreakpoint() {
    const [bp, setBp] = useState(read);

    useEffect(() => {
        const onResize = () =>
            setBp((prev) => {
                const next = read();
                return next.isMobile === prev.isMobile && next.isTablet === prev.isTablet
                    ? prev
                    : next;
            });
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return bp;
}
