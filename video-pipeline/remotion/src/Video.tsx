/**
 * Composición genérica: monta las escenas de scenes.tsx sobre la línea de tiempo
 * de la voz (src/data/timeline.json), con subtítulos, grano, música y SFX.
 * NO hace falta tocar este archivo: cada historia se escribe en scenes.tsx.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions, Flash, Grain } from "./components";
import { C, clamp, msToF, popSpring, seg, TL } from "./lib";
import { SCENES, SfxCues } from "./scenes";

const LEAD_MS = 160; // la imagen cambia un pelín antes que la voz
export const TOTAL_FRAMES = msToF(TL.durationMs);

const sceneStarts = () => {
  const starts = SCENES.map((s, i) => (i === 0 ? 0 : seg(s.firstSeg).startMs - LEAD_MS));
  return SCENES.map((s, i) => {
    const startMs = starts[i];
    const endF = i < SCENES.length - 1 ? msToF(starts[i + 1]) : TOTAL_FRAMES;
    return { ...s, startMs, from: msToF(startMs), dur: endF - msToF(startMs) };
  });
};

const SceneWrap: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (first) return <AbsoluteFill>{children}</AbsoluteFill>;
  const s = popSpring(frame, fps, 0);
  return (
    <AbsoluteFill style={{ scale: String(interpolate(s, [0, 1], [1.18, 1])), filter: `blur(${interpolate(frame, [0, 5], [10, 0], clamp)}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const scenes = sceneStarts();
  const voiceEndF = msToF(TL.segments[TL.segments.length - 1].endMs);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      {scenes.map((s, i) => (
        <Sequence key={s.key} from={s.from} durationInFrames={s.dur} premountFor={30}>
          <SceneWrap first={i === 0}>
            <s.C dur={s.dur} startMs={s.startMs} />
          </SceneWrap>
          {s.flash ? (
            <Sequence durationInFrames={10} layout="none">
              <Flash color={s.flash} />
            </Sequence>
          ) : null}
        </Sequence>
      ))}
      <Captions />
      <Grain />
      <Audio src={staticFile("voice.wav")} volume={1} />
      <Audio src={staticFile("sfx/music.wav")} volume={(f) => interpolate(f, [0, 8, voiceEndF, voiceEndF + 12], [0.3, 0.12, 0.12, 0.28], clamp)} />
      {scenes.slice(1).map((s, i) => (
        <Sequence key={s.key} from={Math.max(0, s.from - 6)} durationInFrames={60} layout="none">
          <Audio src={staticFile(`sfx/${i % 2 ? "whoosh_down" : "whoosh"}.wav`)} volume={0.45} />
        </Sequence>
      ))}
      <SfxCues />
    </AbsoluteFill>
  );
};
