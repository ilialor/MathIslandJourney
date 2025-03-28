import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryProvider } from "./lib/query-provider";
// Temporarily commented out for debugging
// import { AuthProvider } from './hooks/use-auth';

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);
