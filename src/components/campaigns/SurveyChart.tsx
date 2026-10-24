import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Same palette and options as the test_1.html smart chart generator.
const PALETTE = ["#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899"];

export function SurveyChart({ kind, data }: { kind: "doughnut" | "bar"; data: { label: string; value: number }[] }) {
  const chartData = { labels: data.map((d) => d.label), datasets: [{ data: data.map((d) => d.value), backgroundColor: PALETTE, borderRadius: 6 }] };
  if (kind === "doughnut") {
    return <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } } }} />;
  }
  return (
    <Bar data={chartData} options={{
      responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
        x: { ticks: { font: { size: 9 }, callback(_v, i) { const l = String(this.getLabelForValue(i)); return l.length > 15 ? `${l.substring(0, 12)}...` : l; } } },
      },
    }} />
  );
}
