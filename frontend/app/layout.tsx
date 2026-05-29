import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FESF-SUS | Sistema de Gestão",
  description: "Sistema de gerenciamento de pacientes e consultas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <nav>
          <div className="nav-container">
            <a href="/" className="nav-logo">🏥 FESF-SUS</a>
            <div className="nav-links">
              <a href="/pacientes">Pacientes</a>
              <a href="/consultas">Consultas</a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
