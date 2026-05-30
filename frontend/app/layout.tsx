// ============================================================
// Layout principal da aplicação
// Este componente envolve todas as páginas e define
// a estrutura base: barra de navegação + conteúdo
// ============================================================

import type { Metadata } from "next";
import "./globals.css"; // estilos globais da aplicação

// Metadados da aplicação — aparecem na aba do navegador
export const metadata: Metadata = {
  title: "FESF-SUS | Sistema de Gestão",
  description: "Sistema de gerenciamento de pacientes e consultas - FESF-SUS",
};

// Componente raiz que envolve todas as páginas
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Barra de navegação superior */}
        <nav>
          <div className="nav-container">
            {/* Logo com link para o dashboard */}
            <a href="/" className="nav-logo">🏥 FESF-SUS</a>

            {/* Links de navegação entre páginas */}
            <div className="nav-links">
              <a href="/pacientes">Pacientes</a>
              <a href="/consultas">Consultas</a>
            </div>
          </div>
        </nav>

        {/* Conteúdo de cada página é renderizado aqui */}
        <main>{children}</main>
      </body>
    </html>
  );
}
