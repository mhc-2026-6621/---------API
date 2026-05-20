"use client";

import dynamic from "next/dynamic";

const ApiCallViewer = dynamic(
  () => import("./ApiCallViewer").then((module) => module.ApiCallViewer),
  { ssr: false }
);

export function LazyApiCallViewer() {
  return <ApiCallViewer />;
}