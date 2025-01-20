// priorityWorker.js
const PREMIUM_BASE_SCORE = 15;
const STANDARD_BASE_SCORE = 10;
const WAITING_TIME_WEIGHT = 0.5;

self.onmessage = (e) => {
    const { orders, currentTime } = e.data;

    const ordersWithPriority = orders.map(order => {
        const baseScore = order.isPremium ? PREMIUM_BASE_SCORE : STANDARD_BASE_SCORE;
        const waitingTime = (currentTime - new Date(order.orderdate).getTime()) / 1000;
        const priorityScore = baseScore + (waitingTime * WAITING_TIME_WEIGHT);

        return {
            ...order,
            priorityScore
        };
    });

    // Sort by priority score
    ordersWithPriority.sort((a, b) => b.priorityScore - a.priorityScore);

    self.postMessage(ordersWithPriority);
};