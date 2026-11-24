import{M as _,O as nt,B as lt,F as Ie,S as X,U as ie,V as D,W as te,H as se,N as ct,C as ht,a as Y,b as x,A as ut,c as Ke,R as ft,d as dt,e as mt,L as pt,f as gt,g as xt,h as qe,i as vt,j as Mt,P as $e,k as wt,l as je,m as ke,n as bt,o as xe,p as Le,G as me,q as W,T as Tt,r as Oe,s as St,t as Je,E as Ze,Q as Ct,u as _t,v as H,w as B,x as yt,y as Pt,z as Rt,D as Et,I as ve,J as Nt,K as Ve,X as At,Y as d,Z as Dt,_ as I,$ as Ft,a0 as Ut,a1 as Bt,a2 as zt}from"./index-CVDgBB19.js";import{R as It}from"./RoomEnvironment-Dpz1iYoC.js";const et={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class q{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const jt=new nt(-1,1,1,-1,0,1);class kt extends lt{constructor(){super(),this.setAttribute("position",new Ie([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ie([0,2,0,0,2,0],2))}}const Lt=new kt;class be{constructor(e){this._mesh=new _(Lt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,jt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Ot extends q{constructor(e,t){super(),this.textureID=t!==void 0?t:"tDiffuse",e instanceof X?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ie.clone(e.uniforms),this.material=new X({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this.fsQuad=new be(this.material)}render(e,t,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this.fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class Ge extends q{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,s){const a=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let o,h;this.inverse?(o=0,h=1):(o=1,h=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),i.buffers.stencil.setFunc(a.ALWAYS,o,4294967295),i.buffers.stencil.setClear(h),i.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(a.EQUAL,1,4294967295),i.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),i.buffers.stencil.setLocked(!0)}}class Vt extends q{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Gt{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){const s=e.getSize(new D);this._width=s.width,this._height=s.height,t=new te(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:se}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ot(et),this.copyPass.material.blending=ct,this.clock=new ht}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());const t=this.renderer.getRenderTarget();let s=!1;for(let a=0,i=this.passes.length;a<i;a++){const o=this.passes[a];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),o.needsSwap){if(s){const h=this.renderer.getContext(),u=this.renderer.state.buffers.stencil;u.setFunc(h.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),u.setFunc(h.EQUAL,1,4294967295)}this.swapBuffers()}Ge!==void 0&&(o instanceof Ge?s=!0:o instanceof Vt&&(s=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){const t=this.renderer.getSize(new D);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;const s=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(s,a),this.renderTarget2.setSize(s,a);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(s,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Qt extends q{constructor(e,t,s=null,a=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=s,this.clearColor=a,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new Y}render(e,t,s){const a=e.autoClear;e.autoClear=!1;let i,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=a}}const Wt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Y(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class K extends q{constructor(e,t,s,a){super(),this.strength=t!==void 0?t:1,this.radius=s,this.threshold=a,this.resolution=e!==void 0?new D(e.x,e.y):new D(256,256),this.clearColor=new Y(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new te(i,o,{type:se}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){const b=new te(i,o,{type:se});b.texture.name="UnrealBloomPass.h"+f,b.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(b);const v=new te(i,o,{type:se});v.texture.name="UnrealBloomPass.v"+f,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),i=Math.round(i/2),o=Math.round(o/2)}const h=Wt;this.highPassUniforms=ie.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new X({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const u=[3,5,7,9,11];i=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(u[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new D(1/i,1/o),i=Math.round(i/2),o=Math.round(o/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;const m=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=m,this.bloomTintColors=[new x(1,1,1),new x(1,1,1),new x(1,1,1),new x(1,1,1),new x(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const p=et;this.copyUniforms=ie.clone(p.uniforms),this.blendMaterial=new X({uniforms:this.copyUniforms,vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,blending:ut,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new Y,this.oldClearAlpha=1,this.basic=new Ke,this.fsQuad=new be(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,t){let s=Math.round(e/2),a=Math.round(t/2);this.renderTargetBright.setSize(s,a);for(let i=0;i<this.nMips;i++)this.renderTargetsHorizontal[i].setSize(s,a),this.renderTargetsVertical[i].setSize(s,a),this.separableBlurMaterials[i].uniforms.invSize.value=new D(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2)}render(e,t,s,a,i){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),i&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=s.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let h=this.renderTargetBright;for(let u=0;u<this.nMips;u++)this.fsQuad.material=this.separableBlurMaterials[u],this.separableBlurMaterials[u].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[u].uniforms.direction.value=K.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[u]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[u].uniforms.colorTexture.value=this.renderTargetsHorizontal[u].texture,this.separableBlurMaterials[u].uniforms.direction.value=K.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[u]),e.clear(),this.fsQuad.render(e),h=this.renderTargetsVertical[u];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,i&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(s),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=o}getSeperableBlurMaterial(e){const t=[];for(let s=0;s<e;s++)t.push(.39894*Math.exp(-.5*s*s/(e*e))/e);return new X({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new D(.5,.5)},direction:{value:new D(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(e){return new X({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}K.BlurDirectionX=new D(1,0);K.BlurDirectionY=new D(0,1);const Ht={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Xt extends q{constructor(){super();const e=Ht;this.uniforms=ie.clone(e.uniforms),this.material=new ft({name:e.name,uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader}),this.fsQuad=new be(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},dt.getTransfer(this._outputColorSpace)===mt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===pt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===gt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===xt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===qe?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===vt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Mt&&(this.material.defines.NEUTRAL_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this.fsQuad.render(e))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class pe extends _{constructor(e,t={}){super(e),this.isReflector=!0,this.type="Reflector",this.camera=new $e;const s=this,a=t.color!==void 0?new Y(t.color):new Y(8355711),i=t.textureWidth||512,o=t.textureHeight||512,h=t.clipBias||0,u=t.shader||pe.ReflectorShader,m=t.multisample!==void 0?t.multisample:4,p=new wt,f=new x,b=new x,v=new x,n=new je,l=new x(0,0,-1),c=new ke,g=new x,y=new x,F=new ke,U=new je,w=this.camera,R=new te(i,o,{samples:m,type:se}),E=new X({name:u.name!==void 0?u.name:"unspecified",uniforms:ie.clone(u.uniforms),fragmentShader:u.fragmentShader,vertexShader:u.vertexShader});E.uniforms.tDiffuse.value=R.texture,E.uniforms.color.value=a,E.uniforms.textureMatrix.value=U,this.material=E,this.onBeforeRender=function(M,ae,k){if(b.setFromMatrixPosition(s.matrixWorld),v.setFromMatrixPosition(k.matrixWorld),n.extractRotation(s.matrixWorld),f.set(0,0,1),f.applyMatrix4(n),g.subVectors(b,v),g.dot(f)>0)return;g.reflect(f).negate(),g.add(b),n.extractRotation(k.matrixWorld),l.set(0,0,-1),l.applyMatrix4(n),l.add(v),y.subVectors(b,l),y.reflect(f).negate(),y.add(b),w.position.copy(g),w.up.set(0,1,0),w.up.applyMatrix4(n),w.up.reflect(f),w.lookAt(y),w.far=k.far,w.updateMatrixWorld(),w.projectionMatrix.copy(k.projectionMatrix),U.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),U.multiply(w.projectionMatrix),U.multiply(w.matrixWorldInverse),U.multiply(s.matrixWorld),p.setFromNormalAndCoplanarPoint(f,b),p.applyMatrix4(w.matrixWorldInverse),c.set(p.normal.x,p.normal.y,p.normal.z,p.constant);const N=w.projectionMatrix;F.x=(Math.sign(c.x)+N.elements[8])/N.elements[0],F.y=(Math.sign(c.y)+N.elements[9])/N.elements[5],F.z=-1,F.w=(1+N.elements[10])/N.elements[14],c.multiplyScalar(2/c.dot(F)),N.elements[2]=c.x,N.elements[6]=c.y,N.elements[10]=c.z+1-h,N.elements[14]=c.w,s.visible=!1;const re=M.getRenderTarget(),j=M.xr.enabled,ge=M.shadowMap.autoUpdate;M.xr.enabled=!1,M.shadowMap.autoUpdate=!1,M.setRenderTarget(R),M.state.buffers.depth.setMask(!0),M.autoClear===!1&&M.clear(),M.render(ae,w),M.xr.enabled=j,M.shadowMap.autoUpdate=ge,M.setRenderTarget(re);const L=k.viewport;L!==void 0&&M.state.viewport(L),s.visible=!0},this.getRenderTarget=function(){return R},this.dispose=function(){R.dispose(),s.material.dispose()}}}pe.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
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

		}`};const z=Math.PI*2,P=D;function Qe(r,e){let t=r;for(let s=0;s<e.length;s++){const a=e[s],i=e[(s+1)%e.length],o=t;t=[];const h=m=>(i.x-a.x)*(m.y-a.y)-(i.y-a.y)*(m.x-a.x)>=0,u=(m,p)=>{const f=(i.x-a.x)*(m.y-a.y)-(i.y-a.y)*(m.x-a.x),b=(i.x-a.x)*(p.y-a.y)-(i.y-a.y)*(p.x-a.x);return m.clone().lerp(p,f/(f-b))};for(let m=0;m<o.length;m++){const p=o[m],f=o[(m+1)%o.length];h(f)?(h(p)||t.push(u(p,f)),t.push(f)):h(p)&&t.push(u(p,f))}}return t}const Yt=(r,e=96)=>Array.from({length:e},(t,s)=>new P(Math.cos(s/e*z)*r,Math.sin(s/e*z)*r)),We=(r,e)=>r.x*e.y-r.y*e.x,Kt=(r,e,t,s)=>r.clone().addScaledVector(e,We(t.clone().sub(r),s)/We(e,s));function He(r,e){const t=r.slice(0,-1).map((a,i)=>{const o=r[i+1].clone().sub(a).normalize();return{p:a,d:o,n:new P(-o.y,o.x)}}),s=a=>r.map((i,o)=>{if(o===0)return i.clone().addScaledVector(t[0].d,-.3).addScaledVector(t[0].n,a*e);if(o===r.length-1){const m=t[o-1];return i.clone().addScaledVector(m.d,.3).addScaledVector(m.n,a*e)}const h=t[o-1],u=t[o];return Kt(h.p.clone().addScaledVector(h.n,a*e),h.d,u.p.clone().addScaledVector(u.n,a*e),u.d)});return[...s(1),...s(-1).reverse()]}function Me(r,e,t,s,a=12){const i=r.reduce((m,p)=>m.add(p),new P).divideScalar(r.length),o=new Je(r.map(m=>m.clone().sub(i))),h=new Ze(o,{depth:e,bevelEnabled:!0,bevelThickness:t,bevelSize:t*.8,bevelSegments:4,curveSegments:a});h.translate(0,0,-e/2);const u=new _(h,s);return u.position.set(i.x,i.y,0),u}function qt(r,e,t,s,a=28){const i=[];for(let o=0;o<=a;o++){const h=t+(s-t)*o/a;i.push(new P(Math.cos(h)*e,Math.sin(h)*e))}for(let o=a;o>=0;o--){const h=t+(s-t)*o/a;i.push(new P(Math.cos(h)*r,Math.sin(h)*r))}return i}class $t extends _t{constructor(e,t,s){super(),this.r=e,this.len=t,this.turns=s}getPoint(e,t=new x){const s=e*this.turns*z;return t.set(this.r*Math.cos(s),this.r*Math.sin(s),e*this.len-this.len/2)}}const Xe=.078,Jt=[new P(Math.cos(1.98)*.98,Math.sin(1.98)*.98),new P(0,-.04),new P(Math.cos(1.16)*.98,Math.sin(1.16)*.98)],Zt=[new P(Math.cos(2.84)*.98,Math.sin(2.84)*.98),new P(Math.cos(4.3)*.86,Math.sin(4.3)*.86),new P(0,-.12),new P(Math.cos(5.124)*.86,Math.sin(5.124)*.86),new P(Math.cos(.302)*.98,Math.sin(.302)*.98)];function es(){const r={chrome:new Le({color:15659509,metalness:1,roughness:.1,clearcoat:.8,clearcoatRoughness:.06}),field:new Le({color:855826,metalness:.2,roughness:.25,clearcoat:1,clearcoatRoughness:.08}),plastic:new xe({color:1513756,metalness:.05,roughness:.62}),metal:new xe({color:11120567,metalness:1,roughness:.3}),brass:new xe({color:13148762,metalness:1,roughness:.28}),line:new bt({color:14673646,dashSize:.05,gapSize:.04,transparent:!0,opacity:.45,depthWrite:!1})},e=new me,t=[];let s=3;const a=()=>(s=s*16807%2147483647,(s-1)/2147483646),i=(n,l,c,g,y=.12,F,U)=>{e.add(n);const w=n.position.clone(),R=n.quaternion.clone(),E=w.clone().add(c),M=F?new Ct().setFromEuler(F).multiply(R):R.clone();t.push({obj:n,home:w,homeQ:R,from:E,fromQ:M,t0:g,t1:g+y,phase:a()*z,kind:l,screwAxis:U})},o=new me,h=new _(new W(.97,.95,.16,96).rotateX(Math.PI/2),r.plastic);o.add(h);const u=new _(new Tt(.62,.025,8,80),r.plastic);u.position.z=.09,o.add(u);for(let n=0;n<8;n++){const l=new _(new Oe(.34,.035,.05),r.plastic),c=n*z/8;l.position.set(Math.cos(c)*.4,Math.sin(c)*.4,.1),l.rotation.z=c,o.add(l)}for(let n=0;n<4;n++){const l=Math.PI/4+n*z/4,c=new _(new W(.07,.07,.1,24).rotateX(Math.PI/2),r.plastic);c.position.set(Math.cos(l)*.78,Math.sin(l)*.78,.1),o.add(c);const g=new _(new W(.03,.03,.1,16).rotateX(Math.PI/2),r.metal);g.position.copy(c.position),g.position.z+=.005,o.add(g)}const m=new _(new W(.16,.16,.12,32).rotateX(Math.PI/2),r.plastic);m.position.z=.1,o.add(m);for(const n of[-1,1]){const l=new _(new Oe(.16,.1,.22),r.plastic);l.position.set(n*.98,0,-.04),o.add(l)}o.position.z=-.17,i(o,"housing",new x(1.55,.05,-1.4),.08,.14,new H(0,-.7,0));for(let n=0;n<4;n++){const l=n*z/4,c=new _(new St(new $t(.045,.16,5),80,.008,6),r.metal);c.position.set(Math.cos(l)*.5,Math.sin(l)*.5,-.1),i(c,"spring",new x(Math.cos(l)*.7+.9,Math.sin(l)*.7,-.9),.17+n*.015,.1,new H(a()*2,a()*2,0))}for(let n=0;n<4;n++){const l=Math.PI/2+n*z/4,c=new Je;c.moveTo(-.12,-.05),c.lineTo(.12,-.05),c.lineTo(.12,.08),c.lineTo(.07,.08),c.lineTo(.07,0),c.lineTo(-.07,0),c.lineTo(-.07,.08),c.lineTo(-.12,.08),c.closePath();const g=new _(new Ze(c,{depth:.05,bevelEnabled:!0,bevelThickness:.01,bevelSize:.008,bevelSegments:2}).translate(0,0,-.025),r.metal);g.position.set(Math.cos(l)*.72,Math.sin(l)*.72,-.02),g.rotation.z=l-Math.PI/2,i(g,"bracket",new x(Math.cos(l)*.75,Math.sin(l)*.75,.35),.24+n*.02,.11,new H(.6,0,0))}const p=new _(new W(.87,.87,.04,96).rotateX(Math.PI/2),r.field);p.position.z=.02,i(p,"field",new x(.75,0,-.55),.32,.12,new H(0,-.4,0));const f=Yt(.95),b=Me(Qe(He(Zt,Xe),f),.12,.03,r.chrome);b.position.z+=.11,i(b,"letter",new x(-.25,-.35,1),.4,.14,new H(.2,.35,0));const v=Me(Qe(He(Jt,Xe),f),.12,.03,r.chrome);v.position.z+=.11,i(v,"letter",new x(-.15,.7,1.15),.47,.14,new H(-.25,.3,0));for(let n=0;n<6;n++){const l=n*z/6+Math.PI/6+.012,c=(n+1)*z/6+Math.PI/6-.012,g=(l+c)/2,y=Me(qt(.85,1,l,c),.2,.045,r.chrome,24);y.position.z+=.05,i(y,"ring",new x(Math.cos(g)*.62,Math.sin(g)*.62,n%2?.25:-.15),.52+n*.022,.13,new H(0,0,(a()-.5)*.3))}for(let n=0;n<6;n++){const l=n*z/6+Math.PI/6,c=new me,g=new _(new W(.045,.045,.03,16),n%2?r.brass:r.metal);g.position.y=.11;const y=new _(new W(.018,.018,.2,10),r.metal);c.add(g,y),c.position.set(Math.cos(l)*.9,Math.sin(l)*.9,0),c.rotation.z=l-Math.PI/2,i(c,"screw",new x(Math.cos(l)*1.05,Math.sin(l)*1.05,0),.67+n*.012,.09,void 0,new x(Math.cos(l),Math.sin(l),0))}return{group:e,pieces:t,materials:r}}const we=(r,e=0,t=1)=>Math.min(t,Math.max(e,r)),A=(r,e,t)=>{const s=we((t-r)/(e-r));return s*s*(3-2*s)},V=(r,e,t)=>r+(e-r)*t,Ye=r=>r<.5?4*r*r*r:1-(-2*r+2)**3/2,ue=[.06,.3],fe=[.5,.76],de=.1;function is(){const r=B.useRef(null),e=B.useRef(null),t=B.useRef(null),s=B.useRef(null),a=B.useRef(null),i=B.useRef(null),o=B.useRef(null),h=B.useRef(null),u=B.useRef(null),[m,p]=B.useState(!1);return B.useEffect(()=>{const f=e.current,b=matchMedia("(prefers-reduced-motion: reduce)").matches;let v;try{v=new yt({antialias:!0,powerPreference:"high-performance"})}catch{p(!0);return}v.setPixelRatio(Math.min(devicePixelRatio,2)),v.toneMapping=qe,v.toneMappingExposure=1.05,v.outputColorSpace=Pt,f.appendChild(v.domElement);const n=new Rt,l=new $e(30,1,.1,200);n.background=new Y(131587);const c=new Et(v);n.environment=c.fromScene(new It,.02).texture,n.environmentIntensity=.9;const g=new ve(16777215,1.4);g.position.set(-3,5,5),n.add(g);const y=new ve(14082284,.6);y.position.set(5,1,3),n.add(y);const F=new ve(12571368,1.6);F.position.set(0,3,-6),n.add(F);const U=new Nt(16777215,0,6);n.add(U);const w=-1.75;if(innerWidth>=768){const S=new pe(new Ve(30,30),{textureWidth:1024,textureHeight:1024,color:5922662});S.rotation.x=-Math.PI/2,S.position.y=w,n.add(S);const Q=new _(new Ve(30,30),new Ke({color:131587,transparent:!0,opacity:.86,depthWrite:!1}));Q.rotation.x=-Math.PI/2,Q.position.y=w+.002,n.add(Q)}const{group:R,pieces:E}=es(),M=new me;M.add(R),n.add(M),h.current&&(h.current.textContent=String(E.length));const ae=E.map(S=>S.t0),k=Math.min(...ae),N=Math.max(...ae),re=E.map(S=>(S.t0-k)/(N-k||1)),j=new Gt(v);j.addPass(new Qt(n,l));const ge=new K(new D(1,1),.16,.4,.96);j.addPass(ge),j.addPass(new Xt);let L=1,oe=1,G=!1;const Te=()=>{L=f.clientWidth,oe=f.clientHeight,G=L<768,v.setSize(L,oe),j.setPixelRatio(Math.min(devicePixelRatio,G?1.5:2)),j.setSize(L,oe),l.aspect=L/oe,l.updateProjectionMatrix()};Te();const Se=new ResizeObserver(Te);Se.observe(f);let Ce=0,C=0;const tt=At.create({trigger:r.current,start:"top top",end:"bottom bottom",onUpdate:S=>{b||(Ce=S.progress)}}),ne={x:0,y:0},O={x:0,y:0},_e=S=>{ne.x=S.clientX/innerWidth-.5,ne.y=S.clientY/innerHeight-.5};addEventListener("pointermove",_e);let ye=!0,Pe=0,Re=performance.now(),le=0,Ee=-1;const Ne=new IntersectionObserver(([S])=>{ye=S.isIntersecting});Ne.observe(f);const Ae=new x,st=new x(0,1,0),De=()=>{Pe=requestAnimationFrame(De);const S=performance.now(),Q=Math.min(.05,(S-Re)/1e3);if(Re=S,!ye)return;b||(le+=Q),C+=(Ce-C)*(1-Math.exp(-Q*6)),O.x+=(ne.x-O.x)*.05,O.y+=(ne.y-O.y)*.05;const ce=G?.7:1;let $=0;E.forEach((T,ze)=>{const rt=V(ue[0],ue[1],1-re[ze]),ot=V(fe[0],fe[1],re[ze]),ee=Ye(we((C-rt)/de))-Ye(we((C-ot)/de));ee<.02&&$++,Ae.set(T.home.x+(T.from.x-T.home.x)*ce,T.home.y+(T.from.y-T.home.y)*ce,T.home.z+(T.from.z-T.home.z)*ce),T.obj.position.lerpVectors(T.home,Ae,ee),T.obj.position.y+=Math.sin(le*.8+T.phase)*.035*ee,T.obj.quaternion.slerpQuaternions(T.homeQ,T.fromQ,ee),T.kind==="screw"&&T.obj.rotateOnAxis(st,ee*Math.PI*8)});const he=A(ue[0],ue[1]+de,C)-A(fe[0],fe[1]+de,C),Fe=A(.86,.95,C);U.intensity=Fe*1.4,U.position.set(Math.sin(le*.6)*2.8,1.4,3.6);const Ue=A(.02,.2,C),J=Math.tan(zt.degToRad(l.fov/2)),Z=J*l.aspect,it=G?Math.max(2.3*ce/Z,2.8/J):Math.max(3.3/J,4.4/Z),Be=G?Math.max(1.45/Z,2.2/J):Math.max(2.25/J,2.9/Z),at=V(Be,it,he);M.position.set(V(G?0:Be*Z*.5,0,Ue),V(G?-.95:-.05,V(.05,-.2,he),Ue),0),R.rotation.y=V(V(-.42,-.62,he),0,A(.62,.9,C))+O.x*.45+Math.sin(le*.45)*.22*Fe,R.rotation.x=.06*he+O.y*.2,l.position.set(-O.x*.6,.85-O.y*.3,at),l.lookAt(0,-.05,0),j.render(Q),t.current.style.opacity=String(1-A(.02,.12,C)),t.current.style.transform=`translateY(${-A(.02,.12,C)*50}px)`,s.current.style.opacity=String(A(.86,.94,C)),s.current.style.transform=`translateY(${(1-A(.86,.94,C))*24}px)`,a.current.style.opacity=String(1-A(.01,.06,C)),i.current.style.opacity=String(A(.05,.1,C)*(1-A(.84,.88,C))),$!==Ee&&(Ee=$,o.current.textContent=String($)),u.current.style.transform=`scaleX(${$/E.length})`};return De(),()=>{cancelAnimationFrame(Pe),tt.kill(),Se.disconnect(),Ne.disconnect(),removeEventListener("pointermove",_e),c.dispose(),j.dispose(),v.dispose(),f.innerHTML=""}},[]),d.jsx("section",{ref:r,className:"relative h-[100svh] motion-safe:h-[460vh]","aria-label":"Presentación",children:d.jsxs("div",{className:"sticky top-0 h-[100svh] overflow-hidden bg-black",children:[m&&d.jsx("img",{src:Dt.neon,alt:"Rótulo de neón de Vegawagen",className:"absolute inset-0 h-full w-full object-cover opacity-60"}),d.jsx("div",{ref:e,className:"absolute inset-0",role:"img","aria-label":"Emblema cromado que se desmonta y se vuelve a montar al hacer scroll"}),d.jsxs("div",{ref:t,className:"pointer-events-none absolute inset-0",children:[d.jsx("div",{className:"absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.55)_36%,transparent_58%)] max-md:bg-[linear-gradient(180deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.5)_46%,transparent_66%)]"}),d.jsxs("div",{className:"relative mx-auto flex h-full max-w-7xl flex-col justify-start px-5 pt-24 md:justify-center md:px-8 md:pt-0",children:[d.jsx("p",{className:"kicker mb-4 !tracking-[0.18em] md:mb-6 md:!tracking-[0.28em]",children:I.hero.kicker}),d.jsxs("h1",{className:"h-cond text-[50px] leading-[0.9] sm:text-[80px] lg:text-[112px]",children:[d.jsx("span",{className:"grad-text block",children:I.hero.title[0]}),d.jsx("span",{className:"neon-text block",children:I.hero.title[1]})]}),d.jsx("p",{className:"mt-5 max-w-md text-[16px] leading-relaxed text-white/70 md:mt-7 md:text-[18px]",children:I.hero.text}),d.jsxs("div",{className:"pointer-events-auto mt-7 flex flex-wrap items-center gap-3 md:mt-9",children:[d.jsxs("a",{href:I.phoneHref,className:"btn-neon",children:[d.jsx(Ft,{})," ",I.phone]}),d.jsxs("a",{href:I.whatsappHref,target:"_blank",rel:"noopener",className:"btn-ghost",children:[d.jsx(Ut,{})," WhatsApp"]}),d.jsxs("span",{className:"hidden items-center gap-2 text-[14px] text-white/65 sm:flex",children:[d.jsx("span",{className:"text-neon",children:"★"})," ",I.rating.toLocaleString("es-ES")," en Google"]})]})]})]}),d.jsxs("div",{ref:i,className:"pointer-events-none absolute bottom-8 left-1/2 w-[min(340px,84vw)] -translate-x-1/2 text-center opacity-0",children:[d.jsxs("p",{className:"font-mono text-[11px] uppercase tracking-[0.25em] text-white/60",children:["Piezas en su sitio · ",d.jsx("span",{ref:o,className:"text-neon",children:"26"}),"/",d.jsx("span",{ref:h,children:"26"})]}),d.jsx("div",{className:"mt-3 h-px overflow-hidden bg-white/15",children:d.jsx("div",{ref:u,className:"h-full origin-left bg-neon shadow-[0_0_12px_#22E1EE]",style:{transform:"scaleX(1)"}})})]}),d.jsxs("div",{ref:s,className:"pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center opacity-0 md:bottom-10",children:[d.jsx(Bt,{className:"mx-auto text-[28px] sm:text-[44px] md:text-[56px]"}),d.jsx("p",{className:"mt-3 text-[11px] uppercase tracking-[0.3em] text-white/65 md:text-[13px]",children:I.hero.outro})]}),d.jsx("p",{ref:a,className:"pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-white/50 motion-reduce:hidden md:text-[11px]","aria-hidden":!0,children:I.hero.scroll})]})})}export{is as default};
