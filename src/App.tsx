import React, { useState } from "react";
import Layout from "./components/Layout";
import DashboardView from "./views/DashboardView";
import ParticipantesView from "./views/ParticipantesView";
import RoletaView from "./views/RoletaView";
import SorteiosView from "./views/SorteiosView";
import IndicacoesView from "./views/IndicacoesView";
import VouchersView from "./views/VouchersView";
import MensagensView from "./views/MensagensView";
import WhatsAppView from "./views/WhatsAppView";
import AssistenteView from "./views/AssistenteView";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedTurmaId, setSelectedTurmaId] = useState<string | null>(null);

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView
            onNavigate={setCurrentView}
            onSelectTurma={setSelectedTurmaId}
          />
        );
      case "participantes":
        return <ParticipantesView turmaId={selectedTurmaId} />;
      case "roleta":
        return <RoletaView turmaId={selectedTurmaId} />;
      case "sorteios":
        return <SorteiosView turmaId={selectedTurmaId} />;
      case "indicacoes":
        return <IndicacoesView />;
      case "vouchers":
        return <VouchersView />;
      case "mensagens":
        return <MensagensView turmaId={selectedTurmaId} />;
      case "whatsapp":
        return <WhatsAppView />;
      case "assistente":
        return <AssistenteView />;
      default:
        return (
          <DashboardView
            onNavigate={setCurrentView}
            onSelectTurma={setSelectedTurmaId}
          />
        );
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      selectedTurmaId={selectedTurmaId}
      onSelectTurma={setSelectedTurmaId}
    >
      {renderView()}
    </Layout>
  );
}
