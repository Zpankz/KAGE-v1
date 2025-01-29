import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { GraphProvider } from "./contexts/GraphContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { Layout } from "./components/Layout"
import { Dashboard } from "./pages/Dashboard"
import { Data } from "./pages/Data"
import { LLMSettings } from "./pages/LLMSettings"
import { GraphViewer } from "./pages/GraphViewer"
import { Help } from "./pages/Help"
import { Schema } from "./pages/Schema"
import { Topics } from "./pages/Topics"
import { Settings } from "./pages/Settings"
import { GraphAnalytics } from "./pages/GraphAnalytics"

export default function App() {
  return (
    <AuthProvider>
      <GraphProvider>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="data" element={<Data />} />
                <Route path="schema" element={<Schema />} />
                <Route path="topics" element={<Topics />} />
                <Route path="viewer" element={<GraphViewer />} />
                <Route path="llm" element={<LLMSettings />} />
                <Route path="help" element={<Help />} />
                <Route path="settings" element={<Settings />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="graph" element={<GraphAnalytics />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </ThemeProvider>
      </GraphProvider>
    </AuthProvider>
  )
}