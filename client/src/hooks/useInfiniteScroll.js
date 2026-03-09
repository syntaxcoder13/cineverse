import { useEffect, useRef, useState, useCallback } from 'react';

export function useInfiniteScroll(callback, hasMore = true, loading = false) {
    const observer = useRef(null);
    const sentinelRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    callback();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, callback]
    );

    return sentinelRef;
}
