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
import Landing from "./pages/Landing";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function App() {
  const { currentUser } = useAuth();

  return (
    <PWALayoutWrapper>
      <Routes>
        {/* Landing page redirects based on auth status */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth page - redirects to home if already logged in */}
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes inside main layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={
            currentUser ? <Index /> : <Navigate to="/auth" replace />
          } />
          <Route path="/tournament/create" element={<TournamentCreate />} />
          <Route path="/tournament/:id" element={<TournamentDetails />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/terms-and-privacy" element={<TermsAndPolicy />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </PWALayoutWrapper>
  );
}

export default App;
