import{M as We,O as it,B as Xe,F as Oe,S as A,U as Z,V as x,W as $,H as J,N as at,C as rt,a as ee,b as w,A as Ye,c as Ke,R as ot,d as nt,e as lt,L as ht,f as ut,g as ct,h as qe,i as ft,j as dt,r as M,k as mt,l as pt,m as gt,P as xt,n as vt,o as bt,D as Ge,p as ge,q as Qe,s as Mt,G as Tt,t as wt,u as Ct,v as St,w as _t,x as yt,y as Pt,z as Rt,E as o,I as Nt,J as T,K as Et,Q as At,T as Bt,X as Ve,Y as Ft}from"./index-Cs0TPfdj.js";import{R as Dt}from"./RoomEnvironment-hxjCSFYU.js";const $e={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class F{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Ut=new it(-1,1,1,-1,0,1);class zt extends Xe{constructor(){super(),this.setAttribute("position",new Oe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Oe([0,2,0,0,2,0],2))}}const kt=new zt;class ve{constructor(e){this._mesh=new We(kt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Ut)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class jt extends F{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof A?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Z.clone(e.uniforms),this.material=new A({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new ve(this.material)}render(e,t,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class He extends F{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,i){const r=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let n,c;this.inverse?(n=0,c=1):(n=1,c=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),s.buffers.stencil.setFunc(r.ALWAYS,n,4294967295),s.buffers.stencil.setClear(c),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(r.EQUAL,1,4294967295),s.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),s.buffers.stencil.setLocked(!0)}}class Lt extends F{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class It{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const i=e.getSize(new x);this._width=i.width,this._height=i.height,t=new $(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:J}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new jt($e),this.copyPass.material.blending=at,this.clock=new rt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let i=!1;for(let r=0,s=this.passes.length;r<s;r++){const n=this.passes[r];if(n.enabled!==!1){if(n.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),n.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),n.needsSwap){if(i){const c=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(c.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(c.EQUAL,1,4294967295)}this.swapBuffers()}He!==void 0&&(n instanceof He?i=!0:n instanceof Lt&&(i=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new x);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const i=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(i,r),this.renderTarget2.setSize(i,r);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ot extends F{constructor(e,t,i=null,r=null,s=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=i,this.clearColor=r,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new ee}render(e,t,i){const r=e.autoClear;e.autoClear=!1;let s,n;this.overrideMaterial!==null&&(n=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=n),e.autoClear=r}}const Gt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ee(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class B extends F{constructor(e,t,i,r){super(),this.strength=t!==void 0?t:1,this.radius=i,this.threshold=r,this.resolution=e!==void 0?new x(e.x,e.y):new x(256,256),this.clearColor=new ee(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);this.renderTargetBright=new $(s,n,{type:J}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const p=new $(s,n,{type:J});p.texture.name="UnrealBloomPass.h"+f,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const d=new $(s,n,{type:J});d.texture.name="UnrealBloomPass.v"+f,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),s=Math.round(s/2),n=Math.round(n/2)}const c=Gt;this.highPassUniforms=Z.clone(c.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new A({uniforms:this.highPassUniforms,vertexShader:c.vertexShader,fragmentShader:c.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];s=Math.round(this.resolution.x/2),n=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new x(1/s,1/n),s=Math.round(s/2),n=Math.round(n/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const te=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=te,this.bloomTintColors=[new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1),new w(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const v=$e;this.copyUniforms=Z.clone(v.uniforms),this.blendMaterial=new A({uniforms:this.copyUniforms,vertexShader:v.vertexShader,fragmentShader:v.fragmentShader,blending:Ye,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new ee,this.oldClearAlpha=1,this.basic=new Ke,this.fsQuad=new ve(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let i=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(i,r);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,r),this.renderTargetsVertical[s].setSize(i,r),this.separableBlurMaterials[s].uniforms.invSize.value=new x(1/i,1/r),i=Math.round(i/2),r=Math.round(r/2)}render(e,t,i,r,s){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const n=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=i.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let c=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=c.texture,this.separableBlurMaterials[u].uniforms.direction.value=B.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=B.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),c=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(i),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=n}getSeperableBlurMaterial(e){const t=[];for(let i=0;i<e;i++)t.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new A({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new x(.5,.5)},direction:{value:new x(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new A({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}B.BlurDirectionX=new x(1,0);B.BlurDirectionY=new x(0,1);const Qt={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Vt extends F{constructor(){super();const e=Qt;this.uniforms=Z.clone(e.uniforms),this.material=new ot({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new ve(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},nt.getTransfer(this._outputColorSpace)===lt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ht?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===ut?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ct?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===qe?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===ft?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===dt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}const xe=(l,e=0,t=1)=>Math.min(t,Math.max(e,l)),g=(l,e,t)=>{const i=xe((t-l)/(e-l));return i*i*(3-2*i)},N=(l,e,t)=>l+(e-l)*t,Ht=l=>1-(1-l)**3,Wt=(l,e=1.25)=>1+(e+1)*(l-1)**3+e*(l-1)**2;function Kt(){const l=M.useRef(null),e=M.useRef(null),t=M.useRef(null),i=M.useRef(null),r=M.useRef(null),s=M.useRef(null),n=M.useRef(null),c=M.useRef(null),[u,te]=M.useState(!1);return M.useEffect(()=>{const v=e.current,f=matchMedia("(prefers-reduced-motion: reduce)").matches;let p;try{p=new mt({antialias:!0,powerPreference:"high-performance"})}catch{te(!0);return}p.setPixelRatio(Math.min(devicePixelRatio,2)),p.toneMapping=qe,p.toneMappingExposure=1.1,p.outputColorSpace=pt,v.appendChild(p.domElement);const d=new gt,_=new xt(30,1,.1,100);d.background=vt();const be=new bt(p);d.environment=be.fromScene(new Dt,.03).texture,d.environmentIntensity=.75;const Me=new Ge(16777215,2.2);Me.position.set(3,5,6),d.add(Me);const Te=new Ge(10148095,.8);Te.position.set(-6,2,-3),d.add(Te);const se=new ge(Qe,0,9),ie=new ge(Qe,0,9);se.position.set(-2.2,1.6,2.4),ie.position.set(2.4,-1.4,2.2),d.add(se,ie);const ae=new ge(16777215,0,7);d.add(ae);const{group:D,pieces:re,gear:Je,materials:Ze}=Mt(),U=new Tt;U.add(D),d.add(U);const oe=wt();d.add(oe.points);const ne=re.map(()=>0),le=new w,G=new w,we=new w,Ce=new w;let z=0;const he=new We(new Ct(9,9),new Ke({map:St(),transparent:!0,opacity:0,blending:Ye,depthWrite:!1}));he.position.z=-1.4,U.add(he);const ue=260,Q=new Float32Array(ue*3);for(let m=0;m<ue;m++)Q[m*3]=(Math.random()-.5)*14,Q[m*3+1]=(Math.random()-.5)*9,Q[m*3+2]=(Math.random()-.5)*6;const ce=new Xe;ce.setAttribute("position",new _t(Q,3)),d.add(new yt(ce,new Pt({color:12580602,size:.022,transparent:!0,opacity:.45,depthWrite:!1})));const y=new It(p);y.addPass(new Ot(d,_));const Se=new B(new x(1,1),.2,.5,.92);y.addPass(Se),y.addPass(new Vt);let k=1,V=1,b=!1;const _e=()=>{k=v.clientWidth,V=v.clientHeight,b=k<768,p.setSize(k,V),y.setPixelRatio(Math.min(devicePixelRatio,b?1.5:2)),y.setSize(k,V),_.aspect=k/V,_.updateProjectionMatrix()};_e();const ye=new ResizeObserver(_e);ye.observe(v);let H=f?1:0,h=H;const et=Rt.create({trigger:l.current,start:"top top",end:"bottom bottom",onUpdate:m=>{f||(H=m.progress)}}),W={x:0,y:0},C={x:0,y:0},Pe=m=>{W.x=m.clientX/innerWidth-.5,W.y=m.clientY/innerHeight-.5};addEventListener("pointermove",Pe);let Re=!0,Ne=0,Ee=performance.now(),E=0,Ae=0,Be=h,Fe=-1;const De=new IntersectionObserver(([m])=>{Re=m.isIntersecting});De.observe(v);const Ue=new Ve,ze=new Ve,ke=new w(0,0,1),je=()=>{Ne=requestAnimationFrame(je);const m=performance.now(),S=Math.min(.05,(m-Ee)/1e3);if(Ee=m,!Re)return;f||(E+=S),h+=(H-h)*(1-Math.exp(-S*6)),C.x+=(W.x-C.x)*.05,C.y+=(W.y-C.y)*.05;const tt=Math.abs(h-Be)/Math.max(S,.001);Be=h,f||(Ae+=S*(.2+Math.min(tt*4,5)));const X=b?.72:.85;let j=0;re.forEach((a,P)=>{const R=xe((h-a.t0)/(a.t1-a.t0)),I=Ht(R),O=1-I;if(R>=1&&j++,we.set(a.home.x+(a.from.x-a.home.x)*X,a.home.y+(a.from.y-a.home.y)*X,a.from.z),Ce.set(a.home.x+(a.ctrl.x-a.home.x)*X,a.home.y+(a.ctrl.y-a.home.y)*X,a.ctrl.z),G.copy(we).multiplyScalar(O*O).addScaledVector(Ce,2*O*I).addScaledVector(a.home,I*I),G.z-=.07*Math.sin(Math.PI*xe((R-.8)/.2)),G.y+=Math.sin(E*.9+a.phase)*.12*O,a.obj.position.copy(G),ze.setFromAxisAngle(a.axis,E*.35*O),Ue.copy(a.fromQ).multiply(ze).slerp(a.homeQ,R>=1?1:Wt(R)),a.obj.quaternion.copy(Ue),a.kind==="bolt"&&a.obj.rotateOnAxis(ke,(1-I)*Math.PI*6),ne[P]<1&&R>=1&&H>ne[P]&&!f){le.copy(a.home),D.localToWorld(le);const Ie=a.kind==="bolt"?26:a.kind==="w"?16:a.kind==="neon"?0:8;Ie&&oe.emit(le,Ie,a.kind==="bolt"?3.4:2.4),z=Math.min(1,z+(a.kind==="bolt"||a.kind==="gear"?.5:a.kind==="w"?.3:.12))}ne[P]=R}),oe.update(S),Je.rotateOnAxis(ke,Ae);const fe=g(.73,.8,h),st=fe>0&&fe<1?Math.sin(h*2400)>-.3?1:.12:1,Y=fe*st;Ze.neon.emissiveIntensity=.04+Y*2.4,se.intensity=ie.intensity=Y*1.6,he.material.opacity=.04+Y*(b?.14:.3),Se.strength=.18+Y*(b?.3:.5),ae.intensity=g(.82,.9,h)*2.2,ae.position.set(Math.sin(E*.7)*3,1.1+Math.cos(E*.45)*.5,2.6);const de=g(.04,.3,h),Le=g(.8,.95,h),L=Math.tan(Ft.degToRad(_.fov/2)),me=L*_.aspect,K=b?Math.max(2.05/(me*.9),1.95/(L*.42)):Math.max(1.95/(L*.56),1.95/(me*.6));U.position.set(N(b?0:K*me*.42,0,de),N(b?-K*L*.42:0,K*L*(b?.1:.12),de),0),U.scale.setScalar(N(.82,1,de));const q=g(.04,.78,h);D.rotation.y=C.x*.5+Math.sin(E*.5)*.3*Le+N(b?-.5:-.8,0,q),D.rotation.x=C.y*.3+N(.32,0,q)-.06*Le,D.rotation.z=N(.12,0,q);const pe=ce.attributes.position;for(let a=0;a<ue;a++){let P=pe.getY(a)+S*.08;P>4.5&&(P=-4.5),pe.setY(a,P)}pe.needsUpdate=!0,z*=Math.exp(-S*9),_.position.set(-C.x*.5+(Math.random()-.5)*z*.05,-C.y*.35+(Math.random()-.5)*z*.05,K*N(1.1,1,q)),_.lookAt(0,0,0),y.render(S),t.current.style.opacity=String(1-g(.02,.12,h)),t.current.style.transform=`translateY(${-g(.02,.12,h)*50}px)`,i.current.style.opacity=String(g(.8,.9,h)),i.current.style.transform=`translateY(${(1-g(.8,.9,h))*24}px)`,r.current.style.opacity=String(1-g(.01,.06,h)),s.current.style.opacity=String(g(.05,.12,h)*(1-g(.76,.82,h))),j!==Fe&&(Fe=j,n.current.textContent=String(j)),c.current.style.transform=`scaleX(${j/re.length})`};return je(),()=>{cancelAnimationFrame(Ne),et.kill(),ye.disconnect(),De.disconnect(),removeEventListener("pointermove",Pe),be.dispose(),y.dispose(),p.dispose(),v.innerHTML=""}},[]),o.jsx("section",{ref:l,className:"relative h-[100svh] motion-safe:h-[440vh]","aria-label":"Presentación",children:o.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden bg-ink",children:[u&&o.jsx("img",{src:Nt.neon,alt:"Rótulo de neón de Vegawagen",className:"absolute inset-0 h-full w-full object-cover opacity-60"}),o.jsx("div",{ref:e,className:"absolute inset-0",role:"img","aria-label":"Emblema de Vegawagen en 3D que se monta pieza a pieza al hacer scroll y enciende su neón"}),o.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_55%,rgba(7,9,12,.85))]"}),o.jsxs("div",{ref:t,className:"pointer-events-none absolute inset-0",children:[o.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.75)_38%,transparent_62%)] max-md:bg-[linear-gradient(180deg,rgba(7,9,12,.92)_0%,rgba(7,9,12,.7)_48%,transparent_70%)]"}),o.jsxs("div",{className:"relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0",children:[o.jsx("p",{className:"kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]",children:T.hero.kicker}),o.jsxs("h1",{className:"h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]",children:[o.jsx("span",{className:"block",children:T.hero.title[0]}),o.jsx("span",{className:"neon-text block",children:T.hero.title[1]})]}),o.jsx("p",{className:"mt-5 max-w-md text-[16px] leading-relaxed text-white/65 md:mt-7 md:text-[18px]",children:T.hero.text}),o.jsxs("div",{className:"pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9",children:[o.jsxs("a",{href:T.phoneHref,className:"btn-neon",children:[o.jsx(Et,{})," ",T.phone]}),o.jsxs("a",{href:T.whatsappHref,target:"_blank",rel:"noopener",className:"btn-ghost",children:[o.jsx(At,{})," WhatsApp"]}),o.jsxs("span",{className:"hidden items-center gap-2 text-[14px] text-white/60 sm:flex",children:[o.jsx("span",{className:"text-neon",children:"★"})," ",T.rating.toLocaleString("es-ES")," en Google"]})]})]})]}),o.jsxs("div",{ref:s,className:"pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0",children:[o.jsxs("p",{className:"font-mono text-[11px] uppercase tracking-[0.25em] text-white/55",children:["Montando pieza a pieza · ",o.jsx("span",{ref:n,className:"text-neon",children:"0"}),"/43"]}),o.jsx("div",{className:"mt-3 h-px overflow-hidden bg-white/10",children:o.jsx("div",{ref:c,className:"h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]",style:{transform:"scaleX(0)"}})})]}),o.jsxs("div",{ref:i,className:"pointer-events-none absolute inset-x-0 bottom-20 px-5 text-center opacity-0 md:bottom-14",children:[o.jsx(Bt,{className:"mx-auto text-[28px] sm:text-[44px] md:text-[58px]"}),o.jsx("p",{className:"mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60 md:text-[13px]",children:T.hero.outro})]}),o.jsx("p",{ref:r,className:"pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/45 motion-reduce:hidden md:text-[11px]","aria-hidden":!0,children:T.hero.scroll})]})})}export{Kt as default};
