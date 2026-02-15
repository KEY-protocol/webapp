import { notFound } from "next/navigation";

// Catch-all route: captures any undefined path under /[locale]/...
// and triggers the not-found page.
export default function CatchAllPage() {
  notFound();
}
