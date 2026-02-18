function generateActionReport(walletInfo) {
    let totalActions = walletInfo.transactions.length;
    let tradingVolume = 0;
    let buyActions = 0;
    let sellActions = 0;
    let tradeSizes = [];

    const sortedTransactions = [...walletInfo.transactions].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const firstTx = sortedTransactions[0];
    const lastTx = sortedTransactions[sortedTransactions.length - 1];
    const holdings = new Map(); 
    let holdingPeriods = [];

    walletInfo.transactions.forEach(tx => {
        tradingVolume += tx.amount;
        tradeSizes.push(tx.amount);

        if (tx.type === "receive") {
            buyActions++;
            const holdingStart = new Date(tx.timestamp);
            holdings.set(tx.txid, holdingStart);
        } else if (tx.type === "send") {
            sellActions++;
            for (let [buyTxId, buyDate] of holdings) {
                const holdingEnd = new Date(tx.timestamp);
                const holdDays = (holdingEnd - buyDate) / (1000 * 60 * 60 * 24);
                holdingPeriods.push(holdDays);
                holdings.delete(buyTxId);
                break; 
            }
        }
    });

    const avgHoldDuration = holdingPeriods.length > 0 
        ? holdingPeriods.reduce((a, b) => a + b, 0) / holdingPeriods.length 
        : 0;

    return {
        chain: walletInfo.coin,
        calculationMethod: "FIFO",
        totalActions,
        tradingVolume,
        buyActions,
        sellActions,
        firstTransactionDate: firstTx ? firstTx.timestamp : null,
        lastTransactionDate: lastTx ? lastTx.timestamp : null,
        avgHoldDurationDays: +avgHoldDuration.toFixed(2),
        longestHoldDays: +Math.max(...(holdingPeriods.length ? holdingPeriods : [0])).toFixed(2),
        shortestHoldDays: +Math.min(...(holdingPeriods.length ? holdingPeriods : [0])).toFixed(2),
        avgTradeSize: +(totalActions > 0 ? (tradingVolume / totalActions) : 0).toFixed(8),
        maxTradeSize: +Math.max(...(tradeSizes.length ? tradeSizes : [0])).toFixed(8),
        minTradeSize: +Math.min(...(tradeSizes.length ? tradeSizes : [0])).toFixed(8)
    };
}

module.exports = generateActionReport;