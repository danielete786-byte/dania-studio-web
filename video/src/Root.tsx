import React from 'react'
import { Composition, Folder } from 'remotion'
import { FPS } from './theme'
import { LogoIntro, logoIntroSchema } from './compositions/LogoIntro'
import { BrandPromo, brandPromoSchema, PROMO_DURATION } from './compositions/BrandPromo'
import { TitleCard, titleCardSchema } from './compositions/TitleCard'
import { GtaNominado, gtaSchema, gtaDefaults, gtaDuration } from './compositions/GtaNominado'
import { LeonidaPromo, leonidaPromoSchema, leonidaDefaults, LEONIDA_PROMO_DURATION } from './compositions/LeonidaPromo'

const intro = { title: '', tagline: 'Creamos con IA. Contamos con alma.', kicker: 'Estudio de contenido y vídeo con IA' }

const promo = {
  kicker: 'Estudio de contenido y vídeo con IA',
  hook: ['Creamos con IA.', 'Contamos con alma.'] as [string, string],
  servicesTitle: 'Todo lo que tu marca necesita',
  services: [
    { title: 'Vídeos y Shorts virales', text: 'Contenido que engancha desde el primer segundo.' },
    { title: 'Anuncios para marcas', text: 'Spots que venden, en días y no en semanas.' },
    { title: 'Webs y apps con IA', text: 'Experiencias rápidas, bonitas y que convierten.' },
    { title: 'Automatizaciones', text: 'Flujos que publican y crean por ti.' },
  ],
  stats: [
    { prefix: '+', value: 100, suffix: '', label: 'vídeos creados' },
    { prefix: '+', value: 1, suffix: 'M', label: 'visualizaciones' },
    { prefix: '', value: 3, suffix: '', label: 'plataformas' },
  ],
  ctaTitle: '¿Hacemos algo juntos?',
  ctaButton: 'Escríbeme',
  handle: 'hola@daniastudio.com',
}

const card = { kicker: 'DanIA Studio', title: 'Vídeos que', highlight: 'enganchan', subtitle: 'Motion graphics creados con IA y código' }

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Marca">
      <Composition id="LogoIntro" component={LogoIntro} schema={logoIntroSchema} defaultProps={intro}
        durationInFrames={6 * FPS} fps={FPS} width={1920} height={1080} />
      <Composition id="LogoIntroVertical" component={LogoIntro} schema={logoIntroSchema} defaultProps={intro}
        durationInFrames={6 * FPS} fps={FPS} width={1080} height={1920} />
    </Folder>
    <Folder name="Redes">
      <Composition id="BrandPromo" component={BrandPromo} schema={brandPromoSchema} defaultProps={promo}
        durationInFrames={PROMO_DURATION} fps={FPS} width={1080} height={1920} />
    </Folder>
    <Folder name="Noticias">
      <Composition id="GtaNominado" component={GtaNominado} schema={gtaSchema} defaultProps={gtaDefaults}
        durationInFrames={gtaDuration(gtaDefaults, FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="LeonidaPromo" component={LeonidaPromo} schema={leonidaPromoSchema} defaultProps={leonidaDefaults}
        durationInFrames={LEONIDA_PROMO_DURATION} fps={FPS} width={1080} height={1350} />
    </Folder>
    <Folder name="Rotulos">
      <Composition id="TitleCard" component={TitleCard} schema={titleCardSchema} defaultProps={card}
        durationInFrames={4 * FPS} fps={FPS} width={1920} height={1080} />
      {/* Miniatura: npm run still -- Thumbnail out/thumb.png --frame=90 */}
      <Composition id="Thumbnail" component={TitleCard} schema={titleCardSchema} defaultProps={card}
        durationInFrames={4 * FPS} fps={FPS} width={1280} height={720} />
    </Folder>
  </>
)
