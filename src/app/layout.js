import "./globals.css";

export const metadata = {
  title: "AdvisorAI",
  description: "AI Financial Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
