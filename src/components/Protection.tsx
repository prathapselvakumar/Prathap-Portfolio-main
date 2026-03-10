'use client';

import { useEffect, useState } from 'react';

export function Protection() {
    const [isProtected, setIsProtected] = useState(false);

    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        // Disable keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent Print Screen
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                e.preventDefault();
                // Clear clipboard to prevent paste
                try {
                    navigator.clipboard.writeText('Protected Content');
                } catch (err) {
                    console.error('Clipboard access failed', err);
                }
                setIsProtected(true);
                setTimeout(() => setIsProtected(false), 2000);
                return false;
            }

            // Prevent Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+S, Ctrl+P, Ctrl+U, Ctrl+A
            if (e.ctrlKey || e.metaKey) {
                if (
                    ['c', 'x', 'v', 's', 'p', 'u', 'a'].includes(e.key.toLowerCase())
                ) {
                    e.preventDefault();
                    return false;
                }
            }

            // Prevent Inspect Element (Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J, F12)
            if (
                (e.ctrlKey && e.shiftKey && ['i', 'c', 'j'].includes(e.key.toLowerCase())) ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                return false;
            }
        };

        // Aggressive hiding when focus is lost
        const handleBlur = () => {
            setIsProtected(true);
            document.documentElement.classList.add('is-protected');
        };

        const handleFocus = () => {
            setIsProtected(false);
            document.documentElement.classList.remove('is-protected');
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsProtected(true);
                document.documentElement.classList.add('is-protected');
            } else {
                // Keep it protected for a split second after returning
                setTimeout(() => {
                    setIsProtected(false);
                    document.documentElement.classList.remove('is-protected');
                }, 100);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.documentElement.classList.remove('is-protected');
        };
    }, []);

    return (
        <>
            <style jsx global>{`
                .is-protected body {
                    filter: blur(40px) brightness(0.2) !important;
                    user-select: none !important;
                    pointer-events: none !important;
                    opacity: 0 !important;
                    transition: opacity 0.1s ease-out, filter 0.1s ease-out !important;
                }
                
                #privacy-shield {
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    pointer-events: all;
                    flex-direction: column;
                    gap: 1.5rem;
                    color: white;
                    text-align: center;
                    padding: 2rem;
                }

                .shield-noise {
                    position: absolute;
                    inset: 0;
                    opacity: 0.1;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    pointer-events: none;
                }
            `}</style>
            
            {isProtected && (
                <div id="privacy-shield">
                    <div className="shield-noise" />
                    <div className="relative z-10 space-y-4">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl md:text-4xl font-bold tracking-tighter">Content Protected</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto text-sm md:text-base">
                            This content is protected against screen capture and unauthorized access. 
                            Please return to the window to view.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
