
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

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
const AdminDashboard = lazy(() => import('../pages/admin/page'));
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
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
