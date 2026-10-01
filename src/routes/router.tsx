import { createBrowserRouter } from "react-router";

import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { BookingPage, bookingLoader } from "@/features/bookings/components/BookingPage";
import { BookingsPage } from "@/features/bookings/components/BookingsPage";
import { HostPage } from "@/features/host/components/HostPage";
import { MembershipPage } from "@/features/membership/components/MembershipPage";
import { DashboardPage } from "@/features/metrics/components/DashboardPage";
import { SpacePage, spaceLoader } from "@/features/spaces/components/SpacePage";
import { SpacesPage, spacesLoader } from "@/features/spaces/components/SpacesPage";
import { NotFoundPage } from "@/routes/NotFoundPage";
import { ProtectedLayout } from "@/routes/ProtectedLayout";
import { RootErrorBoundary, RootLayout } from "@/routes/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, loader: spacesLoader, Component: SpacesPage },
      { path: "spaces/:spaceId", loader: spaceLoader, Component: SpacePage },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "membership", Component: MembershipPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "host", Component: HostPage },
      { path: "bookings/:bookingId", loader: bookingLoader, Component: BookingPage },
      {
        Component: ProtectedLayout,
        children: [{ path: "bookings", Component: BookingsPage }],
      },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
