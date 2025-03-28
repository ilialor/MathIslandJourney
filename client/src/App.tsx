import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NavigationView from "@/pages/navigation-view";
import LessonView from "@/pages/lesson-view";
import TestView from "@/pages/test-view";
import PracticeView from "@/pages/practice-view";
import TeachView from "@/pages/teach-view";
import ParentDashboard from "@/pages/parent-dashboard";
import PlayPage from "@/pages/play-page";
import RewardsPage from "@/pages/rewards-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import { QueryProvider } from "@/lib/query-provider";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/navigation" component={NavigationView} />
      <ProtectedRoute path="/topic/:id" component={NavigationView} />
      
      {/* Learning Workflow Routes */}
      <ProtectedRoute path="/learn/:id" component={LessonView} />
      <ProtectedRoute path="/test/:id" component={TestView} />
      <ProtectedRoute path="/practice/:id" component={PracticeView} />
      <ProtectedRoute path="/teach/:id" component={TeachView} />
      
      {/* Parent Dashboard Route */}
      <ProtectedRoute path="/parent-dashboard" component={ParentDashboard} />
      
      {/* Bottom Navigation Routes */}
      <ProtectedRoute path="/play" component={PlayPage} />
      <ProtectedRoute path="/rewards" component={RewardsPage} />
      <ProtectedRoute path="/profile" component={ParentDashboard} /> {/* Use parent dashboard as profile for now */}
      
      {/* Catch-all for 404 */}
      <Route path="/:rest*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
