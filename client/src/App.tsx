import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NavigationView from "@/pages/navigation-view";
import LessonView from "@/pages/lesson-view";
import PracticeView from "@/pages/practice-view";
import TeachView from "@/pages/teach-view";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={HomePage} />
      <Route path="/navigation" component={NavigationView} />
      <Route path="/topic/:id" component={NavigationView} />
      <Route path="/learn/:id" component={LessonView} />
      <Route path="/practice/:id" component={PracticeView} />
      <Route path="/teach/:id" component={TeachView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
