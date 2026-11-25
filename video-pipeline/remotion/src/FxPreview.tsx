/** Vista previa de un efecto GTA sobre un fondo: npx remotion still FxPreview out/fx.png --frame=60 --props='{"name":"wanted"}' */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { GtaFx } from "./news";

export const FxPreview: React.FC<{ name: string; bg?: string }> = ({ name, bg = "img/keyart.jpg" }) => (
  <AbsoluteFill style={{ backgroundColor: "#140a24" }}>
    <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
    <GtaFx name={name} from={0} />
  </AbsoluteFill>
);
