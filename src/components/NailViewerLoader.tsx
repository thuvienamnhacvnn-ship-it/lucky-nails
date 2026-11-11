"use client";

import dynamic from "next/dynamic";

const NailViewer3D = dynamic(() => import("./NailViewer3D"), { ssr: false, loading: () => <div style={{ minHeight: 320 }} /> });

export default function NailViewerLoader() {
  return <NailViewer3D />;
}
