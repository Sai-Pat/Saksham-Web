import { useState, useEffect } from 'react';

const QUEUE_KEY = 'offline_upload_queue';

export const useOfflineQueue = () => {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const savedQueue = localStorage.getItem(QUEUE_KEY);
        if (savedQueue) {
            setQueue(JSON.parse(savedQueue));
        }
    }, []);

    const addToQueue = (item) => {
        const newQueue = [...queue, { ...item, id: Date.now(), timestamp: new Date().toISOString() }];
        setQueue(newQueue);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    };

    const removeFromQueue = (id) => {
        const newQueue = queue.filter(item => item.id !== id);
        setQueue(newQueue);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(newQueue));
    };

    const clearQueue = () => {
        setQueue([]);
        localStorage.removeItem(QUEUE_KEY);
    };

    const sync = async () => {
        // Simulate syncing
        console.log('Syncing queue...', queue);
        await new Promise(resolve => setTimeout(resolve, 1000));
        clearQueue();
        return true;
    };

    return {
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        sync,
        queueLength: queue.length
    };
};
