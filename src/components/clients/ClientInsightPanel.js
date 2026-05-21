export default function ClientInsightPanel() {
  return (
    <div className="h-full p-6 border-l border-zinc-800 bg-[#0B1120]">
      <h2 className="text-2xl font-bold">AI Client Insights</h2>

      <div className="mt-6 space-y-4">
        <div className="bg-zinc-900 rounded-2xl p-5">
          <h3 className="font-semibold">Opportunity</h3>

          <p className="text-zinc-400 mt-2">
            Sophia Chen may be interested in alternative investments based on
            recent transaction behavior.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5">
          <h3 className="font-semibold">Risk Alert</h3>

          <p className="text-zinc-400 mt-2">
            James Miller exceeds technology concentration threshold.
          </p>
        </div>
      </div>
    </div>
  );
}
