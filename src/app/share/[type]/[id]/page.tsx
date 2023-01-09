"use client";

import { Share } from "../../../../components/share";

export default function Page({
  params,
}: {
  params: {
    type: string;
    id: string;
  };
}) {
  return <Share />;
}
