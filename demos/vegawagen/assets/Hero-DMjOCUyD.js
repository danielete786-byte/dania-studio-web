import{M as C,O as mt,B as _e,F as Qe,S as H,U as re,V as U,W as ae,H as oe,N as pt,C as gt,a as K,b as g,A as xt,c as ge,R as vt,d as wt,e as bt,L as Mt,f as Tt,g as St,h as st,i as Ct,j as yt,P as it,k as _t,l as He,m as Xe,n as Pe,o as Re,p as Pt,q as Se,r as Ye,G as ie,s as W,T as Rt,t as Ke,u as Et,v as at,E as ot,w as qe,Q as Nt,x as At,y as Q,z as B,D as Dt,I as Ft,J as zt,K as Ce,X as Ut,Y as pe,Z as Bt,_ as f,$ as kt,a0 as I,a1 as It,a2 as jt,a3 as Lt,a4 as Ot}from"./index-oloTHjf7.js";import{R as Vt}from"./RoomEnvironment-D_IJ-305.js";const rt={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ${constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Gt=new mt(-1,1,1,-1,0,1);class Wt extends _e{constructor(){super(),this.setAttribute("position",new Qe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Qe([0,2,0,0,2,0],2))}}const Qt=new Wt;class Ee{constructor(e){this._mesh=new C(Qt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Gt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ht extends ${constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof H?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=re.clone(e.uniforms),this.material=new H({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new Ee(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class $e extends ${constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const o=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let r,h;this.inverse?(r=0,h=1):(r=1,h=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),a.buffers.stencil.setFunc(o.ALWAYS,r,4294967295),a.buffers.stencil.setClear(h),a.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(o.EQUAL,1,4294967295),a.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),a.buffers.stencil.setLocked(!0)}}class Xt extends ${constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Yt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new U);this._width=s.width,this._height=s.height,t=new ae(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:oe}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ht(rt),this.copyPass.material.blending=pt,this.clock=new gt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let o=0,a=this.passes.length;o<a;o++){const r=this.passes[o];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),r.needsSwap){if(s){const h=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}$e!==void 0&&(r instanceof $e?s=!0:r instanceof Xt&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new U);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(s,o),this.renderTarget2.setSize(s,o);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(s,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Kt extends ${constructor(e,t,s=null,o=null,a=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=o,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new K}render(e,t,s){const o=e.autoClear;e.autoClear=!1;let a,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=o}}const qt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new K(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class q extends ${constructor(e,t,s,o){super(),this.strength=t!==void 0?t:1,this.radius=s,this.threshold=o,this.resolution=e!==void 0?new U(e.x,e.y):new U(256,256),this.clearColor=new K(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new ae(a,r,{type:oe}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let d=0;d<this.nMips;d++){const T=new ae(a,r,{type:oe});T.texture.name="UnrealBloomPass.h"+d,T.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(T);const b=new ae(a,r,{type:oe});b.texture.name="UnrealBloomPass.v"+d,b.texture.generateMipmaps=!1,this.renderTargetsVertical.push(b),a=Math.round(a/2),r=Math.round(r/2)}const h=qt;this.highPassUniforms=re.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new H({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];a=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let d=0;d<this.nMips;d++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[d])),this.separableBlurMaterials[d].uniforms.invSize.value=new U(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const p=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=p,this.bloomTintColors=[new g(1,1,1),new g(1,1,1),new g(1,1,1),new g(1,1,1),new g(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const x=rt;this.copyUniforms=re.clone(x.uniforms),this.blendMaterial=new H({uniforms:this.copyUniforms,vertexShader:x.vertexShader,fragmentShader:x.fragmentShader,blending:xt,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new K,this.oldClearAlpha=1,this.basic=new ge,this.fsQuad=new Ee(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let s=Math.round(e/2),o=Math.round(t/2);this.renderTargetBright.setSize(s,o);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(s,o),this.renderTargetsVertical[a].setSize(s,o),this.separableBlurMaterials[a].uniforms.invSize.value=new U(1/s,1/o),s=Math.round(s/2),o=Math.round(o/2)}render(e,t,s,o,a){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=s.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let h=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[u].uniforms.direction.value=q.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=q.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),h=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=r}getSeperableBlurMaterial(e){const t=[];for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new H({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new U(.5,.5)},direction:{value:new U(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new H({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}q.BlurDirectionX=new U(1,0);q.BlurDirectionY=new U(0,1);const $t={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Zt extends ${constructor(){super();const e=$t;this.uniforms=re.clone(e.uniforms),this.material=new vt({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new Ee(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},wt.getTransfer(this._outputColorSpace)===bt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Mt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Tt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===St?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===st?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Ct?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===yt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class xe extends C{constructor(e,t={}){super(e),this.isReflector=!0,this.type="Reflector",this.camera=new it;const s=this,o=t.color!==void 0?new K(t.color):new K(8355711),a=t.textureWidth||512,r=t.textureHeight||512,h=t.clipBias||0,u=t.shader||xe.ReflectorShader,p=t.multisample!==void 0?t.multisample:4,x=new _t,d=new g,T=new g,b=new g,w=new He,n=new g(0,0,-1),l=new Xe,c=new g,v=new g,R=new Xe,F=new He,S=this.camera,N=new ae(a,r,{samples:p,type:oe}),z=new H({name:u.name!==void 0?u.name:"unspecified",uniforms:re.clone(u.uniforms),fragmentShader:u.fragmentShader,vertexShader:u.vertexShader});z.uniforms.tDiffuse.value=N.texture,z.uniforms.color.value=o,z.uniforms.textureMatrix.value=F,this.material=z,this.onBeforeRender=function(M,j,A){if(T.setFromMatrixPosition(s.matrixWorld),b.setFromMatrixPosition(A.matrixWorld),w.extractRotation(s.matrixWorld),d.set(0,0,1),d.applyMatrix4(w),c.subVectors(T,b),c.dot(d)>0)return;c.reflect(d).negate(),c.add(T),w.extractRotation(A.matrixWorld),n.set(0,0,-1),n.applyMatrix4(w),n.add(b),v.subVectors(T,n),v.reflect(d).negate(),v.add(T),S.position.copy(c),S.up.set(0,1,0),S.up.applyMatrix4(w),S.up.reflect(d),S.lookAt(v),S.far=A.far,S.updateMatrixWorld(),S.projectionMatrix.copy(A.projectionMatrix),F.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),F.multiply(S.projectionMatrix),F.multiply(S.matrixWorldInverse),F.multiply(s.matrixWorld),x.setFromNormalAndCoplanarPoint(d,T),x.applyMatrix4(S.matrixWorldInverse),l.set(x.normal.x,x.normal.y,x.normal.z,x.constant);const _=S.projectionMatrix;R.x=(Math.sign(l.x)+_.elements[8])/_.elements[0],R.y=(Math.sign(l.y)+_.elements[9])/_.elements[5],R.z=-1,R.w=(1+_.elements[10])/_.elements[14],l.multiplyScalar(2/l.dot(R)),_.elements[2]=l.x,_.elements[6]=l.y,_.elements[10]=l.z+1-h,_.elements[14]=l.w,s.visible=!1;const ve=M.getRenderTarget(),X=M.xr.enabled,we=M.shadowMap.autoUpdate;M.xr.enabled=!1,M.shadowMap.autoUpdate=!1,M.setRenderTarget(N),M.state.buffers.depth.setMask(!0),M.autoClear===!1&&M.clear(),M.render(j,S),M.xr.enabled=X,M.shadowMap.autoUpdate=we,M.setRenderTarget(ve);const ne=A.viewport;ne!==void 0&&M.state.viewport(ne),s.visible=!0},this.getRenderTarget=function(){return N},this.dispose=function(){N.dispose(),s.material.dispose()}}}xe.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
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

		}`};const k=Math.PI*2,D=U;function Ze(i,e){let t=i;for(let s=0;s<e.length;s++){const o=e[s],a=e[(s+1)%e.length],r=t;t=[];const h=p=>(a.x-o.x)*(p.y-o.y)-(a.y-o.y)*(p.x-o.x)>=0,u=(p,x)=>{const d=(a.x-o.x)*(p.y-o.y)-(a.y-o.y)*(p.x-o.x),T=(a.x-o.x)*(x.y-o.y)-(a.y-o.y)*(x.x-o.x);return p.clone().lerp(x,d/(d-T))};for(let p=0;p<r.length;p++){const x=r[p],d=r[(p+1)%r.length];h(d)?(h(x)||t.push(u(x,d)),t.push(d)):h(x)&&t.push(u(x,d))}}return t}const Jt=(i,e=96)=>Array.from({length:e},(t,s)=>new D(Math.cos(s/e*k)*i,Math.sin(s/e*k)*i)),Je=(i,e)=>i.x*e.y-i.y*e.x,es=(i,e,t,s)=>i.clone().addScaledVector(e,Je(t.clone().sub(i),s)/Je(e,s));function et(i,e){const t=i.slice(0,-1).map((o,a)=>{const r=i[a+1].clone().sub(o).normalize();return{p:o,d:r,n:new D(-r.y,r.x)}}),s=o=>i.map((a,r)=>{if(r===0)return a.clone().addScaledVector(t[0].d,-.3).addScaledVector(t[0].n,o*e);if(r===i.length-1){const p=t[r-1];return a.clone().addScaledVector(p.d,.3).addScaledVector(p.n,o*e)}const h=t[r-1],u=t[r];return es(h.p.clone().addScaledVector(h.n,o*e),h.d,u.p.clone().addScaledVector(u.n,o*e),u.d)});return[...s(1),...s(-1).reverse()]}function ye(i,e,t,s,o=12){const a=i.reduce((p,x)=>p.add(x),new D).divideScalar(i.length),r=new at(i.map(p=>p.clone().sub(a))),h=new ot(r,{depth:e,bevelEnabled:!0,bevelThickness:t,bevelSize:t*.8,bevelSegments:4,curveSegments:o});h.translate(0,0,-e/2);const u=new C(h,s);return u.position.set(a.x,a.y,0),u}function ts(i,e,t,s,o=28){const a=[];for(let r=0;r<=o;r++){const h=t+(s-t)*r/o;a.push(new D(Math.cos(h)*e,Math.sin(h)*e))}for(let r=o;r>=0;r--){const h=t+(s-t)*r/o;a.push(new D(Math.cos(h)*i,Math.sin(h)*i))}return a}class ss extends At{constructor(e,t,s){super(),this.r=e,this.len=t,this.turns=s}getPoint(e,t=new g){const s=e*this.turns*k;return t.set(this.r*Math.cos(s),this.r*Math.sin(s),e*this.len-this.len/2)}}const tt=.078,is=[new D(Math.cos(1.98)*.98,Math.sin(1.98)*.98),new D(0,-.04),new D(Math.cos(1.16)*.98,Math.sin(1.16)*.98)],as=[new D(Math.cos(2.84)*.98,Math.sin(2.84)*.98),new D(Math.cos(4.3)*.86,Math.sin(4.3)*.86),new D(0,-.12),new D(Math.cos(5.124)*.86,Math.sin(5.124)*.86),new D(Math.cos(.302)*.98,Math.sin(.302)*.98)];function os(){const i={chrome:new Ye({color:15659509,metalness:1,roughness:.1,clearcoat:.8,clearcoatRoughness:.06}),field:new Ye({color:855826,metalness:.2,roughness:.25,clearcoat:1,clearcoatRoughness:.08}),plastic:new Se({color:1513756,metalness:.05,roughness:.62}),metal:new Se({color:11120567,metalness:1,roughness:.3}),brass:new Se({color:13148762,metalness:1,roughness:.28}),line:new Pt({color:14673646,dashSize:.05,gapSize:.04,transparent:!0,opacity:.45,depthWrite:!1})},e=new ie,t=[];let s=3;const o=()=>(s=s*16807%2147483647,(s-1)/2147483646),a=(n,l,c,v,R=.12,F,S)=>{e.add(n);const N=n.position.clone(),z=n.quaternion.clone(),M=N.clone().add(c),j=F?new Nt().setFromEuler(F).multiply(z):z.clone(),A=new qe(new _e().setFromPoints([N,M]),i.line);A.computeLineDistances(),e.add(A),t.push({obj:n,home:N,homeQ:z,from:M,fromQ:j,t0:v,t1:v+R,phase:o()*k,kind:l,line:A,screwAxis:S})},r=new ie,h=new C(new W(.97,.95,.16,96).rotateX(Math.PI/2),i.plastic);r.add(h);const u=new C(new Rt(.62,.025,8,80),i.plastic);u.position.z=.09,r.add(u);for(let n=0;n<8;n++){const l=new C(new Ke(.34,.035,.05),i.plastic),c=n*k/8;l.position.set(Math.cos(c)*.4,Math.sin(c)*.4,.1),l.rotation.z=c,r.add(l)}for(let n=0;n<4;n++){const l=Math.PI/4+n*k/4,c=new C(new W(.07,.07,.1,24).rotateX(Math.PI/2),i.plastic);c.position.set(Math.cos(l)*.78,Math.sin(l)*.78,.1),r.add(c);const v=new C(new W(.03,.03,.1,16).rotateX(Math.PI/2),i.metal);v.position.copy(c.position),v.position.z+=.005,r.add(v)}const p=new C(new W(.16,.16,.12,32).rotateX(Math.PI/2),i.plastic);p.position.z=.1,r.add(p);for(const n of[-1,1]){const l=new C(new Ke(.16,.1,.22),i.plastic);l.position.set(n*.98,0,-.04),r.add(l)}r.position.z=-.17,a(r,"housing",new g(1.55,.05,-1.4),.08,.14,new Q(0,-.7,0));for(let n=0;n<4;n++){const l=n*k/4,c=new C(new Et(new ss(.045,.16,5),80,.008,6),i.metal);c.position.set(Math.cos(l)*.5,Math.sin(l)*.5,-.1),a(c,"spring",new g(Math.cos(l)*.7+.9,Math.sin(l)*.7,-.9),.17+n*.015,.1,new Q(o()*2,o()*2,0))}for(let n=0;n<4;n++){const l=Math.PI/2+n*k/4,c=new at;c.moveTo(-.12,-.05),c.lineTo(.12,-.05),c.lineTo(.12,.08),c.lineTo(.07,.08),c.lineTo(.07,0),c.lineTo(-.07,0),c.lineTo(-.07,.08),c.lineTo(-.12,.08),c.closePath();const v=new C(new ot(c,{depth:.05,bevelEnabled:!0,bevelThickness:.01,bevelSize:.008,bevelSegments:2}).translate(0,0,-.025),i.metal);v.position.set(Math.cos(l)*.72,Math.sin(l)*.72,-.02),v.rotation.z=l-Math.PI/2,a(v,"bracket",new g(Math.cos(l)*.75,Math.sin(l)*.75,.35),.24+n*.02,.11,new Q(.6,0,0))}const x=new C(new W(.87,.87,.04,96).rotateX(Math.PI/2),i.field);x.position.z=.02,a(x,"field",new g(.75,0,-.55),.32,.12,new Q(0,-.4,0));const d=Jt(.95),T=ye(Ze(et(as,tt),d),.12,.03,i.chrome);T.position.z+=.11,a(T,"letter",new g(-.25,-.35,1),.4,.14,new Q(.2,.35,0));const b=ye(Ze(et(is,tt),d),.12,.03,i.chrome);b.position.z+=.11,a(b,"letter",new g(-.15,.7,1.15),.47,.14,new Q(-.25,.3,0));for(let n=0;n<6;n++){const l=n*k/6+Math.PI/6+.012,c=(n+1)*k/6+Math.PI/6-.012,v=(l+c)/2,R=ye(ts(.85,1,l,c),.2,.045,i.chrome,24);R.position.z+=.05,a(R,"ring",new g(Math.cos(v)*.62,Math.sin(v)*.62,n%2?.25:-.15),.52+n*.022,.13,new Q(0,0,(o()-.5)*.3))}for(let n=0;n<6;n++){const l=n*k/6+Math.PI/6,c=new ie,v=new C(new W(.045,.045,.03,16),n%2?i.brass:i.metal);v.position.y=.11;const R=new C(new W(.018,.018,.2,10),i.metal);c.add(v,R),c.position.set(Math.cos(l)*.9,Math.sin(l)*.9,0),c.rotation.z=l-Math.PI/2,a(c,"screw",new g(Math.cos(l)*1.05,Math.sin(l)*1.05,0),.67+n*.012,.09,void 0,new g(Math.cos(l),Math.sin(l),0))}const w=new ie;for(const n of[[new g(-3.2,0,0),new g(3.6,0,0)],[new g(0,-2.2,0),new g(0,2.4,0)]]){const l=new qe(new _e().setFromPoints(n),i.line);l.computeLineDistances(),w.add(l)}return e.add(w),{group:e,pieces:t,materials:i,axes:w}}function rs(){const i=document.createElement("canvas");i.width=64,i.height=512;const e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,512);t.addColorStop(0,"#141a21"),t.addColorStop(.35,"#2b3540"),t.addColorStop(.58,"#4a5764"),t.addColorStop(.62,"#3b4652"),t.addColorStop(1,"#1b2128"),e.fillStyle=t,e.fillRect(0,0,64,512);const s=new Pe(i);return s.colorSpace=Re,s}function ns(){const i=document.createElement("canvas");i.width=i.height=1024;const e=i.getContext("2d"),t=e.createRadialGradient(512,512,60,512,512,512);t.addColorStop(0,"rgba(120,135,150,0.55)"),t.addColorStop(1,"rgba(30,36,44,0)"),e.fillStyle=t,e.fillRect(0,0,1024,1024),e.strokeStyle="rgba(210,220,230,0.16)",e.lineWidth=1.5;for(let o=0;o<=1024;o+=128)e.beginPath(),e.moveTo(o,0),e.lineTo(o,1024),e.stroke(),e.beginPath(),e.moveTo(0,o),e.lineTo(1024,o),e.stroke();e.setLineDash([10,10]),e.strokeStyle="rgba(220,230,240,0.22)",e.beginPath(),e.moveTo(0,512),e.lineTo(1024,512),e.stroke(),e.beginPath(),e.moveTo(512,0),e.lineTo(512,1024),e.stroke();const s=new Pe(i);return s.colorSpace=Re,s.anisotropy=8,s}function ls(){const i=document.createElement("canvas");i.width=i.height=256;const e=i.getContext("2d"),t=e.createRadialGradient(128,128,0,128,128,128);return t.addColorStop(0,"rgba(0,0,0,0.7)"),t.addColorStop(.5,"rgba(0,0,0,0.3)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,256,256),new Pe(i)}const nt=(i,e=0,t=1)=>Math.min(t,Math.max(e,i)),E=(i,e,t)=>{const s=nt((t-i)/(e-i));return s*s*(3-2*s)},Y=(i,e,t)=>i+(e-i)*t,cs=i=>i<.5?4*i*i*i:1-(-2*i+2)**3/2;function ds(){const i=B.useRef(null),e=B.useRef(null),t=B.useRef(null),s=B.useRef(null),o=B.useRef(null),a=B.useRef(null),r=B.useRef(null),h=B.useRef(null),u=B.useRef(null),[p,x]=B.useState(!1);return B.useEffect(()=>{const d=e.current,T=matchMedia("(prefers-reduced-motion: reduce)").matches;let b;try{b=new Dt({antialias:!0,powerPreference:"high-performance"})}catch{x(!0);return}b.setPixelRatio(Math.min(devicePixelRatio,2)),b.toneMapping=st,b.toneMappingExposure=1.05,b.outputColorSpace=Re,d.appendChild(b.domElement);const w=new Ft,n=new it(30,1,.1,200);w.background=rs();const l=new zt(b);w.environment=l.fromScene(new Vt,.02).texture,w.environmentIntensity=.92;const c=new Ce(16777215,1.3);c.position.set(-3,5,5),w.add(c);const v=new Ce(12374762,.9);v.position.set(5,1,3),w.add(v);const R=new Ce(10467284,1.4);R.position.set(0,3,-6),w.add(R);const F=new Ut(16777215,0,6);w.add(F);const S=innerWidth<768,N=-2.15;if(!S){const P=new xe(new pe(30,30),{textureWidth:1024,textureHeight:1024,color:8226964});P.rotation.x=-Math.PI/2,P.position.y=N,w.add(P)}const z=new C(new pe(30,30),new ge({color:2568250,transparent:!0,opacity:S?1:.74,depthWrite:!1}));z.rotation.x=-Math.PI/2,z.position.y=N+.002,w.add(z);const M=new C(new pe(16,16),new ge({map:ns(),transparent:!0,depthWrite:!1}));M.rotation.x=-Math.PI/2,M.position.y=N+.004,w.add(M);const j=new C(new pe(3.4,1.3),new ge({map:ls(),transparent:!0,depthWrite:!1,opacity:0}));j.rotation.x=-Math.PI/2,j.position.y=N+.006,w.add(j);const{group:A,pieces:_,axes:ve}=os(),X=new ie;X.add(A),w.add(X);const we=_.map(P=>{const G=P.line.material.clone();return P.line.material=G,G}),ne=ve.children[0].material;h.current&&(h.current.textContent=String(_.length));const V=new Yt(b);V.addPass(new Kt(w,n));const lt=new q(new U(1,1),.16,.4,.96);V.addPass(lt),V.addPass(new Zt);let Z=1,le=1,L=!1;const Ne=()=>{Z=d.clientWidth,le=d.clientHeight,L=Z<768,b.setSize(Z,le),V.setPixelRatio(Math.min(devicePixelRatio,L?1.5:2)),V.setSize(Z,le),n.aspect=Z/le,n.updateProjectionMatrix()};Ne();const Ae=new ResizeObserver(Ne);Ae.observe(d);let ce=T?1:0,y=ce;const ct=Bt.create({trigger:i.current,start:"top top",end:"bottom bottom",onUpdate:P=>{T||(ce=P.progress)}}),he={x:0,y:0},O={x:0,y:0},De=P=>{he.x=P.clientX/innerWidth-.5,he.y=P.clientY/innerHeight-.5};addEventListener("pointermove",De);let Fe=!0,ze=0,Ue=performance.now(),ue=0,Be=-1,J=0;const ke=new IntersectionObserver(([P])=>{Fe=P.isIntersecting});ke.observe(d);const Ie=new g,ht=new g(0,1,0),be=_.map(()=>0),je=()=>{ze=requestAnimationFrame(je);const P=performance.now(),G=Math.min(.05,(P-Ue)/1e3);if(Ue=P,!Fe)return;T||(ue+=G),y+=(ce-y)*(1-Math.exp(-G*6)),O.x+=(he.x-O.x)*.05,O.y+=(he.y-O.y)*.05;const de=L?.7:1;let ee=0;_.forEach((m,fe)=>{const me=nt((y-m.t0)/(m.t1-m.t0)),Me=cs(me),Te=1-Me;me>=1&&ee++,Ie.set(m.home.x+(m.from.x-m.home.x)*de,m.home.y+(m.from.y-m.home.y)*de,m.home.z+(m.from.z-m.home.z)*de),m.obj.position.lerpVectors(Ie,m.home,Me),m.obj.position.y+=Math.sin(ue*.8+m.phase)*.035*Te,m.obj.quaternion.slerpQuaternions(m.fromQ,m.homeQ,Me),m.kind==="screw"&&m.obj.rotateOnAxis(ht,Te*Math.PI*8);const We=m.line.geometry.attributes.position;We.setXYZ(1,m.obj.position.x,m.obj.position.y,m.obj.position.z),We.needsUpdate=!0,m.line.computeLineDistances(),we[fe].opacity=.42*E(0,.25,Te),be[fe]<1&&me>=1&&ce>be[fe]&&(J=Math.min(1,J+(m.kind==="ring"||m.kind==="letter"?.35:.12))),be[fe]=me}),ne.opacity=.4*(1-E(.62,.74,y));const ut=E(.66,.76,y),Le=E(.76,.9,y);j.material.opacity=.25+ut*.5,F.intensity=Le*1.4,F.position.set(Math.sin(ue*.6)*2.8,1.4,3.6);const Oe=E(.03,.3,y),te=Math.tan(Ot.degToRad(n.fov/2)),se=te*n.aspect,Ve=L?Math.max(2.3*de/se,2.8/te):Math.max(3.4/te,4.5/se),dt=L?Math.max(1.45/se,2.2/te):Math.max(2.25/te,2.9/se),ft=Y(Ve,dt,E(.35,.78,y));X.position.set(Y(L?0:Ve*se*.36,0,Oe),Y(L?-1.2:-.35,Y(-.3,.1,E(.5,.8,y)),Oe),0);const Ge=E(.05,.8,y);A.rotation.y=Y(L?-.45:-.6,0,Ge)+O.x*.45+Math.sin(ue*.45)*.22*Le,A.rotation.x=Y(.12,0,Ge)+O.y*.2,j.position.x=X.position.x,J*=Math.exp(-G*10),n.position.set(-O.x*.6+(Math.random()-.5)*J*.035,1.05-O.y*.3+(Math.random()-.5)*J*.035,ft),n.lookAt(0,-.05,0),V.render(G),t.current.style.opacity=String(1-E(.02,.12,y)),t.current.style.transform=`translateY(${-E(.02,.12,y)*50}px)`,s.current.style.opacity=String(E(.8,.9,y)),s.current.style.transform=`translateY(${(1-E(.8,.9,y))*24}px)`,o.current.style.opacity=String(1-E(.01,.06,y)),a.current.style.opacity=String(E(.05,.12,y)*(1-E(.74,.8,y))),ee!==Be&&(Be=ee,r.current.textContent=String(ee)),u.current.style.transform=`scaleX(${ee/_.length})`};return je(),()=>{cancelAnimationFrame(ze),ct.kill(),Ae.disconnect(),ke.disconnect(),removeEventListener("pointermove",De),l.dispose(),V.dispose(),b.dispose(),d.innerHTML=""}},[]),f.jsx("section",{ref:i,className:"relative h-[100svh] motion-safe:h-[440vh]","aria-label":"Presentación",children:f.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden bg-[#1c232b]",children:[p&&f.jsx("img",{src:kt.neon,alt:"Rótulo de neón de Vegawagen",className:"absolute inset-0 h-full w-full object-cover opacity-60"}),f.jsx("div",{ref:e,className:"absolute inset-0",role:"img","aria-label":"Emblema cromado en despiece que se monta pieza a pieza al hacer scroll"}),f.jsx("div",{className:"pointer-events-none absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_45%,transparent_60%,rgba(8,10,13,.7))]"}),f.jsxs("div",{ref:t,className:"pointer-events-none absolute inset-0",children:[f.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,15,.9)_0%,rgba(10,12,15,.65)_36%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgba(10,12,15,.9)_0%,rgba(10,12,15,.6)_46%,transparent_66%)]"}),f.jsxs("div",{className:"relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0",children:[f.jsx("p",{className:"kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]",children:I.hero.kicker}),f.jsxs("h1",{className:"h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]",children:[f.jsx("span",{className:"grad-text block",children:I.hero.title[0]}),f.jsx("span",{className:"neon-text block",children:I.hero.title[1]})]}),f.jsx("p",{className:"mt-5 max-w-md text-[16px] leading-relaxed text-white/70 md:mt-7 md:text-[18px]",children:I.hero.text}),f.jsxs("div",{className:"pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9",children:[f.jsxs("a",{href:I.phoneHref,className:"btn-neon",children:[f.jsx(It,{})," ",I.phone]}),f.jsxs("a",{href:I.whatsappHref,target:"_blank",rel:"noopener",className:"btn-ghost",children:[f.jsx(jt,{})," WhatsApp"]}),f.jsxs("span",{className:"hidden items-center gap-2 text-[14px] text-white/65 sm:flex",children:[f.jsx("span",{className:"text-neon",children:"★"})," ",I.rating.toLocaleString("es-ES")," en Google"]})]})]})]}),f.jsxs("div",{ref:a,className:"pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0",children:[f.jsxs("p",{className:"font-mono text-[11px] uppercase tracking-[0.25em] text-white/60",children:["Montando pieza a pieza · ",f.jsx("span",{ref:r,className:"text-neon",children:"0"}),"/",f.jsx("span",{ref:h,children:"26"})]}),f.jsx("div",{className:"mt-3 h-px overflow-hidden bg-white/15",children:f.jsx("div",{ref:u,className:"h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]",style:{transform:"scaleX(0)"}})})]}),f.jsxs("div",{ref:s,className:"pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center opacity-0 md:bottom-10",children:[f.jsx(Lt,{className:"mx-auto text-[28px] sm:text-[44px] md:text-[56px]"}),f.jsx("p",{className:"mt-3 text-[11px] uppercase tracking-[0.3em] text-white/65 md:text-[13px]",children:I.hero.outro})]}),f.jsx("p",{ref:o,className:"pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/50 motion-reduce:hidden md:text-[11px]","aria-hidden":!0,children:I.hero.scroll})]})})}export{ds as default};
