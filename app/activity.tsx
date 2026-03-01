"use client";
import { useEffect, useRef } from 'react';

const useTabInactivity = (timeout = 12 * 60 * 60 * 1000) => {
    const timeoutId = useRef(null);

    useEffect(() => {
        const resetTimeout = () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            timeoutId.current = setTimeout(() => {
                window.location.reload();
            }, timeout);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                resetTimeout();
            } else {
                if (timeoutId.current) {
                    clearTimeout(timeoutId.current);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, [timeout]);
};

export default useTabInactivity;
