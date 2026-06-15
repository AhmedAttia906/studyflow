"use client";

import ScrollToTopButton from "./ScrollToTopButton";

export default function LayoutWrapper({ children }) {
  return (
    <>
      {children}
      <ScrollToTopButton />
    </>
  );
}
