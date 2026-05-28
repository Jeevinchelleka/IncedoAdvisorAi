import "./globals.css";

export const metadata = {
  title: "AdvisorAI",
  description: "AI-Powered Wealth Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
