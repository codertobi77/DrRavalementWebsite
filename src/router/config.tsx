
import { type RouteObject, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import AdminRouteProtection from '../components/admin/AdminRouteProtection';

const Home = lazy(() => import('../pages/home/page'));
const About = lazy(() => import('../pages/about/page'));
const Services = lazy(() => import('../pages/services/page'));
const Portfolio = lazy(() => import('../pages/portfolio/page'));
const Blog = lazy(() => import('../pages/blog/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const BeforeAfter = lazy(() => import('../pages/before-after/page'));
const Booking = lazy(() => import('../pages/booking/page'));
const Careers = lazy(() => import('../pages/careers/page'));
const ClientDashboard = lazy(() => import('../pages/client-dashboard/page'));
const ColorSimulator = lazy(() => import('../pages/color-simulator/page'));
const InteractiveMap = lazy(() => import('../pages/interactive-map/page'));
const QuoteCalculator = lazy(() => import('../pages/quote-calculator/page'));
const AdminLogin = lazy(() => import('../pages/admin/login/page'));
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/page'));
const AdminConfig = lazy(() => import('../pages/admin/config/page'));
const AdminBookings = lazy(() => import('../pages/admin/bookings/page'));
const AdminProjects = lazy(() => import('../pages/admin/projects/page'));
const AdminQuotes = lazy(() => import('../pages/admin/quotes/page'));
const AdminUsers = lazy(() => import('../pages/admin/users/page'));
const AdminAnalytics = lazy(() => import('../pages/admin/analytics/page'));
const AdminContent = lazy(() => import('../pages/admin/content/page'));
const AdminArticles = lazy(() => import('../pages/admin/articles/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/services',
    element: <Services />
  },
  {
    path: '/portfolio',
    element: <Portfolio />
  },
  {
    path: '/blog',
    element: <Blog />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '/before-after',
    element: <BeforeAfter />
  },
  {
    path: '/booking',
    element: <Booking />
  },
  {
    path: '/careers',
    element: <Careers />
  },
  {
    path: '/client-dashboard',
    element: <ClientDashboard />
  },
  {
    path: '/color-simulator',
    element: <ColorSimulator />
  },
  {
    path: '/interactive-map',
    element: <InteractiveMap />
  },
  {
    path: '/quote-calculator',
    element: <QuoteCalculator />
  },
        {
          path: '/admin/login',
          element: <AdminLogin />
        },
        {
          path: '/admin',
          element: <Navigate to="/admin/dashboard" replace />
        },
        {
          path: '/admin/dashboard',
          element: (
            <AdminRouteProtection>
              <AdminDashboard />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/config',
          element: (
            <AdminRouteProtection>
              <AdminConfig />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/bookings',
          element: (
            <AdminRouteProtection>
              <AdminBookings />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/projects',
          element: (
            <AdminRouteProtection>
              <AdminProjects />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/quotes',
          element: (
            <AdminRouteProtection>
              <AdminQuotes />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/users',
          element: (
            <AdminRouteProtection>
              <AdminUsers />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/analytics',
          element: (
            <AdminRouteProtection>
              <AdminAnalytics />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/content',
          element: (
            <AdminRouteProtection>
              <AdminContent />
            </AdminRouteProtection>
          )
        },
        {
          path: '/admin/articles',
          element: (
            <AdminRouteProtection>
              <AdminArticles />
            </AdminRouteProtection>
          )
        },
        {
          path: '*',
          element: <NotFound />
        }
];

export default routes;
