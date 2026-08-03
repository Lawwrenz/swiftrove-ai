import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { CommandCenterProvider } from './context/CommandCenterContext';
import { SwiftProvider } from './context/SwiftContext';
import { AuthGuard, PublicRoute } from './components/AuthGuard';
import Layout from './components/Layout';
import { Skeleton } from './components/ui';
import { PageTransition } from './components/micro';
import NotFound from './pages/NotFound';

// Auth pages
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Landing page
const Landing = lazy(() => import('./pages/Landing'));

// Lazy-loaded protected pages
const CustomerSuccess = lazy(() => import('./pages/CustomerSuccess'));
const CustomerIntelligenceProfile = lazy(() => import('./pages/CustomerIntelligenceProfile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AutomationStudio = lazy(() => import('./pages/AutomationStudio'));
const AIWorkforce = lazy(() => import('./pages/AIWorkforce'));
const AIWorkflowEngine = lazy(() => import('./pages/AIWorkflowEngine'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const Customers = lazy(() => import('./pages/Customers'));
const Orders = lazy(() => import('./pages/Orders'));
const Payments = lazy(() => import('./pages/Payments'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
      <Skeleton variant="card" className="h-64" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
        <SidebarProvider>
          <CommandCenterProvider>
            <SwiftProvider>
              <Routes>
                {/* Public landing page */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Landing />
                    </Suspense>
                  }
                />

                {/* Public auth routes */}
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PublicRoute><Login /></PublicRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PublicRoute><SignUp /></PublicRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <PublicRoute><ForgotPassword /></PublicRoute>
                    </Suspense>
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ResetPassword />
                    </Suspense>
                  }
                />

                {/* Protected app routes */}
                <Route element={
                  <AuthGuard>
                    <Layout />
                  </AuthGuard>
                }>
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Dashboard /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/automation-studio"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><AutomationStudio /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/ai-workforce"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><AIWorkforce /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/ai-workflow-engine"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><AIWorkflowEngine /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/knowledge-graph"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><KnowledgeGraph /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Customers /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Orders /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Payments /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Analytics /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customer-success"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><CustomerSuccess /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/customer-intelligence/:id"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><CustomerIntelligenceProfile /></PageTransition>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PageTransition><Settings /></PageTransition>
                      </Suspense>
                    }
                  />
                </Route>

                {/* Protected catch-all */}
                <Route path="*" element={
                  <AuthGuard>
                    <Layout />
                  </AuthGuard>
                }>
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <NotFound />
                      </Suspense>
                    }
                  />
                </Route>
              </Routes>
            </SwiftProvider>
          </CommandCenterProvider>
        </SidebarProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}