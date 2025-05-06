import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import TournamentDetails from "./pages/TournamentDetails";
import TournamentCreate from "./pages/TournamentCreate";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TermsAndPolicy from "./pages/TermsAndPolicy";
import Layout from "./components/Layout";
import PWALayoutWrapper from "./components/PWALayoutWrapper";
import { Toaster } from "./components/ui/toaster";
import "./App.css";

function App() {
  return (
    <PWALayoutWrapper>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/tournament/create" element={<TournamentCreate />} />
          <Route path="/tournament/:id" element={<TournamentDetails />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms-and-privacy" element={<TermsAndPolicy />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </PWALayoutWrapper>
  );
}

export default App;
