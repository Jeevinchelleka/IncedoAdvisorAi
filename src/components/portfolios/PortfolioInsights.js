export default function PortfolioInsights() {
  return (
    <div className="h-full bg-[#0B1120] border-l border-zinc-800 p-6">
      <h2 className="text-2xl font-bold">AI Portfolio Insights</h2>

      <div className="mt-6 space-y-4">
        <div className="bg-zinc-900 rounded-2xl p-5">
          <h3 className="font-semibold">Rebalancing Suggestion</h3>

          <p className="text-zinc-400 mt-2">
            Reduce TSLA allocation by 4% to lower concentration risk.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5">
          <h3 className="font-semibold">Opportunity Detection</h3>

          <p className="text-zinc-400 mt-2">
            Emerging market ETF exposure could improve diversification.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5">
          <h3 className="font-semibold">Risk Warning</h3>

          <p className="text-zinc-400 mt-2">
            Crypto volatility increased 14% this week.
          </p>
        </div>
      </div>
    </div>
  );
}
