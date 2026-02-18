async function generateProfitAndLossReport(walletInfo) {
    let totalBuyAmount = 0;
    let totalSellAmount = 0;
    let totalFees = 0;
    let currentHoldings = 0;
    
    const sortedTransactions = [...walletInfo.transactions].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );

    const startDate = sortedTransactions[0]?.timestamp || "0000-00-00T00:00:00.000Z";
    const endDate = sortedTransactions[sortedTransactions.length - 1]?.timestamp || "0000-00-00T00:00:00.000Z";

    walletInfo.transactions.forEach(tx => {
        if (tx.type === "receive") {
            totalBuyAmount += tx.amount;
            currentHoldings += tx.amount;
        } else if (tx.type === "send") {
            totalSellAmount += tx.amount;
            currentHoldings -= tx.amount;
        }
        totalFees += tx.fee || 0;
    });

    const totalRealizedLoss = Math.abs(totalSellAmount - totalBuyAmount - totalFees);

    const portfolioReturnPercent = totalBuyAmount > 0 ? 
        ((totalSellAmount - totalBuyAmount) / totalBuyAmount) * 100 : 0;

    return {
        Gains: +totalSellAmount.toFixed(8),
        Loss: +totalRealizedLoss.toFixed(8),
        Fees: +totalFees.toFixed(8),
        startDate,
        endDate,
        currentHoldings: +currentHoldings.toFixed(8),
        portfolioReturnPercent: +portfolioReturnPercent.toFixed(2)
    };
}

module.exports = generateProfitAndLossReport;