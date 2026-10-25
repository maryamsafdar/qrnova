import { Layout } from "@/components/layout";
import { QR_CATEGORIES } from "@/lib/qr";
import type { QrCategoryId } from "@/lib/qr";
import ContactPage from "@/pages/ContactPage";
import GeneratorPage from "@/pages/GeneratorPage";
import HomePage from "@/pages/HomePage";
import UrlQrLandingPage from "@/pages/UrlQrLandingPage";
import WifiQrLandingPage from "@/pages/WifiQrLandingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const CATEGORY_IDS = QR_CATEGORIES.map((category) => category.id);

function isCategoryId(value: unknown): value is QrCategoryId {
  return (
    typeof value === "string" && (CATEGORY_IDS as string[]).includes(value)
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const urlLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/url-qr-code-generator",
  component: UrlQrLandingPage,
});

const wifiLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wifi-qr-code-generator",
  component: WifiQrLandingPage,
});

const generatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/generator",
  validateSearch: (
    search: Record<string, unknown>,
  ): { type: QrCategoryId } => ({
    type: isCategoryId(search.type) ? search.type : "url",
  }),
  component: GeneratorPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: PrivacyPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  urlLandingRoute,
  wifiLandingRoute,
  generatorRoute,
  privacyRoute,
  termsRoute,
  contactRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
