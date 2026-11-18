import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
Config.setJpegQuality(95)
Config.setCodec('h264')
Config.setCrf(16) // calidad alta (menor = mejor)
Config.setPixelFormat('yuv420p')
Config.setOverwriteOutput(true)
Config.setConcurrency(null)

// WebGL para las escenas 3D. 'angle' va bien en Mac/Windows con GPU.
// En servidores sin GPU usa REMOTION_GL=swangle.
type GL = 'angle' | 'swangle' | 'swiftshader' | 'egl' | 'angle-egl' | 'vulkan'
Config.setChromiumOpenGlRenderer((process.env.REMOTION_GL as GL) ?? 'angle')

// Opcional: usar un Chrome ya instalado en vez de descargar uno.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER)
