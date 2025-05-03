
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import TournamentDetails from "./pages/TournamentDetails";
import NotFound from "./pages/NotFound";
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
          <Route path="tournament/:id" element={<TournamentDetails />} />
        </Route>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </PWALayoutWrapper>
  );
}

export default App;
