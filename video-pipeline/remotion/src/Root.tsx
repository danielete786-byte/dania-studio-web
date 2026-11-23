import React from "react";
import { Composition } from "remotion";
import { FPS } from "./lib";
import { Main, TOTAL_FRAMES } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Noticia" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
  );
};
