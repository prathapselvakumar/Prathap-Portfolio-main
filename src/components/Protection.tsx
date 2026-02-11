'use client';

import { useEffect } from 'react';

export function Protection() {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Print Screen (though limited browser support for blocking)
            if (e.key === 'PrintScreen') {
                navigator.clipboard.writeText(''); // Clear clipboard
                return false;
            }

            // Prevent Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+S, Ctrl+P, Ctrl+U
            if (e.ctrlKey || e.metaKey) {
                if (
                    e.key === 'c' ||
                    e.key === 'x' ||
                    e.key === 'v' ||
                    e.key === 's' ||
                    e.key === 'p' ||
                    e.key === 'u'
                ) {
                    e.preventDefault();
                    return false;
                }
            }

            // Prevent Inspect Element (Ctrl+Shift+I, Ctrl+Shift+C, F12)
            if (
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c')) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 select-none hidden">
            {/* Hidden overlay to prevent interaction if needed, but we rely on event listeners */}
        </div>
    );
}
