import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/brand")({
  component: BrandRedirect,
});

function BrandRedirect() {
  useEffect(() => {
    window.location.replace("/brand.html");
  }, []);
  return null;
}
