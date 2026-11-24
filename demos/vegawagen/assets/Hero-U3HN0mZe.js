import{M as y,O as ht,B as ut,F as Le,S as q,U as re,V as F,W as ie,H as ae,N as ft,C as dt,a as $,b as v,A as mt,c as Je,R as pt,d as gt,e as xt,L as vt,f as Mt,g as wt,h as Ze,i as bt,j as Tt,P as et,k as St,l as Oe,m as Ve,n as Ct,o as xe,p as Ge,G as me,q as Y,T as _t,r as Qe,s as yt,t as tt,E as st,Q as Pt,u as Rt,v as K,w as D,x as Et,y as Nt,z as At,D as ve,I as Ft,J as We,K as Dt,X as d,Y as Ut,Z as k,_ as Bt,$ as zt,a0 as kt,a1 as Me,a2 as It}from"./index-BU_ugHYF.js";import{s as jt}from"./env-B6n-va7G.js";const it={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class Z{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Lt=new ht(-1,1,1,-1,0,1);class Ot extends ut{constructor(){super(),this.setAttribute("position",new Le([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Le([0,2,0,0,2,0],2))}}const Vt=new Ot;class Te{constructor(e){this._mesh=new y(Vt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Lt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Gt extends Z{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof q?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=re.clone(e.uniforms),this.material=new q({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Te(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class He extends Z{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const a=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let o,h;this.inverse?(o=0,h=1):(o=1,h=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),i.buffers.stencil.setFunc(a.ALWAYS,o,4294967295),i.buffers.stencil.setClear(h),i.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(a.EQUAL,1,4294967295),i.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),i.buffers.stencil.setLocked(!0)}}class Qt extends Z{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Wt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new F);this._width=s.width,this._height=s.height,t=new ie(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:ae}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Gt(it),this.copyPass.material.blending=ft,this.clock=new dt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let a=0,i=this.passes.length;a<i;a++){const o=this.passes[a];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),o.needsSwap){if(s){const h=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}He!==void 0&&(o instanceof He?s=!0:o instanceof Qt&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new F);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(s,a),this.renderTarget2.setSize(s,a);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(s,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ht extends Z{constructor(e,t,s=null,a=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=a,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new $}render(e,t,s){const a=e.autoClear;e.autoClear=!1;let i,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=a}}const Xt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new $(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class J extends Z{constructor(e,t,s,a){super(),this.strength=t!==void 0?t:1,this.radius=s,this.threshold=a,this.resolution=e!==void 0?new F(e.x,e.y):new F(256,256),this.clearColor=new $(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new ie(i,o,{type:ae}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const T=new ie(i,o,{type:ae});T.texture.name="UnrealBloomPass.h"+f,T.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(T);const M=new ie(i,o,{type:ae});M.texture.name="UnrealBloomPass.v"+f,M.texture.generateMipmaps=!1,this.renderTargetsVertical.push(M),i=Math.round(i/2),o=Math.round(o/2)}const h=Xt;this.highPassUniforms=re.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new q({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new F(1/i,1/o),i=Math.round(i/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const m=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=m,this.bloomTintColors=[new v(1,1,1),new v(1,1,1),new v(1,1,1),new v(1,1,1),new v(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const p=it;this.copyUniforms=re.clone(p.uniforms),this.blendMaterial=new q({uniforms:this.copyUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,blending:mt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new $,this.oldClearAlpha=1,this.basic=new Je,this.fsQuad=new Te(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let s=Math.round(e/2),a=Math.round(t/2);this.renderTargetBright.setSize(s,a);for(let i=0;i<this.nMips;i++)this.renderTargetsHorizontal[i].setSize(s,a),this.renderTargetsVertical[i].setSize(s,a),this.separableBlurMaterials[i].uniforms.invSize.value=new F(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2)}render(e,t,s,a,i){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),i&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=s.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let h=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[u].uniforms.direction.value=J.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=J.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),h=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,i&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new q({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new F(.5,.5)},direction:{value:new F(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new q({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}J.BlurDirectionX=new F(1,0);J.BlurDirectionY=new F(0,1);const Yt={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Kt extends Z{constructor(){super();const e=Yt;this.uniforms=re.clone(e.uniforms),this.material=new pt({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Te(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},gt.getTransfer(this._outputColorSpace)===xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===vt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Mt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===wt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ze?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===bt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Tt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class pe extends y{constructor(e,t={}){super(e),this.isReflector=!0,this.type="Reflector",this.camera=new et;const s=this,a=t.color!==void 0?new $(t.color):new $(8355711),i=t.textureWidth||512,o=t.textureHeight||512,h=t.clipBias||0,u=t.shader||pe.ReflectorShader,m=t.multisample!==void 0?t.multisample:4,p=new St,f=new v,T=new v,M=new v,n=new Oe,l=new v(0,0,-1),c=new Ve,g=new v,P=new v,N=new Ve,B=new Oe,w=this.camera,C=new ie(i,o,{samples:m,type:ae}),z=new q({name:u.name!==void 0?u.name:"unspecified",uniforms:re.clone(u.uniforms),fragmentShader:u.fragmentShader,vertexShader:u.vertexShader});z.uniforms.tDiffuse.value=C.texture,z.uniforms.color.value=a,z.uniforms.textureMatrix.value=B,this.material=z,this.onBeforeRender=function(b,oe,V){if(T.setFromMatrixPosition(s.matrixWorld),M.setFromMatrixPosition(V.matrixWorld),n.extractRotation(s.matrixWorld),f.set(0,0,1),f.applyMatrix4(n),g.subVectors(T,M),g.dot(f)>0)return;g.reflect(f).negate(),g.add(T),n.extractRotation(V.matrixWorld),l.set(0,0,-1),l.applyMatrix4(n),l.add(M),P.subVectors(T,l),P.reflect(f).negate(),P.add(T),w.position.copy(g),w.up.set(0,1,0),w.up.applyMatrix4(n),w.up.reflect(f),w.lookAt(P),w.far=V.far,w.updateMatrixWorld(),w.projectionMatrix.copy(V.projectionMatrix),B.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),B.multiply(w.projectionMatrix),B.multiply(w.matrixWorldInverse),B.multiply(s.matrixWorld),p.setFromNormalAndCoplanarPoint(f,T),p.applyMatrix4(w.matrixWorldInverse),c.set(p.normal.x,p.normal.y,p.normal.z,p.constant);const R=w.projectionMatrix;N.x=(Math.sign(c.x)+R.elements[8])/R.elements[0],N.y=(Math.sign(c.y)+R.elements[9])/R.elements[5],N.z=-1,N.w=(1+R.elements[10])/R.elements[14],c.multiplyScalar(2/c.dot(N)),R.elements[2]=c.x,R.elements[6]=c.y,R.elements[10]=c.z+1-h,R.elements[14]=c.w,s.visible=!1;const I=b.getRenderTarget(),ge=b.xr.enabled,G=b.shadowMap.autoUpdate;b.xr.enabled=!1,b.shadowMap.autoUpdate=!1,b.setRenderTarget(C),b.state.buffers.depth.setMask(!0),b.autoClear===!1&&b.clear(),b.render(oe,w),b.xr.enabled=ge,b.shadowMap.autoUpdate=G,b.setRenderTarget(I);const Q=V.viewport;Q!==void 0&&b.state.viewport(Q),s.visible=!0},this.getRenderTarget=function(){return C},this.dispose=function(){C.dispose(),s.material.dispose()}}}pe.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};const U=Math.PI*2,E=F;function Xe(r,e){let t=r;for(let s=0;s<e.length;s++){const a=e[s],i=e[(s+1)%e.length],o=t;t=[];const h=m=>(i.x-a.x)*(m.y-a.y)-(i.y-a.y)*(m.x-a.x)>=0,u=(m,p)=>{const f=(i.x-a.x)*(m.y-a.y)-(i.y-a.y)*(m.x-a.x),T=(i.x-a.x)*(p.y-a.y)-(i.y-a.y)*(p.x-a.x);return m.clone().lerp(p,f/(f-T))};for(let m=0;m<o.length;m++){const p=o[m],f=o[(m+1)%o.length];h(f)?(h(p)||t.push(u(p,f)),t.push(f)):h(p)&&t.push(u(p,f))}}return t}const qt=(r,e=96)=>Array.from({length:e},(t,s)=>new E(Math.cos(s/e*U)*r,Math.sin(s/e*U)*r)),Ye=(r,e)=>r.x*e.y-r.y*e.x,$t=(r,e,t,s)=>r.clone().addScaledVector(e,Ye(t.clone().sub(r),s)/Ye(e,s));function Ke(r,e){const t=r.slice(0,-1).map((a,i)=>{const o=r[i+1].clone().sub(a).normalize();return{p:a,d:o,n:new E(-o.y,o.x)}}),s=a=>r.map((i,o)=>{if(o===0)return i.clone().addScaledVector(t[0].d,-.3).addScaledVector(t[0].n,a*e);if(o===r.length-1){const m=t[o-1];return i.clone().addScaledVector(m.d,.3).addScaledVector(m.n,a*e)}const h=t[o-1],u=t[o];return $t(h.p.clone().addScaledVector(h.n,a*e),h.d,u.p.clone().addScaledVector(u.n,a*e),u.d)});return[...s(1),...s(-1).reverse()]}function we(r,e,t,s,a=12){const i=r.reduce((m,p)=>m.add(p),new E).divideScalar(r.length),o=new tt(r.map(m=>m.clone().sub(i))),h=new st(o,{depth:e,bevelEnabled:!0,bevelThickness:t,bevelSize:t*.8,bevelSegments:4,curveSegments:a});h.translate(0,0,-e/2);const u=new y(h,s);return u.position.set(i.x,i.y,0),u}function Jt(r,e,t,s,a=28){const i=[];for(let o=0;o<=a;o++){const h=t+(s-t)*o/a;i.push(new E(Math.cos(h)*e,Math.sin(h)*e))}for(let o=a;o>=0;o--){const h=t+(s-t)*o/a;i.push(new E(Math.cos(h)*r,Math.sin(h)*r))}return i}class Zt extends Rt{constructor(e,t,s){super(),this.r=e,this.len=t,this.turns=s}getPoint(e,t=new v){const s=e*this.turns*U;return t.set(this.r*Math.cos(s),this.r*Math.sin(s),e*this.len-this.len/2)}}const qe=.078,es=[new E(Math.cos(1.98)*.98,Math.sin(1.98)*.98),new E(0,-.04),new E(Math.cos(1.16)*.98,Math.sin(1.16)*.98)],ts=[new E(Math.cos(2.84)*.98,Math.sin(2.84)*.98),new E(Math.cos(4.3)*.86,Math.sin(4.3)*.86),new E(0,-.12),new E(Math.cos(5.124)*.86,Math.sin(5.124)*.86),new E(Math.cos(.302)*.98,Math.sin(.302)*.98)];function ss(){const r={chrome:new Ge({color:15659509,metalness:1,roughness:.1,clearcoat:.8,clearcoatRoughness:.06}),field:new Ge({color:855826,metalness:.2,roughness:.25,clearcoat:1,clearcoatRoughness:.08}),plastic:new xe({color:1513756,metalness:.05,roughness:.62}),metal:new xe({color:11120567,metalness:1,roughness:.3}),brass:new xe({color:13148762,metalness:1,roughness:.28}),line:new Ct({color:14673646,dashSize:.05,gapSize:.04,transparent:!0,opacity:.45,depthWrite:!1})},e=new me,t=[];let s=3;const a=()=>(s=s*16807%2147483647,(s-1)/2147483646),i=(n,l,c,g,P=.12,N,B)=>{e.add(n);const w=n.position.clone(),C=n.quaternion.clone(),z=w.clone().add(c),b=N?new Pt().setFromEuler(N).multiply(C):C.clone();t.push({obj:n,home:w,homeQ:C,from:z,fromQ:b,t0:g,t1:g+P,phase:a()*U,kind:l,screwAxis:B})},o=new me,h=new y(new Y(.97,.95,.16,96).rotateX(Math.PI/2),r.plastic);o.add(h);const u=new y(new _t(.62,.025,8,80),r.plastic);u.position.z=.09,o.add(u);for(let n=0;n<8;n++){const l=new y(new Qe(.34,.035,.05),r.plastic),c=n*U/8;l.position.set(Math.cos(c)*.4,Math.sin(c)*.4,.1),l.rotation.z=c,o.add(l)}for(let n=0;n<4;n++){const l=Math.PI/4+n*U/4,c=new y(new Y(.07,.07,.1,24).rotateX(Math.PI/2),r.plastic);c.position.set(Math.cos(l)*.78,Math.sin(l)*.78,.1),o.add(c);const g=new y(new Y(.03,.03,.1,16).rotateX(Math.PI/2),r.metal);g.position.copy(c.position),g.position.z+=.005,o.add(g)}const m=new y(new Y(.16,.16,.12,32).rotateX(Math.PI/2),r.plastic);m.position.z=.1,o.add(m);for(const n of[-1,1]){const l=new y(new Qe(.16,.1,.22),r.plastic);l.position.set(n*.98,0,-.04),o.add(l)}o.position.z=-.17,i(o,"housing",new v(1.55,.05,-1.4),.08,.14,new K(0,-.7,0));for(let n=0;n<4;n++){const l=n*U/4,c=new y(new yt(new Zt(.045,.16,5),80,.008,6),r.metal);c.position.set(Math.cos(l)*.5,Math.sin(l)*.5,-.1),i(c,"spring",new v(Math.cos(l)*.7+.9,Math.sin(l)*.7,-.9),.17+n*.015,.1,new K(a()*2,a()*2,0))}for(let n=0;n<4;n++){const l=Math.PI/2+n*U/4,c=new tt;c.moveTo(-.12,-.05),c.lineTo(.12,-.05),c.lineTo(.12,.08),c.lineTo(.07,.08),c.lineTo(.07,0),c.lineTo(-.07,0),c.lineTo(-.07,.08),c.lineTo(-.12,.08),c.closePath();const g=new y(new st(c,{depth:.05,bevelEnabled:!0,bevelThickness:.01,bevelSize:.008,bevelSegments:2}).translate(0,0,-.025),r.metal);g.position.set(Math.cos(l)*.72,Math.sin(l)*.72,-.02),g.rotation.z=l-Math.PI/2,i(g,"bracket",new v(Math.cos(l)*.75,Math.sin(l)*.75,.35),.24+n*.02,.11,new K(.6,0,0))}const p=new y(new Y(.87,.87,.04,96).rotateX(Math.PI/2),r.field);p.position.z=.02,i(p,"field",new v(.75,0,-.55),.32,.12,new K(0,-.4,0));const f=qt(.95),T=we(Xe(Ke(ts,qe),f),.12,.03,r.chrome);T.position.z+=.11,i(T,"letter",new v(-.25,-.35,1),.4,.14,new K(.2,.35,0));const M=we(Xe(Ke(es,qe),f),.12,.03,r.chrome);M.position.z+=.11,i(M,"letter",new v(-.15,.7,1.15),.47,.14,new K(-.25,.3,0));for(let n=0;n<6;n++){const l=n*U/6+Math.PI/6+.012,c=(n+1)*U/6+Math.PI/6-.012,g=(l+c)/2,P=we(Jt(.85,1,l,c),.2,.045,r.chrome,24);P.position.z+=.05,i(P,"ring",new v(Math.cos(g)*.62,Math.sin(g)*.62,n%2?.25:-.15),.52+n*.022,.13,new K(0,0,(a()-.5)*.3))}for(let n=0;n<6;n++){const l=n*U/6+Math.PI/6,c=new me,g=new y(new Y(.045,.045,.03,16),n%2?r.brass:r.metal);g.position.y=.11;const P=new y(new Y(.018,.018,.2,10),r.metal);c.add(g,P),c.position.set(Math.cos(l)*.9,Math.sin(l)*.9,0),c.rotation.z=l-Math.PI/2,i(c,"screw",new v(Math.cos(l)*1.05,Math.sin(l)*1.05,0),.67+n*.012,.09,void 0,new v(Math.cos(l),Math.sin(l),0))}return{group:e,pieces:t,materials:r}}const be=(r,e=0,t=1)=>Math.min(t,Math.max(e,r)),A=(r,e,t)=>{const s=be((t-r)/(e-r));return s*s*(3-2*s)},O=(r,e,t)=>r+(e-r)*t,$e=r=>r<.5?4*r*r*r:1-(-2*r+2)**3/2,ue=[.06,.3],fe=[.5,.76],de=.1;function rs(){const r=D.useRef(null),e=D.useRef(null),t=D.useRef(null),s=D.useRef(null),a=D.useRef(null),i=D.useRef(null),o=D.useRef(null),h=D.useRef(null),u=D.useRef(null),[m,p]=D.useState(!1);return D.useEffect(()=>{const f=e.current,T=matchMedia("(prefers-reduced-motion: reduce)").matches;let M;try{M=new Et({antialias:!0,powerPreference:"high-performance"})}catch{p(!0);return}M.setPixelRatio(Math.min(devicePixelRatio,2)),M.toneMapping=Ze,M.toneMappingExposure=1.05,M.outputColorSpace=Nt,f.appendChild(M.domElement);const n=new At,l=new et(30,1,.1,200);n.background=new $(131587),n.environment=jt(M),n.environmentIntensity=1;const c=new ve(16777215,1.4);c.position.set(-3,5,5),n.add(c);const g=new ve(14082284,.6);g.position.set(5,1,3),n.add(g);const P=new ve(12571368,1.6);P.position.set(0,3,-6),n.add(P);const N=new Ft(16777215,0,6);n.add(N);const B=-1.75;if(innerWidth>=768){const S=new pe(new We(30,30),{textureWidth:1024,textureHeight:1024,color:5922662});S.rotation.x=-Math.PI/2,S.position.y=B,n.add(S);const H=new y(new We(30,30),new Je({color:131587,transparent:!0,opacity:.86,depthWrite:!1}));H.rotation.x=-Math.PI/2,H.position.y=B+.002,n.add(H)}const{group:w,pieces:C}=ss(),z=new me;z.add(w),n.add(z),h.current&&(h.current.textContent=String(C.length));const b=C.map(S=>S.t0),oe=Math.min(...b),V=Math.max(...b),R=C.map(S=>(S.t0-oe)/(V-oe||1)),I=new Wt(M);I.addPass(new Ht(n,l));const ge=new J(new F(1,1),.16,.4,.96);I.addPass(ge),I.addPass(new Kt);let G=1,Q=1,W=!1;const Se=()=>{G=f.clientWidth,Q=f.clientHeight,W=G<768,M.setSize(G,Q),I.setPixelRatio(Math.min(devicePixelRatio,W?1.5:2)),I.setSize(G,Q),l.aspect=G/Q,l.updateProjectionMatrix()};Se();const Ce=new ResizeObserver(Se);Ce.observe(f);let _e=0,_=0;const at=Dt.create({trigger:r.current,start:"top top",end:"bottom bottom",onUpdate:S=>{T||(_e=S.progress)}}),ne={x:0,y:0},j={x:0,y:0},ye=S=>{ne.x=S.clientX/innerWidth-.5,ne.y=S.clientY/innerHeight-.5};addEventListener("pointermove",ye);let Pe=!0,Re=0,Ee=performance.now(),le=0,Ne=-1;const Ae=new IntersectionObserver(([S])=>{Pe=S.isIntersecting});Ae.observe(f);const Fe=new v,rt=new v(0,1,0),De=C.map(()=>0),Ue=C.map(()=>0),Be=()=>{Re=requestAnimationFrame(Be);const S=performance.now(),H=Math.min(.05,(S-Ee)/1e3);if(Ee=S,!Pe)return;T||(le+=H),_+=(_e-_)*(1-Math.exp(-H*6)),j.x+=(ne.x-j.x)*.05,j.y+=(ne.y-j.y)*.05;const ce=W?.7:1;let ee=0;C.forEach((x,X)=>{const lt=O(ue[0],ue[1],1-R[X]),ct=O(fe[0],fe[1],R[X]),L=$e(be((_-lt)/de))-$e(be((_-ct)/de));if(L<.02&&ee++,De[X]>=.02&&L<.02&&(x.kind==="housing"?Me.clunk(.6):Me.click(x.kind==="ring"||x.kind==="letter"?1:.6,x.kind==="letter"?.85:1.1)),x.kind==="screw"){const je=Math.floor(L*14);je!==Ue[X]&&(Me.tick(1+X%3*.08),Ue[X]=je)}De[X]=L,Fe.set(x.home.x+(x.from.x-x.home.x)*ce,x.home.y+(x.from.y-x.home.y)*ce,x.home.z+(x.from.z-x.home.z)*ce),x.obj.position.lerpVectors(x.home,Fe,L),x.obj.position.y+=Math.sin(le*.8+x.phase)*.035*L,x.obj.quaternion.slerpQuaternions(x.homeQ,x.fromQ,L),x.kind==="screw"&&x.obj.rotateOnAxis(rt,L*Math.PI*8)});const he=A(ue[0],ue[1]+de,_)-A(fe[0],fe[1]+de,_),ze=A(.86,.95,_);N.intensity=ze*1.4,N.position.set(Math.sin(le*.6)*2.8,1.4,3.6);const ke=A(.02,.2,_),te=Math.tan(It.degToRad(l.fov/2)),se=te*l.aspect,ot=W?Math.max(2.3*ce/se,2.8/te):Math.max(3.3/te,4.4/se),Ie=W?Math.max(1.45/se,2.2/te):Math.max(2.25/te,2.9/se),nt=O(Ie,ot,he);z.position.set(O(W?0:Ie*se*.5,0,ke),O(W?-.95:-.05,O(.05,-.2,he),ke),0),w.rotation.y=O(O(-.3,-.6,he),0,A(.62,.9,_))+j.x*.45+Math.sin(le*.45)*.22*ze,w.rotation.x=.06*he+j.y*.2,l.position.set(-j.x*.6,.85-j.y*.3,nt),l.lookAt(0,-.05,0),I.render(H),t.current.style.opacity=String(1-A(.02,.12,_)),t.current.style.transform=`translateY(${-A(.02,.12,_)*50}px)`,s.current.style.opacity=String(A(.86,.94,_)),s.current.style.transform=`translateY(${(1-A(.86,.94,_))*24}px)`,a.current.style.opacity=String(1-A(.01,.06,_)),i.current.style.opacity=String(A(.05,.1,_)*(1-A(.84,.88,_))),ee!==Ne&&(Ne=ee,o.current.textContent=String(ee)),u.current.style.transform=`scaleX(${ee/C.length})`};return Be(),()=>{cancelAnimationFrame(Re),at.kill(),Ce.disconnect(),Ae.disconnect(),removeEventListener("pointermove",ye),I.dispose(),M.dispose(),f.innerHTML=""}},[]),d.jsx("section",{ref:r,className:"relative h-[100svh] motion-safe:h-[460vh]","aria-label":"Presentación",children:d.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden bg-black",children:[m&&d.jsx("img",{src:Ut.neon,alt:"Rótulo de neón de Vegawagen",className:"absolute inset-0 h-full w-full object-cover opacity-60"}),d.jsx("div",{ref:e,className:"absolute inset-0",role:"img","aria-label":"Emblema cromado que se desmonta y se vuelve a montar al hacer scroll"}),d.jsxs("div",{ref:t,className:"pointer-events-none absolute inset-0",children:[d.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_36%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.5)_46%,transparent_66%)]"}),d.jsxs("div",{className:"relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0",children:[d.jsx("p",{className:"kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]",children:k.hero.kicker}),d.jsxs("h1",{className:"h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]",children:[d.jsx("span",{className:"grad-text block",children:k.hero.title[0]}),d.jsx("span",{className:"neon-text block",children:k.hero.title[1]})]}),d.jsx("p",{className:"mt-5 max-w-md text-[16px] leading-relaxed text-white/70 md:mt-7 md:text-[18px]",children:k.hero.text}),d.jsxs("div",{className:"pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9",children:[d.jsxs("a",{href:k.phoneHref,className:"btn-neon",children:[d.jsx(Bt,{})," ",k.phone]}),d.jsxs("a",{href:k.whatsappHref,target:"_blank",rel:"noopener",className:"btn-ghost",children:[d.jsx(zt,{})," WhatsApp"]}),d.jsxs("span",{className:"hidden items-center gap-2 text-[14px] text-white/65 sm:flex",children:[d.jsx("span",{className:"text-neon",children:"★"})," ",k.rating.toLocaleString("es-ES")," en Google"]})]})]})]}),d.jsxs("div",{ref:i,className:"pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0",children:[d.jsxs("p",{className:"font-mono text-[11px] uppercase tracking-[0.25em] text-white/60",children:["Piezas en su sitio · ",d.jsx("span",{ref:o,className:"text-neon",children:"26"}),"/",d.jsx("span",{ref:h,children:"26"})]}),d.jsx("div",{className:"mt-3 h-px overflow-hidden bg-white/15",children:d.jsx("div",{ref:u,className:"h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]",style:{transform:"scaleX(1)"}})})]}),d.jsxs("div",{ref:s,className:"pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center opacity-0 md:bottom-10",children:[d.jsx(kt,{className:"mx-auto text-[28px] sm:text-[44px] md:text-[56px]"}),d.jsx("p",{className:"mt-3 text-[11px] uppercase tracking-[0.3em] text-white/65 md:text-[13px]",children:k.hero.outro})]}),d.jsx("p",{ref:a,className:"pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/50 motion-reduce:hidden md:text-[11px]","aria-hidden":!0,children:k.hero.scroll})]})})}export{rs as default};
