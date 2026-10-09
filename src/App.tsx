import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { MarketingLayout } from './components/layout/MarketingLayout';
import Landing from './pages/Landing';

const Pricing = lazy(() => import('./pages/Pricing'));
const DemoHub = lazy(() => import('./pages/DemoHub'));
const Connect = lazy(() => import('./pages/Connect'));
const RequestPilot = lazy(() => import('./pages/RequestPilot'));
const Insights = lazy(() => import('./pages/Insights'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/app/Home'));
const Portfolio = lazy(() => import('./pages/app/Portfolio'));
const SiteDetail = lazy(() => import('./pages/app/SiteDetail'));
const Maintenance = lazy(() => import('./pages/app/Maintenance'));

function ScrollManager() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
      const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 400);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, search]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
        <Routes>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<DemoHub />} />
            <Route path="/pilot" element={<RequestPilot />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/connect" element={<Connect />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/app" element={<AppShell />}>
            <Route path="home" element={<Home />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="site/:id" element={<SiteDetail />} />
            <Route path="maintenance" element={<Maintenance />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
