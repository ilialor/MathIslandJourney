import React, { useEffect } from 'react';
import RootLayout from '@/components/layout/RootLayout';
import { Switch, Route, useLocation, Redirect } from 'wouter';
import NavigationView from './navigation-view';
import LessonView from './lesson-view';
import PracticeView from './practice-view';
import TeachView from './teach-view';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animation-utils';

export default function HomePage() {
  const [location, setLocation] = useLocation();
  
  // If this is the home route, navigate to the navigation view
  useEffect(() => {
    if (location === '/') {
      setLocation('/navigation');
    }
  }, [location, setLocation]);
  
  return (
    <RootLayout>
      <motion.div {...fadeIn}>
        <Switch>
          <Route path="/navigation" component={NavigationView} />
          <Route path="/topic/:id" component={NavigationView} />
          <Route path="/learn/:id" component={LessonView} />
          <Route path="/practice/:id" component={PracticeView} />
          <Route path="/teach/:id" component={TeachView} />
        </Switch>
      </motion.div>
    </RootLayout>
  );
}
