import { createFileRoute } from "@tanstack/react-router";
import DigitalGlobePreview from "@/components/globe-preview/DigitalGlobe";

export const Route = createFileRoute("/globe-preview")({
  head: () => ({
    meta: [
      { title: "Globe Preview" },
      {
        name: "description",
        content: "Standalone preview route for the isolated digital globe test scene.",
      },
    ],
  }),
  component: GlobePreviewPage,
});

function GlobePreviewPage() {
  return <DigitalGlobePreview />;
}
