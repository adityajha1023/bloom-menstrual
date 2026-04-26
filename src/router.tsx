import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";

import Dashboard from "./routes/index";
import TrackPage from "./routes/track";
import CalendarPage from "./routes/calendar";
import { Navbar } from "./components/Navbar";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#FFF7F9] font-[Inter] text-[#2E2E2E]">
      
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>

    </div>
  ),
});

// Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: TrackPage,
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  trackRoute,
  calendarRoute,
]);

// Router
export const router = createRouter({
  routeTree,
});