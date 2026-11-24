import{M as De,O as We,B as Ue,F as Re,S as E,U as X,V as g,W as V,H as W,N as Xe,C as Ye,a as L,b as N,A as ze,c as je,R as Ke,d as qe,e as $e,L as Je,f as Ze,g as et,h as Le,i as tt,j as st,r as v,k as it,l as at,m as rt,P as ot,n as nt,D as Ne,o as Ee,p as Ae,q as lt,G as ht,s as ut,t as ct,u as ft,v as dt,w as pt,x as mt,y as r,z as gt,E as b,I as xt,J as vt,K as bt,Q as Be,T as Mt}from"./index-BMU8flCp.js";import{R as Tt}from"./RoomEnvironment-BViG5SFX.js";const Ie={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class B{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const wt=new We(-1,1,1,-1,0,1);class Ct extends Ue{constructor(){super(),this.setAttribute("position",new Re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Re([0,2,0,0,2,0],2))}}const _t=new Ct;class re{constructor(e){this._mesh=new De(_t,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,wt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class St extends B{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof E?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=X.clone(e.uniforms),this.material=new E({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new re(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Fe extends B{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const a=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let o,c;this.inverse?(o=0,c=1):(o=1,c=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),s.buffers.stencil.setFunc(a.ALWAYS,o,4294967295),s.buffers.stencil.setClear(c),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(a.EQUAL,1,4294967295),s.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),s.buffers.stencil.setLocked(!0)}}class yt extends B{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Pt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new g);this._width=i.width,this._height=i.height,t=new V(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:W}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new St(Ie),this.copyPass.material.blending=Xe,this.clock=new Ye}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let a=0,s=this.passes.length;a<s;a++){const o=this.passes[a];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),o.needsSwap){if(i){const c=this.renderer.getContext(),h=this.renderer.state.buffers.stencil;h.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),h.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}Fe!==void 0&&(o instanceof Fe?i=!0:o instanceof yt&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new g);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(i,a),this.renderTarget2.setSize(i,a);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Rt extends B{constructor(e,t,i=null,a=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=a,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new L}render(e,t,i){const a=e.autoClear;e.autoClear=!1;let s,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=a}}const Nt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new L(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class A extends B{constructor(e,t,i,a){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=a,this.resolution=e!==void 0?new g(e.x,e.y):new g(256,256),this.clearColor=new L(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new V(s,o,{type:W}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const p=new V(s,o,{type:W});p.texture.name="UnrealBloomPass.h"+d,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const m=new V(s,o,{type:W});m.texture.name="UnrealBloomPass.v"+d,m.texture.generateMipmaps=!1,this.renderTargetsVertical.push(m),s=Math.round(s/2),o=Math.round(o/2)}const c=Nt;this.highPassUniforms=X.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new E({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const h=[3,5,7,9,11];s=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(h[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new g(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const Y=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=Y,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const x=Ie;this.copyUniforms=X.clone(x.uniforms),this.blendMaterial=new E({uniforms:this.copyUniforms,vertexShader:x.vertexShader,fragmentShader:x.fragmentShader,blending:ze,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new L,this.oldClearAlpha=1,this.basic=new je,this.fsQuad=new re(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),a=Math.round(t/2);this.renderTargetBright.setSize(i,a);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,a),this.renderTargetsVertical[s].setSize(i,a),this.separableBlurMaterials[s].uniforms.invSize.value=new g(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2)}render(e,t,i,a,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let c=this.renderTargetBright;for(let h=0;h<this.nMips;h++)this.fsQuad.material=this.separableBlurMaterials[h],this.separableBlurMaterials[h].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[h].uniforms.direction.value=A.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[h]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[h].uniforms.colorTexture.value=this.renderTargetsHorizontal[h].texture,this.separableBlurMaterials[h].uniforms.direction.value=A.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[h]),e.clear(),this.fsQuad.render(e),c=this.renderTargetsVertical[h];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new E({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new g(.5,.5)},direction:{value:new g(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new E({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}A.BlurDirectionX=new g(1,0);A.BlurDirectionY=new g(0,1);const Et={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class At extends B{constructor(){super();const e=Et;this.uniforms=X.clone(e.uniforms),this.material=new Ke({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new re(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},qe.getTransfer(this._outputColorSpace)===$e&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Je?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Ze?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===et?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Le?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===tt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===st&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const ke=(l,e=0,t=1)=>Math.min(t,Math.max(e,l)),M=(l,e,t)=>{const i=ke((t-l)/(e-l));return i*i*(3-2*i)},C=(l,e,t)=>l+(e-l)*t,Bt=l=>1-(1-l)**3;function Ut(){const l=v.useRef(null),e=v.useRef(null),t=v.useRef(null),i=v.useRef(null),a=v.useRef(null),s=v.useRef(null),o=v.useRef(null),c=v.useRef(null),[h,Y]=v.useState(!1);return v.useEffect(()=>{const x=e.current,d=matchMedia("(prefers-reduced-motion: reduce)").matches;let p;try{p=new it({antialias:!0,powerPreference:"high-performance"})}catch{Y(!0);return}p.setPixelRatio(Math.min(devicePixelRatio,2)),p.toneMapping=Le,p.toneMappingExposure=1.1,p.outputColorSpace=at,x.appendChild(p.domElement);const m=new rt,_=new ot(30,1,.1,100);m.background=new L(461068);const oe=new nt(p);m.environment=oe.fromScene(new Tt,.03).texture,m.environmentIntensity=.75;const ne=new Ne(16777215,2.2);ne.position.set(3,5,6),m.add(ne);const le=new Ne(10148095,.8);le.position.set(-6,2,-3),m.add(le);const K=new Ee(Ae,0,9),q=new Ee(Ae,0,9);K.position.set(-2.2,1.6,2.4),q.position.set(2.4,-1.4,2.2),m.add(K,q);const{group:$,pieces:he,gear:Oe,materials:Ge}=lt(),F=new ht;F.add($),m.add(F);const J=new De(new ut(9,9),new je({map:ct(),transparent:!0,opacity:0,blending:ze,depthWrite:!1}));J.position.z=-1.4,F.add(J);const Z=260,I=new Float32Array(Z*3);for(let f=0;f<Z;f++)I[f*3]=(Math.random()-.5)*14,I[f*3+1]=(Math.random()-.5)*9,I[f*3+2]=(Math.random()-.5)*6;const ee=new Ue;ee.setAttribute("position",new ft(I,3)),m.add(new dt(ee,new pt({color:12580602,size:.022,transparent:!0,opacity:.45,depthWrite:!1})));const S=new Pt(p);S.addPass(new Rt(m,_));const ue=new A(new g(1,1),.2,.5,.92);S.addPass(ue),S.addPass(new At);let D=1,k=1,T=!1;const ce=()=>{D=x.clientWidth,k=x.clientHeight,T=D<768,p.setSize(D,k),S.setPixelRatio(Math.min(devicePixelRatio,T?1.5:2)),S.setSize(D,k),_.aspect=D/k,_.updateProjectionMatrix()};ce();const fe=new ResizeObserver(ce);fe.observe(x);let te=d?1:0,u=te;const Qe=mt.create({trigger:l.current,start:"top top",end:"bottom bottom",onUpdate:f=>{d||(te=f.progress)}}),O={x:0,y:0},w={x:0,y:0},de=f=>{O.x=f.clientX/innerWidth-.5,O.y=f.clientY/innerHeight-.5};addEventListener("pointermove",de);let pe=!0,me=0,ge=performance.now(),G=0,xe=0,ve=u,be=-1;const Me=new IntersectionObserver(([f])=>{pe=f.isIntersecting});Me.observe(x);const Te=new Be,we=new Be,Ce=new N(0,0,1),_e=()=>{me=requestAnimationFrame(_e);const f=performance.now(),y=Math.min(.05,(f-ge)/1e3);if(ge=f,!pe)return;d||(G+=y),u+=(te-u)*(1-Math.exp(-y*6)),w.x+=(O.x-w.x)*.05,w.y+=(O.y-w.y)*.05;const He=Math.abs(u-ve)/Math.max(y,.001);ve=u,d||(xe+=y*(.2+Math.min(He*4,5)));const Se=T?.72:.85;let U=0;for(const n of he){const P=ke((u-n.t0)/(n.t1-n.t0)),R=Bt(P),Pe=1-R;P>=1&&U++,n.obj.position.set(C(n.home.x+(n.from.x-n.home.x)*Se,n.home.x,R),C(n.home.y+(n.from.y-n.home.y)*Se,n.home.y,R),C(n.from.z,n.home.z,R)),n.obj.position.y+=Math.sin(G*.9+n.phase)*.12*Pe,we.setFromAxisAngle(n.axis,G*.35*Pe),Te.copy(n.fromQ).multiply(we).slerp(n.homeQ,R),n.obj.quaternion.copy(Te),n.kind==="bolt"&&n.obj.rotateOnAxis(Ce,(1-R)*Math.PI*6)}Oe.rotateOnAxis(Ce,xe);const se=M(.73,.8,u),Ve=se>0&&se<1?Math.sin(u*2400)>-.3?1:.12:1,Q=se*Ve;Ge.neon.emissiveIntensity=.04+Q*2.4,K.intensity=q.intensity=Q*1.6,J.material.opacity=.04+Q*(T?.14:.3),ue.strength=.18+Q*(T?.3:.5);const z=M(.04,.3,u),ye=M(.8,.95,u),j=Math.tan(Mt.degToRad(_.fov/2)),ie=j*_.aspect,H=T?Math.max(2.05/(ie*.9),1.95/(j*.42)):Math.max(1.95/(j*.56),1.95/(ie*.6));F.position.set(C(T?0:H*ie*.42,0,z),C(T?-H*j*.42:0,H*j*(T?.1:.12),z),0),F.scale.setScalar(C(.82,1,z)),$.rotation.y=w.x*.5+Math.sin(G*.5)*.32*ye+C(-.35,0,z),$.rotation.x=w.y*.3+C(.15,0,z)-.06*ye;const ae=ee.attributes.position;for(let n=0;n<Z;n++){let P=ae.getY(n)+y*.08;P>4.5&&(P=-4.5),ae.setY(n,P)}ae.needsUpdate=!0,_.position.set(-w.x*.5,-w.y*.35,H),_.lookAt(0,0,0),S.render(y),t.current.style.opacity=String(1-M(.02,.12,u)),t.current.style.transform=`translateY(${-M(.02,.12,u)*50}px)`,i.current.style.opacity=String(M(.8,.9,u)),i.current.style.transform=`translateY(${(1-M(.8,.9,u))*24}px)`,a.current.style.opacity=String(1-M(.01,.06,u)),s.current.style.opacity=String(M(.05,.12,u)*(1-M(.76,.82,u))),U!==be&&(be=U,o.current.textContent=String(U)),c.current.style.transform=`scaleX(${U/he.length})`};return _e(),()=>{cancelAnimationFrame(me),Qe.kill(),fe.disconnect(),Me.disconnect(),removeEventListener("pointermove",de),oe.dispose(),S.dispose(),p.dispose(),x.innerHTML=""}},[]),r.jsx("section",{ref:l,className:"relative h-[100svh] motion-safe:h-[440vh]","aria-label":"Presentación",children:r.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden bg-ink",children:[h&&r.jsx("img",{src:gt.neon,alt:"Rótulo de neón de Vegawagen",className:"absolute inset-0 h-full w-full object-cover opacity-60"}),r.jsx("div",{ref:e,className:"absolute inset-0",role:"img","aria-label":"Emblema de Vegawagen en 3D que se monta pieza a pieza al hacer scroll y enciende su neón"}),r.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_55%,rgba(7,9,12,.85))]"}),r.jsxs("div",{ref:t,className:"pointer-events-none absolute inset-0",children:[r.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.75)_38%,transparent_62%)] max-md:bg-[linear-gradient(180deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.7)_48%,transparent_70%)]"}),r.jsxs("div",{className:"relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0",children:[r.jsx("p",{className:"kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]",children:b.hero.kicker}),r.jsxs("h1",{className:"h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]",children:[r.jsx("span",{className:"block",children:b.hero.title[0]}),r.jsx("span",{className:"neon-text block",children:b.hero.title[1]})]}),r.jsx("p",{className:"mt-5 max-w-md text-[16px] leading-relaxed text-white/65 md:mt-7 md:text-[18px]",children:b.hero.text}),r.jsxs("div",{className:"pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9",children:[r.jsxs("a",{href:b.phoneHref,className:"btn-neon",children:[r.jsx(xt,{})," ",b.phone]}),r.jsxs("a",{href:b.whatsappHref,target:"_blank",rel:"noopener",className:"btn-ghost",children:[r.jsx(vt,{})," WhatsApp"]}),r.jsxs("span",{className:"hidden items-center gap-2 text-[14px] text-white/60 sm:flex",children:[r.jsx("span",{className:"text-neon",children:"★"})," ",b.rating.toLocaleString("es-ES")," en Google"]})]})]})]}),r.jsxs("div",{ref:s,className:"pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0",children:[r.jsxs("p",{className:"font-mono text-[11px] uppercase tracking-[0.25em] text-white/55",children:["Montando pieza a pieza · ",r.jsx("span",{ref:o,className:"text-neon",children:"0"}),"/43"]}),r.jsx("div",{className:"mt-3 h-px overflow-hidden bg-white/10",children:r.jsx("div",{ref:c,className:"h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]",style:{transform:"scaleX(0)"}})})]}),r.jsxs("div",{ref:i,className:"pointer-events-none absolute inset-x-0 bottom-20 px-5 text-center opacity-0 md:bottom-14",children:[r.jsx(bt,{className:"mx-auto text-[28px] sm:text-[44px] md:text-[58px]"}),r.jsx("p",{className:"mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60 md:text-[13px]",children:b.hero.outro})]}),r.jsx("p",{ref:a,className:"pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/45 motion-reduce:hidden md:text-[11px]","aria-hidden":!0,children:b.hero.scroll})]})})}export{Ut as default};
