const axios = require('axios');

async function generateLlmAnalysis(walletInsightsInput, userPreferences) {
    const payload = {
        model: 'gemma3:4b',
        prompt: `
        You are a crypto tax advisor and investment analyst.

        You will receive JSON-formatted transaction summary data from a user's crypto trading account.

        Your task is to return only **short, practical, and data-driven insights** based on that data.  
        Do NOT provide general advice. Do NOT assume missing data.  
        Base your answer strictly on what is given.

        Respond in two sections:

        ---

        **Tax Insights** (Max 3 short bullet points)  
        - Must refer to: realized gains/losses, fees, holding period, taxable events.  
        - Use terms like: "capital loss", "offset future gains", "deductible fees", "short holding period", "FIFO impact", etc.

        **Investment Advice** (Max 3 short bullet points)  
        - Must refer to: trade frequency, loss-to-gain ratio, holding duration, etc.  
        - Use terms like: "trading strategy", "accumulated fees", "short-term pattern", "rethink timing-based trades", etc.

        ---

        Use only the data provided. Do NOT reference stocks, bonds, or non-crypto markets.

        Here are some good examples of valid sentences:

        - "High frequency of short-term trades with low profitability suggests overtrading."
        - "Realized losses may be used to offset future capital gains."
        - "Average holding period is 0 days — this eliminates long-term tax benefits."
        - "Fees are significant relative to gains — may be deductible."
        - "High sell-to-buy ratio may reflect an unbalanced or reactive trading strategy."

        ---

        Now analyze this data:


        ${JSON.stringify(walletInsightsInput, null, 2)}

        ${JSON.stringify(userPreferences, null, 2)}
        `,
        stream: false
    };

    try {
        const response = await axios.post('http://ollama:11434/api/generate', payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.response.trim();
    } catch (error) {
        throw new Error('Request to Ollama failed: ' + error.message);
    }
}

module.exports = generateLlmAnalysis;