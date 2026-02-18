const fetchWalletData = require('../../externals/abstractLayersForAPI/fetchWalletData/fetchWalletData');
const generateActionReport = require('./generateActionReport');
const generateProfitAndLossReport = require('./generateProfitAndLossReport');
const generateLlmAnalysis = require('./generateLlmAnalysis');
const getUserPreferencesByUsername = require('../user/getUserPreferencesByUsername');

async function generateReport(username, walletAddress, chain) {
    const walletData = await fetchWalletData(walletAddress, chain);
    const userPreferences = await getUserPreferencesByUsername(username);
    
    if (!walletData) throw new Error('Failed to fetch wallet data');

    const actions = await generateActionReport(walletData);
    const pnl = await generateProfitAndLossReport(walletData);
    const llmAnalysis = await generateLlmAnalysis(walletData, userPreferences);

    return {
        balances: walletData.balances,
        actions: actions,
        profitAndLoss: pnl,
        insights: llmAnalysis,
    };
}

module.exports = generateReport;