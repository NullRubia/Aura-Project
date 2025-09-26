"use client";

import ClientLayout from "./ClientLayout";
import { ThemeProvider } from "../theme/ThemeProvider";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ClientLayout>{children}</ClientLayout>
    </ThemeProvider>
  );
}
