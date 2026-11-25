import React from "react";
import { Composition } from "remotion";
import { FPS } from "./lib";
import { FxPreview } from "./FxPreview";
import { Thumbnail } from "./scenes";
import { Main, TOTAL_FRAMES } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Noticia" component={Main} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
      {/* Portada para TikTok (9:16). Lo importante, dentro de la franja central 3:4 (y 240-1680): es lo que se ve en el perfil. */}
      <Composition id="Miniatura" component={Thumbnail} durationInFrames={1} fps={FPS} width={1080} height={1920} />
      {/* Vista previa de un efecto GTA de public/fx/ (props: {"name":"wanted"}) */}
      <Composition id="FxPreview" component={FxPreview} durationInFrames={300} fps={FPS} width={1080} height={1920} defaultProps={{ name: "wanted" }} />
    </>
  );
};
