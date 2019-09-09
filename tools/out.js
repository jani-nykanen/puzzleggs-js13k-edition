'use strict';class aa{constructor(a,b,c){this.a=a;this.i=b;this.l=c}bind(a){a.bindTexture(a.TEXTURE_2D,this.a)}};function m(a){for(let b=0;3>b;++b)for(let c=0;3>c;++c)a.o[3*b+c]=b==c?1:0}function ba(a,b,c){m(a);a.o[0]=2/(b-0);a.o[2]=-(b+0)/(b-0);a.o[4]=2/(0-c);a.o[5]=-(0+c)/(0-c);a.o[8]=1}function ca(a){let b=new r;for(let c=0;3>c;++c)for(let d=0;3>d;++d)b.o[3*d+c]=a.o[3*c+d];return b}
class r{constructor(){this.o=new Float32Array(9);m(this)}multiply(a){let b=new r;for(var c=0;3>c;++c)for(var d=0;3>d;++d)b.o[3*c+d]=0;for(c=0;3>c;++c)for(d=0;3>d;++d)for(let e=0;3>e;++e)b.o[3*c+d]+=this.o[3*c+e]*a.o[3*e+d];return b}translate(a,b){m(this);this.o[2]=a;this.o[5]=b}scale(a,b){m(this);this.o[0]=a;this.o[4]=b}rotate(a){let b=Math.cos(a);a=Math.sin(a);m(this);this.o[0]=b;this.o[1]=-a;this.o[3]=a;this.o[4]=b}clone(){let a=new r;for(let b=0;9>b;++b)a.o[b]=this.o[b];return a}};function v(a,b,c,d,e){let f=a.m;f.uniform2f(a.s,b,c);f.uniform2f(a.w,d,e)}function da(a){var b=a.m;b.useProgram(a.a);b.uniform1i(a.C,0);v(a,0,0,1,1);b=a.m;b.uniform2f(a.b,0,0);b.uniform2f(a.c,1,1);b=new r;a.m.uniformMatrix3fv(a.h,!1,ca(b).o)}
class ea{constructor(a,b,c){this.m=a;this.a=null;{let d=this.m;b=this.createShader(b,d.VERTEX_SHADER);c=this.createShader(c,d.FRAGMENT_SHADER);this.a=d.createProgram();d.attachShader(this.a,b);d.attachShader(this.a,c);c=this.m;c.bindAttribLocation(this.a,0,"v");c.bindAttribLocation(this.a,1,"uvp");d.linkProgram(this.a);if(!d.getProgramParameter(this.a,d.LINK_STATUS))throw"Shader error: "+d.getProgramInfoLog(this.a);}this.h=a.getUniformLocation(this.a,"transform");this.j=a.getUniformLocation(this.a,
"color");this.C=a.getUniformLocation(this.a,"t0");this.s=a.getUniformLocation(this.a,"pos");this.w=a.getUniformLocation(this.a,"size");this.b=a.getUniformLocation(this.a,"texPos");this.c=a.getUniformLocation(this.a,"texSize")}createShader(a,b){let c=this.m;b=c.createShader(b);c.shaderSource(b,a);c.compileShader(b);if(!c.getShaderParameter(b,c.COMPILE_STATUS))throw"Shader error:\n"+c.getShaderInfoLog(b);return b}g(a,b,c,d){this.m.uniform4f(this.j,a,b,c,d)}};class w{constructor(a,b){this.x=null==a?0:a;this.y=null==b?0:b}clone(){return new w(this.x,this.y)}};function x(a,b,c,d){1<=b/c?(b=b/c*d,ba(a.C,b,d),a.viewport.x=b,a.viewport.y=d):(b=c/b*d,ba(a.C,d,b),a.viewport.x=d,a.viewport.y=b);a.h=!1}function y(a){m(a.c);a.h=!1}function z(a){if(null!=a.b){a.h||(a.L=a.C.multiply(a.c),a.h=!0);var b=a.b;b.m.uniformMatrix3fv(b.h,!1,ca(a.L).o)}}
class fa{constructor(){this.C=new r;this.c=new r;this.L=new r;this.j=new r;this.viewport=new w;this.h=!1;this.b=null;this.w=[]}translate(a,b){this.j.translate(a,b);this.c=this.c.multiply(this.j);this.h=!1}scale(a,b){this.j.scale(a,b);this.c=this.c.multiply(this.j);this.h=!1}rotate(a){this.j.rotate(a);this.c=this.c.multiply(this.j);this.h=!1}push(){this.w.push(this.c.clone());if(64<=this.w.length)throw"Stack overflow!";}pop(){this.c=this.w.pop().clone();this.h=!1;z(this)}};class A{constructor(a,b,c,d){this.h=d.length;this.c=a.createBuffer();this.b=a.createBuffer();this.a=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,this.c);a.bufferData(a.ARRAY_BUFFER,new Float32Array(b),a.STATIC_DRAW);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.a);a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(d),a.STATIC_DRAW);a.bindBuffer(a.ARRAY_BUFFER,this.b);a.bufferData(a.ARRAY_BUFFER,new Float32Array(c),a.STATIC_DRAW)}bind(a){a.bindBuffer(a.ARRAY_BUFFER,this.c);a.vertexAttribPointer(0,2,a.FLOAT,
a.ba,0,0);a.bindBuffer(a.ARRAY_BUFFER,this.b);a.vertexAttribPointer(1,2,a.FLOAT,a.ba,0,0);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.a)}u(a){a.drawElements(a.TRIANGLES,this.h,a.UNSIGNED_SHORT,0)}};function C(a,b,c,d,e,f){c=null!=c?Math.min(c,b):b;let g=2*Math.PI/b,h;b=[];let k=[],l=0,p=!1,n=1;for(let q=0;q<c;++q)d&&++l>=d&&(n=(p=!p)?1+e:1,l-=d),h=g*q,f?(b.push(f*Math.cos(h),f*Math.sin(h),Math.cos(h)*n,Math.sin(h)*n,Math.cos(h+g)*n,Math.sin(h+g)*n),b.push(f*Math.cos(h),f*Math.sin(h),f*Math.cos(h+g),f*Math.sin(h+g),Math.cos(h+g)*n,Math.sin(h+g)*n)):b.push(0,0,Math.cos(h)*n,Math.sin(h)*n,Math.cos(h+g)*n,Math.sin(h+g)*n);c*=3;f&&(c*=2);for(f=0;f<c;++f)k.push(f);return new A(a.m,b,b,k)}
function ha(a,b){var c;null==c&&(c=2*Math.PI);let d=c/24;c=[];let e=[],f,g;for(let h=0;24>h;++h)f=b(d*h),g=b(d*(h+1)),c.push(f[0],f[1],g[0],g[1],0,0);for(b=0;72>b;++b)e.push(b);return new A(a.m,c,c,e)}function ia(a){var b=10;var c=2*Math.PI/b;let d=[],e=[],f,g;for(let h=0;h<b;++h)f=0==h%2?1:2,g=0==h%2?2:1,d.push(Math.cos(c*h)*f,Math.sin(c*h)*f,Math.cos(c*(h+1))*g,Math.sin(c*(h+1))*g,0,0);b*=3;for(c=0;c<b;++c)e.push(c);return new A(a.m,d,d,e)}class ja{constructor(a){this.m=a}};function ka(a,b){return 0>a?b- -a%b:a%b};function la(a){let b=new ja(a.m);a.s=[new A(b.m,[0,0,1,0,1,1,0,1],[0,0,1,0,1,1,0,1],[0,1,2,2,3,0]),new A(b.m,[0,0,1,1,0,1],[0,0,1,1,0,1],[0,1,2]),new A(b.m,[0,-1,.71,.71,-.71,.71],[0,0,1,1,0,1],[0,1,2]),C(b,32),C(b,32,null,2,.25,.33),ha(b,c=>[Math.cos(1.25*(c-Math.PI)/4)*Math.sin(c-Math.PI),Math.cos(c-Math.PI)]),ia(b),C(b,32,16),C(b,6)]}function ma(a){var b=window.innerWidth,c=window.innerHeight;a.a.width=b;a.a.height=c;a.m.viewport(0,0,b,c);a.i=a.a.width;a.l=a.a.height;a.top=-1;a.left=-a.i/a.l}
function na(a,b,c,d,e,f,g){let h=a.m;null!=d&&v(a.b,d,e,f,g);a.P!=b&&(b.bind(h),a.P=b);null!=c&&c.bind(h);b.u(h)}function D(a,b,c,d,e,f){0>e&&(c-=e);0>f&&(d-=f);na(a,a.s[Math.max(0,Math.min(b|0,a.s.length-1))],null,c,d,e,f)}function F(a,b,c,d,e,f,g,h,k,l){v(a.b,g,h,k,l);g=a.b;e/=b.i;f/=b.l;h=g.m;h.uniform2f(g.b,c/b.i,d/b.l);h.uniform2f(g.c,e,f);na(a,a.s[0],b)}
function G(a,b,c,d,e,f,g,h,k,l,p,n,q,t){let B=a.O.i/16;let u,K,P=f/64,R=g/64;h&&(c-=b.length*(B+e)*P/2);h=0;var E=n?1:0;null==n&&(n=0);for(let L=E;0<=L;--L){E=c;u=d;0==L&&t?a.g(...t):1==L&&a.g(0,0,0,q);for(let S=0;S<b.length;++S)K=b.charCodeAt(S),10==K?(E=c,u+=(B+0)*R):(null!=k&&(h=Math.sin(p+S*k)*l),F(a,a.O,K%16*B,(K/16|0)*B,B,B,E+n*L,u+n*L+h,f,g),E+=(B+e)*P)}}function H(a,b){let c=a.b==a.J;a.b=b?a.J:a.S;da(a.b);a.g(1,1,1,1);z(a);return c}function I(a,b){a.K=Math.max(0,Math.min(b,1))}
class oa extends fa{constructor(){super();var a=document.createElement("div");a.setAttribute("style","position: absolute; top: 0; left: 0; z-index: -1");this.a=document.createElement("canvas");this.a.width=window.innerWidth;this.a.height=window.innerHeight;this.a.setAttribute("style","position: absolute; top: 0; left: 0; z-index: -1");this.a.hidden=!0;a.appendChild(this.a);document.body.appendChild(a);this.m=null;a=this.m=this.a.getContext("webgl",{alpha:!1});if(null===a)throw"Failed to initialize WebGL.";
a.activeTexture(a.TEXTURE0);a.disable(a.DEPTH_TEST);a.enable(a.BLEND);a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);a.enableVertexAttribArray(0);a.enableVertexAttribArray(1);this.s=null;la(this);this.S=new ea(this.m,"\nattribute vec2 v;\nattribute vec2 uvp;\n   \nuniform mat3 transform;\n\nuniform vec2 pos;\nuniform vec2 size;\n\nvarying vec2 uv;\n   \nvoid main() {\n\n    vec3 op = transform * vec3(v * size + pos, 1);\n    gl_Position = vec4(op, 1);\n    uv = uvp;\n}",
"\nprecision mediump float;\n \nuniform sampler2D t0;\nuniform vec4 color;\n\nuniform vec2 texPos;\nuniform vec2 texSize;\n\nvarying vec2 uv;\n\nvoid main() {\n\n    gl_FragColor = color;\n}\n");this.b=this.J=new ea(this.m,"\nattribute vec2 v;\nattribute vec2 uvp;\n   \nuniform mat3 transform;\n\nuniform vec2 pos;\nuniform vec2 size;\n\nvarying vec2 uv;\n   \nvoid main() {\n\n    vec3 op = transform * vec3(v * size + pos, 1);\n    gl_Position = vec4(op, 1);\n    uv = uvp;\n}","\nprecision mediump float;\n \nuniform sampler2D t0;\nuniform vec4 color;\n\nuniform vec2 texPos;\nuniform vec2 texSize;\n\nvarying vec2 uv;\n\nvoid main() {\n      \n    const float DELTA = 0.001;\n    vec2 tex = uv;    \n    tex.x *= texSize.x;\n    tex.y *= texSize.y;\n    tex += texPos;\n    vec4 res = color * texture2D(t0, tex);\n    if(res.a <= DELTA) {\n        discard;\n    }\n    gl_FragColor = res;\n}\n");
da(this.b);{a=document.createElement("canvas");a.width=1024;a.height=1024;var b=a.getContext("2d");b.font="bold 56px sans-serif";b.textAlign="center";let e,f;for(let g=33;123>g;++g){var c=g%16;e=g/16|0;b.fillStyle="#000000";f=String.fromCharCode(g);35==g?f=String.fromCharCode(228):36==g&&(f=String.fromCharCode(169));for(var d=-3;3>=d;++d)for(let h=-3;3>=h;++h)if(!(3>Math.abs(d)&&3>Math.abs(h)))for(let k=-1;1>=k;++k)b.fillText(f,64*c+32+k+d,64*e+48+h);b.fillStyle="#FFFFFF";for(d=-1;1>=d;++d)b.fillText(f,
64*c+32+d,64*e+48)}b=this.m;c=b.createTexture();b.bindTexture(b.TEXTURE_2D,c);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.LINEAR);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.LINEAR);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,b.RGBA,b.UNSIGNED_BYTE,a);a.remove();this.O=new aa(c,1024,1024)}this.P=null;ma(this);this.K=1}clear(a,b,c){let d=this.m;d.clearColor(a,b,c,1);d.clear(d.COLOR_BUFFER_BIT)}g(a,b,c,d){null==a&&(a=1);null==b&&(b=1);null==c&&(c=1);null==d&&(d=1);this.b.g(a,b,c,d*this.K)}};class pa{constructor(){this.keys={};window.addEventListener("keydown",a=>{a.preventDefault();a=a.keyCode;1!=this.keys[a]&&(this.keys[a]=2)});window.addEventListener("keyup",a=>{a.preventDefault();a=a.keyCode;0!=this.keys[a]&&(this.keys[a]=3)})}update(){for(let a in this.keys)2==this.keys[a]?this.keys[a]=1:3==this.keys[a]&&(this.keys[a]=0)}getKey(a){return this.keys[a]|0}};function J(a,b,c,d,e,f,g,h){a.N=b;a.speed=c;a.b.r=d;a.b.aa=e;a.b.V=f;a.a=60;null!=g&&(a.W=g);a.h=h?h:0;a.c=a.h;a.active=!0}function M(a){let b=a.a/60;a.N&&(b=1-b);return b}function qa(a){if(.001>=a.h)return 0;let b=a.c/a.h;a.N&&(b=1-b);return b}
class ra{constructor(){this.a=0;this.W=()=>{};this.b={r:0,aa:0,V:0};this.active=!1;this.speed=1;this.N=!1;this.c=0;this.h=1}update(a){this.active&&!(0<(this.c-=1*a.step))&&0>=(this.a-=this.speed*a.step)&&(0==(this.N=!this.N)?(this.W(a),this.a+=60):(this.active=!1,this.a=0))}u(a){if(this.active&&!(0<this.c)){y(a);z(a);var b=H(a,!1);a.g(this.b.r,this.b.aa,this.b.V,M(this));D(a,0,0,0,a.viewport.x,a.viewport.y);b&&H(a,!0)}}};function sa(a,b){a.h+=b-a.s;let c=Math.floor(a.h/a.target)|0,d=0<c;5<c&&(a.h=5*a.target,c=5);for(;0<c--;)null!=a.a&&null!=a.a.update&&a.a.update(a.b),a.b.input.update(),a.b.D.update(a.b),a.h-=a.target;d&&(null!=a.a&&null!=a.a.u&&a.a.u(a.j),a.b.D.u(a.j));a.s=b;window.requestAnimationFrame(e=>sa(a,e))}
class ta{constructor(){this.c=[];this.a=null;this.s=this.h=0;this.frameRate=30;this.target=0;this.w=document.createTextNode("Initializing...");document.body.style.color="rgb(255, 255, 170)";document.body.appendChild(this.w);this.b={R:(a,b)=>{this.R(a,b)},input:new pa,D:new ra};this.j=new oa(128,96);window.addEventListener("resize",()=>ma(this.j))}R(a,b){null!=this.c[a]&&(this.a=this.c[a]);null!=this.a.$&&this.a.$(b)}};const ua=[{i:7,l:7,data:[0,0,3,0,3,3,0,1,1,0,1,0,0,0,0,0,3,0,1,0,2,1,0,0,3]},{i:7,l:7,data:[3,7,0,0,3,0,1,3,1,4,5,0,0,0,0,3,1,1,4,3,0,7,2,0,0]},{i:7,l:7,data:[3,9,0,7,11,6,8,5,3,0,9,1,8,1,6,3,0,10,1,0,2,0,0,8,3]},{i:7,l:7,data:[3,11,13,0,0,0,4,9,1,10,8,1,0,0,3,3,1,2,0,0,0,8,15,0,3]},{i:7,l:7,data:[0,3,8,11,3,8,9,0,0,9,3,2,5,0,0,4,0,6,14,12,10,15,0,1,3]},{i:7,l:7,data:[3,11,15,0,3,9,0,10,1,0,14,8,6,14,4,0,8,7,9,0,3,5,8,3,2]},{i:7,l:7,data:[3,8,3,17,6,11,8,0,15,0,3,9,0,4,3,9,2,1,8,8,15,0,16,0,10]},
{i:7,l:7,data:[17,10,5,8,3,0,15,0,1,9,8,8,4,7,12,3,8,9,13,0,11,16,0,8,2]},{i:7,l:7,data:[3,16,8,10,3,8,9,7,1,16,6,17,0,11,9,0,13,0,8,17,10,4,2,7,3]},{i:7,l:7,data:[17,10,8,5,3,6,8,8,0,7,3,19,0,7,4,0,18,12,16,0,2,0,0,7,3]},{i:7,l:7,data:[17,7,18,7,3,3,11,8,4,0,4,19,2,5,14,10,6,5,8,9,3,16,8,18,3]},{i:8,l:8,data:[11,7,19,0,5,3,3,4,5,17,7,18,16,0,13,9,8,9,8,9,15,1,8,3,8,8,10,0,6,0,3,5,0,12,0,2]},{i:8,l:8,data:[3,20,0,20,19,20,20,8,3,6,8,18,3,5,9,3,7,20,9,11,20,9,3,0,4,8,10,6,8,20,2,5,9,3,20,3]}];function N(a,b,c,d,e,f){c=(c+.5)*a.i;a=(d+.5)*a.l+8;e||(b.g(0,0,0,.25),b.push(),b.translate(c+2,a),b.rotate(Math.PI/12),z(b),D(b,3,0,0,26,18),b.pop());b.g(0,0,0);for(d=1;0<=d;--d)0==d&&(e?b.g(...f[0]):b.g(...f[1])),D(b,3,c,a,20+3*d,10+3*d),e||(D(b,0,c-20-3*d,a-16-3*d,2*(20+3*d),16+6*d),0==d&&b.g(...f[2]),D(b,3,c,a-16,20+3*d,10+3*d))}
function va(a,b,c,d,e,f){a.push();a.translate(b,c);a.rotate(-Math.PI/6);a.scale(d,e);z(a);for(b=1;b>=(f?1:0);--b){f?a.g(...f):1==b?a.g(0,0,0):a.g(1,.9,.2);D(a,3,0,-12,14+3*b,10+3*b);D(a,0,-5-3*b,-8-3*b,10+6*b,32+6*b);for(c=0;2>c;++c)D(a,0,5+3*b,6-3*b+12*c,10,6+6*b);0==b&&(a.g(0,0,0),D(a,3,0,-12,7,5))}a.pop()}function wa(a,b,c,d,e,f){null==e&&(e=1);null==f&&(f=1);d=4+2*Math.sin(d);va(a,b,c,e,f,[0,0,0,.25]);va(a,b-d,c-d,e,f)}class xa{constructor(a,b){this.i=a;this.l=b}};const ya=[[.9,.95,1],[.6,.8,1],[.05,.25,.6],[.15,.45,.8],[.33,.67,1]],za=[[1,.9,.95],[1,.6,.8],[.6,.05,.25],[.8,.15,.45],[1,.33,.67]],Aa=[[.95,.95,.95],[.8,.8,.8],[.3,.3,.3],[.46,.46,.46],[.67,.67,.67]],Ba=[[.8,.15,.45],[.6,.05,.25],[1,.33,.67]],Ca=[[.33,1,.33],[0,.67,0],[.67,1,.67]];function O(a,b,c){return 0>b||0>c||b>=a.i||c>=a.l?1:a.data[c*a.i+b]}function Q(a,b,c,d,e,f){let g=a.I[c*a.i+b];a=O(a,b,c);return null!=d&&4<=a&&7>=a&&d==a-4||e&&0>g?!0:null!=f&&0<f&&16==a?!1:0<g}
function T(a,b,c,d){let e=!1;2==d&&16==O(a,b,c)&&(a.data[c*a.i+b]=0,e=!0);a.I[c*a.i+b]=d;return e}
function Da(a,b,c,d,e,f){let g=[O(a,c-1,d)!=e,O(a,c,d-1)!=e,O(a,c+1,d)!=e,O(a,c,d+1)!=e];b.g(...f[4]);D(b,0,64*c,64*d,64,64);g[2]&&(b.g(...f[2]),D(b,0,64*c+51.2,64*d,12.8,64));g[3]&&(b.g(...f[3]),D(b,0,64*c,64*d+51.2,64,12.8),g[2]&&(b.g(...f[2]),D(b,1,64*c+51.2,64*d+51.2,-12.8,-12.8)));g[0]&&(b.g(...f[0]),D(b,0,64*c,64*d,12.8,64),g[3]&&(b.g(...f[3]),D(b,1,64*c,64*d+51.2,-12.8,12.8)));g[1]&&(b.g(...f[1]),D(b,0,64*c,64*d,64,12.8),g[0]&&(b.g(...f[0]),D(b,1,64*c,64*d,12.8,12.8)),g[2]&&(b.g(...f[2]),D(b,
1,64*c+51.2,64*d,-12.8,12.8)));const h=[0,1,1,0],k=[0,0,1,1],l=[-1,-1,1,1],p=[-1,1,1,-1];let n,q;for(let t=0;4>t;++t)n=h[t],q=k[t],g[t]||g[(t+1)%4]||O(a,c-1+2*n,d-1+2*q)==e||(b.g(...f[t]),D(b,1,64*c+51.2*n,64*d+51.2*q,12.8*l[t],12.8*p[t]),b.g(...f[(t+1)%4]),D(b,1,64*c+51.2*n,64*d+51.2*q,-12.8*l[t],-12.8*p[t]))}
function Ea(a,b,c,d,e){c=64*(c+.5);d=64*(d+.5);b.g(.75,0,1);D(b,0,c-32*e,d-32*e,64*e,64*e);let f;for(let g=0;4>g;++g)f=1-(.25*g+.25*a.j)%1,b.g(.75*f,0,f),D(b,0,c-64*f/2*e,d-64*f/2*e,64*f*e,64*f*e)}
class Fa{constructor(a,b){var c=ua[a-1];this.id=a;this.data=Array(c.i*c.l);this.data.fill(1);for(a=0;a<c.l-2;++a)for(var d=0;d<c.i-2;++d)this.data[(a+1)*c.i+(d+1)]=c.data[a*(c.i-2)+d];this.i=c.i;this.l=c.l;this.I=Array(c.i*c.l);this.I.fill(0);this.j=0;this.a=30;this.c=new w;this.h=this.U=0;this.b=new xa(64,64);for(c=0;c<this.l;++c)for(a=0;a<this.i;++a)switch(d=O(this,a,c),d){case 1:case 8:case 16:T(this,a,c,1);break;case 2:null==b.G&&(b.G=new Ga(a,c));this.c.x=64*(a+.5);this.c.y=64*(c+.5);break;case 3:T(this,
a,c,-1);d=b;d.h.push(new Ha(a,c));++d.X;break;case 12:case 13:case 14:case 15:case 20:T(this,a,c,2),b.Y.push(new Ia(a,c,Math.min(d-12,4)))}}update(a,b){a&&(0<this.a&&(this.a-=1*b.step,this.a=Math.max(0,this.a)),this.j=(this.j+.025*b.step)%1);this.U=(this.U+b.step)%60;this.h=(this.h+.05*b.step)%(2*Math.PI)}};function Ja(a,b){if(!a.F)return!0;if(!a.M)return!1;0>=(a.T-=1*b.step)&&(a.M=!1,a.F=!1);return!0}function Ka(a,b){a.B&&(null==a.v&&(a.H-=b.step),0>=a.H&&(a.H=0,a.B=!1,a.f=a.target.clone()),b=a.H/30,a.A.x=64*(a.f.x*b+(1-b)*a.target.x),a.A.y=64*(a.f.y*b+(1-b)*a.target.y))}
class La{constructor(a,b){this.f=new w(a|0,b|0);this.A=new w(64*a,64*b);this.H=this.depth=0;this.target=this.f.clone();this.B=!1;this.F=!0;this.v=null;this.T=0;this.M=!1}finish(a,b){return U(b)?this.M||!this.F?!0:null!=this.v&&this.v.F||2!=O(a,this.f.x,this.f.y)?!1:(T(a,this.f.x,this.f.y,0),this.T=30,this.M=!0,V(b,this.A.x+32,this.A.y+32,6,10,this.depth,[1,1,1]),!0):!1}};class Ha extends La{constructor(a,b){super(a,b);this.a=0;this.depth=this.A.y+32+16}update(a,b){Ja(this,b)||(null!=this.v&&(this.v.M?this.B||(this.f=this.target.clone(),this.target=this.v.target.clone(),this.B=!0,T(a,this.f.x,this.f.y,0)):!this.v.B||this.B||this.f.x==this.v.f.x&&this.f.y==this.v.f.y||2==a.I[this.v.f.y*a.i+this.v.f.x]||(this.target=this.v.f.clone(),this.B=!0,T(a,this.f.x,this.f.y,0),this.v.M||T(a,this.target.x,this.target.y,2)),this.B?(this.H=this.v.M?this.v.T:this.v.H,this.a=(1-this.H/
30)*(this.f.x%2==this.f.y%2==0?1:-1)):T(a,this.f.x,this.f.y,2)),Ka(this,b),this.depth=this.A.y+32+16)}u(a,b,c,d,e,f,g){const h=[6,3,0],k=[0,0,-2,-6],l=[0,0,-2,-6];var p=[[0,0,0],[.5,.45,.4],[.85,.8,.75],[1,1,1]];const n=[[0,0,0],[.8,.25,.15],[1,.5,.4],[1,.8,.8]];if(this.F&&!(e&&.01>e)){var q=this.A.x+(f?0:32);d=this.A.y+(f?0:32)+(d?0:-8);p=this.v?p:n;null==c&&(c=0);null==e&&(e=1);this.M&&I(a,this.T/30);b||(a.g(0,0,0,.25),D(a,3,q,d+24,24,8));a.push();a.translate(q,d);a.rotate(c+Math.sin(this.a*Math.PI)*
Math.PI/6);a.scale(e,e);z(a);for(b=g?1:0;3>b;++b)a.g(...p[b]),D(a,5,k[b],l[b],22+h[b],22+h[b]);a.g(...p[3]);D(a,3,k[3],l[3],10,10);a.pop();I(a,1)}}};class Ma{constructor(){this.a=this.h=this.b=this.c=0;this.j=300}update(a){this.h=(this.h+.025)%(2*Math.PI);1!=this.a&&(145>this.c?0>=(this.b-=a.step)&&(this.b+=5,++this.c):!a.D.active&&(0>=(this.j-=a.step)||2==a.input.getKey(13))&&J(a.D,!0,1,0,0,0,()=>{++this.a}))}u(a){const b=[48,96][this.a],c=[-24,-20][this.a],d=2*Math.PI/[8,4][this.a];0==this.a?a.clear(1,1,1):a.clear(0,0,0);y(a);x(a,a.i,a.l,720);z(a);let e=a.viewport.x/2,f=a.viewport.y/2-b/2;0==this.a&&(e-=27*(b+c)/2,f-=8*b/2);let g=0==this.a?
"Congratulations!\n      \nYou managed to save\nall your precious\neggs - the children\nunborn! Now you can\ngo back home...\n      \n...and eat 'em all!\n".substr(0,this.c):"The End";a.g(1,1,.5);G(a,g,e,f,c,b,b,1==this.a,d,3,this.h)}};function Na(a,b){let c=a.f.x|0,d=a.f.y|0;return Q(b,c-1,d,1,null,a.b)&&Q(b,c+1,d,3,null,a.b)&&Q(b,c,d-1,2,null,a.b)&&Q(b,c,d+1,0,null,a.b)}
function Oa(a,b,c,d,e){let f=a.f.x|0,g=a.f.y|0;if(!a.B){a.j=!1;a:{var h=null;var k=O(b,a.f.x,a.f.y);if(4<=k&&7>=k){if(h=new w(a.f.x,a.f.y),h.x+=[0,1,0,-1][k-4],h.y+=[-1,0,1,0][k-4],Q(b,h.x,h.y)){k=null;break a}}else{if(10==k||18==k){18==k&&(b.U=(b.U+60)%60);for(h=0;h<b.i*b.l;++h)b.data[h]==k||b.data[h]==k+1?b.data[h]=b.data[h]==k?k+1:k:10!=k||2==b.I[h]||8!=b.data[h]&&9!=b.data[h]?18==k&&4<=b.data[h]&&7>=b.data[h]&&(b.data[h]=4+(b.data[h]-4+2)%4):(b.data[h]=8==b.data[h]?9:8,b.I[h]=!b.I[h]);k=null;
break a}null!=d&&17==k&&(b.data[a.f.y*b.i+a.f.x]=0,++a.b,V(d,a.A.x+32,a.A.y+32,4,12,1,[1,1,.5]))}k=h}h=null;null!=k||e?null!=k&&(f=k.x,g=k.y,a.j=!0):1==c.input.getKey(37)?(--f,h=1):1==c.input.getKey(39)?(++f,h=3):1==c.input.getKey(38)?(--g,h=2):1==c.input.getKey(40)&&(++g,h=0);Q(b,f,g,h,null,a.b)||f==(a.f.x|0)&&g==(a.f.y|0)||(a.B=!0,a.H=30,a.target.x=f,a.target.y=g,T(b,a.f.x,a.f.y,0),T(b,f,g,2)&&(--a.b,V(d,64*(f+.5),64*(g+.5),5,10,1,[1,1,1])))}}
class Ga extends La{constructor(a,b){super(a,b);this.b=this.c=this.X=this.a=this.h=0;this.j=!1}update(a,b,c){Ja(this,c)||(Oa(this,a,c,b),Ka(this,c),a=2*Math.PI/30,this.B&&!this.j?(this.a+=a*c.step,this.c+=a*c.step,this.a%=2*Math.PI,this.c%=2*Math.PI,this.h=0):(this.c=this.a=0,this.h+=.05*c.step,this.a%=2*Math.PI),this.depth=this.A.y+32+18)}u(a,b){const c=Math.PI/16,d=[.67,.4,.1],e=[[1,.7,0],[.8,.4,0]];if(this.F){var f=b?0:this.A.x+32,g=b?0:this.A.y+32;this.M&&I(a,this.T/30);b||(a.g(0,0,0,.25),D(a,
3,f,g+-2+10+12,24,7));var h=g+-12+10,k=4*Math.sin(this.c);for(let l=-1;1>=l;l+=2)b||(a.g(0,0,0),D(a,2,f+10*l-1+1,h+k*l,20,-12)),a.g(...d),D(a,2,f+10*l,h+k*l,16,-10);a.push();a.translate(f,g+-12+2*Math.sin(this.h));a.rotate(Math.sin(this.a)*c);z(a);b||(a.g(0,0,0),D(a,0,-27,-23,54,46));a.g(...[.9,.9,.9]);D(a,0,-24,-20,48,40);for(b=-1;1>=b;b+=2)a.g(0,0,0),D(a,3,12*b,-6,10,10),a.g(),D(a,3,12*b+2,-8,3,3);for(b=0;2>b;++b)a.g(...e[b]),D(a,1,-16*(1-b),0,-16+32*b,16);a.pop();I(a,1)}}};class Pa{constructor(){this.f=new w;this.speed=new w;this.a=this.angle=0;this.c=1;this.b=[1,1,1];this.scale=32;this.depth=0;this.F=!1}update(a){this.F&&(this.speed.y+=.2*a.step,this.speed.y=Math.min(4,this.speed.y),this.angle+=this.speed.x/8*.25*a.step,0>=(this.a-=this.c*a.step)&&(this.F=!1),this.f.x+=this.speed.x*a.step,this.f.y+=this.speed.y*a.step)}u(a){this.F&&(a.push(),a.translate(this.f.x,this.f.y),a.rotate(this.angle),z(a),a.g(...this.b,this.a/60),D(a,6,0,0,this.scale,this.scale),a.pop())}}
;function Qa(a,b,c,d,e){var f=Math.PI/16;const g=[-2,-2,2,2][a.a],h=[2,-2,-2,2][a.a];var k=a.B?a.H/30:0;f+=Math.abs(k-.5)/.5*(Math.PI/4-f);k=Math.sin(k*Math.PI)*Math.PI/6;a.f.x%2==a.f.y%2&&(k*=-1);b.push();b.translate(a.A.x+32+c,a.A.y+32+d);b.rotate(k+Math.PI/2*(a.a-1));b.scale(-1,1);z(b);e&&b.g(...e);for(a=1;0<=a;--a)for(e||(0==a?b.g(.8,.67,1):b.g(0,0,0)),c=0;2>c;++c)b.push(),b.rotate(f*(1-2*c)),z(b),1==a&&D(b,0,-27,-3*(1-c),54,3),D(b,7,-24*c-3*a*c,-24*c-3*a*c,24-48*c+3*a*(1-2*c),24-48*c+3*a*(1-2*
c)),b.pop();if(!e)for(e=0;2>e;++e)b.g(0,0,0),D(b,3,-12,10*(-1+2*e),7,7),b.g(),D(b,3,-12+g,10*(-1+2*e)+h,2.5,2.5);b.pop()}
class Ia extends La{constructor(a,b,c){super(a,b);this.a=c;this.v=1}update(a,b,c){this.B&&Q(b,this.target.x,this.target.y)&&(this.B=!1,this.target=this.f.clone());this.H=a.H;Ka(this,c);if(!this.B&&(T(b,this.f.x,this.f.y,2),a.B))a:{c=[0,1,0,-1];const d=[-1,0,1,0],e=[2,3,0,1];let f=this.f.x,g=this.f.y;4>this.a?(f+=c[this.a],g+=d[this.a]):(f-=a.target.x-a.f.x,g-=a.target.y-a.f.y);if(Q(b,f,g,null,!0)){if(4==this.a)break a;a=e[this.a];f=this.f.x+c[a];g=this.f.y+d[a];if(Q(b,f,g,null,!0))break a;this.a=
a}this.target.x=f;this.target.y=g;this.B=!0;T(b,this.f.x,this.f.y,0)}}u(a){if(4>this.a)Qa(this,a,0,0,[0,0,0,.25]),Qa(this,a,-2,-2);else{var b=this.B?this.H/30:0;a.push();a.translate(this.A.x+32,this.A.y+32);a.rotate(b*Math.PI/2*(this.f.x-this.target.x+(this.f.y-this.target.y)));z(a);for(b=-2;2>=b;++b)for(let c=-2;2>=c;++c)2>Math.abs(c)&&2>Math.abs(b)||(a.g(0,0,0),D(a,4,c,b,24,24));a.g(.75,.75,.75);D(a,4,0,0,24,24);a.pop()}}};function V(a,b,c,d,e,f,g){let h=Math.random()*Math.PI*2,k=2*Math.PI/d;for(let P=0;P<d;++P){{let R;var l=a,p=b,n=c,q=4*Math.cos(h),t=4*Math.sin(h)-4,B=e,u=g,K=f;for(let E=0;E<l.a.length;++E)if(!(R=l.a[E]).F){l=R;l.f=new w(p,n);l.speed=new w(q,t);l.angle=Math.random()*Math.PI*2;l.a=60;l.c=1;l.b=null==u?[1,1,1]:u;l.scale=B;l.depth=K;l.F=!0;break}}h+=k}}function U(a){return a.G.X==a.X}
function Ra(a){a.b=[];a.b.push(a.G);for(var b=0;b<a.h.length;++b)a.b.push(a.h[b]);for(b=0;b<a.a.length;++b)a.a[b].F&&a.b.push(a.a[b]);a.b.sort((c,d)=>c.depth-d.depth)}
class Sa{constructor(){this.G=null;this.h=[];this.Y=[];this.c=[];this.a=Array(16);for(let a=0;a<this.a.length;++a)this.a[a]=new Pa;this.b=[];this.X=0}update(a,b,c){null!=this.G&&this.G.update(a,this,c);for(let h=0;h<this.h.length;++h){var d=this.h[h],e=this.G,f=this.c,g=a;null==d.v&&d.F&&e.f.x==d.f.x&&e.f.y==d.f.y&&(0!=f.length&&(f[f.length-1].v=d),d.v=e,f.push(d),++e.X,V(this,d.A.x+32,d.A.y+32,5,10,d.depth,[1,.25,.2]),T(g,d.f.x,d.f.y,2))}for(d=this.c.length-1;0<=d;--d)this.c[d].update(a,c);for(d=
0;d<this.Y.length;++d)this.Y[d].update(this.G,a,c);if(!(d=null==this.G||U(this)&&this.G.finish(a,this))){a:{d=this.G;if(!d.B&&Na(d,a)&&(Oa(d,a,null,null,!0),Na(d,a))){d=!0;break a}d=!1}d=!d}if(d){for(b=this.c.length-1;0<=b;--b)this.c[b].finish(a,this);for(a=0;a<this.a.length;++a)this.a[a].update(c)}else W(b,1)}u(a){Ra(this);for(var b=0;b<this.Y.length;++b)this.Y[b].u(a);for(b=0;b<this.b.length;++b)this.b[b].u(a)}};class X{constructor(a,b){this.text=a;this.W=b}}
class Ta{constructor(){this.buttons=[];this.c=this.a=0}b(a){for(let b=0;b<arguments.length;++b)this.buttons.push(arguments[b]),arguments[b].text.length>this.c&&(this.c=arguments[b].text.length)}update(a){let b=0;2==a.input.getKey(38)?--b:2==a.input.getKey(40)&&++b;this.a=ka(this.a+b,this.buttons.length);2==a.input.getKey(13)&&(a=this.buttons[this.a].W,null!=(a=this.buttons[this.a].W)&&a())}u(a,b,c){var d=b/8;const e=d/2;var f=2*d;const g=[[1,1,1],[1,1,0]];let h=this.buttons.length;d=b+d;let k=a.viewport.y/
2-h*d/2,l=a.viewport.x/2,p;let n;if(c){var q=(this.c+2)*(b+-20)+2*f;n=h*d+2*f;f=l-q/2;p=a.viewport.y/2-n/2;H(a,!1);a.g(...c);D(a,0,f,p,q,n);H(a,!0)}for(f=0;f<h;++f)f==this.a?(c=1.1*b,q=g[1]):(c=b,q=g[0]),G(a,this.buttons[f].text,l,k+f*d,-20,c,c,!0,null,null,null,e,.25,q)}};function Ua(a,b){var c=Number(b.substr(0,2));let d=Number(b.substr(2,2));b=Number(b.substr(4,1));c=50>=c?1+2*((50-c)/a.a|0):2*((c-50)/a.a|0);return c!=d/a.V|0||7*c%10!=b?-1:c}class Va{constructor(a,b){this.a=null==a?5:a;this.V=null==b?7:b}};const Y=[.33,.67,1];function W(a,b,c){if(2==b&&(++a.id,a.id>ua.length)){J(c.D,!0,.5,1,1,1,()=>{c.R("ending")});return}J(a.a,!0,b?3-b:2,...Y,()=>{Wa(a)},30*b);a.c=b}function Wa(a,b){null!=b&&0<b&&(a.id=b);{var c=a.Z;b=a.id;let d=50+(b/2|0)*c.a*(1-b%2*2);c=b*c.V;b=(10>d?"0":"")+String(d)+((10>c?"0":"")+String(c))+String(7*b%10)}a.S=b;a.h=new Sa;a.w=new Fa(a.id,a.h)}
function Z(a,b,c,d,e){a.push();a.translate(b+16,c+8);a.rotate(e);z(a);a.g(0,0,0,.25);D(a,4,0,0,d,d);a.pop();a.push();a.translate(b,c);a.rotate(e);z(a);a.g(...[.5,.5,.5]);D(a,4,0,0,d,d);a.g(...[.75,.75,.75]);D(a,4,0,0,d-8,d-8);a.pop()}
class Xa{constructor(a){this.id=1;this.Z=new Va;this.S="";this.w=this.h=null;Wa(this);this.P=this.s=0;this.a=new ra;J(this.a,!1,1,...Y);this.j=this.J=this.L=this.O=this.c=0;this.K=new Ta;this.C=!1;this.K.b(new X("Resume",()=>{this.C=!1}),new X("Restart",()=>{this.C=!1;W(this)}),new X("Quit",()=>{J(a.D,!0,2,...Y,()=>{a.R("title",1)})}));this.b=120}update(a){var b=Math.PI/2/30;0<=this.b&&(this.b-=a.step);if(!a.D.active)if(this.P+=.05*a.step,this.C)this.K.update(a);else{var c=this.h;c.G.B||c.G.M||!c.G.F||
this.a.active?this.s=ka(this.s+b*(this.a.active?-1:1)*a.step,Math.PI/2):this.s=0;60<=this.b||(this.a.active?(0<this.c&&(this.O=(this.O+.025*a.step)%(2*Math.PI)),this.a.update(a)):(this.b=-1,2==a.input.getKey(13)?(this.C=!0,this.K.a=0):(0!=this.j&&0>=(this.J-=a.step)&&(this.J=this.j=0),this.w.update(U(this.h),a),this.h.update(this.w,this,a),b=this.h,0<b.c.length&&!b.c[0].F?W(this,2,a):2==a.input.getKey(82)&&W(this))))}}u(a){var b=Math.PI/3;a.clear(...Y);H(a,!1);var c=1,d=1,e=null,f=null,g=null;this.a.active&&
(2==this.c&&this.a.N&&(e=this.w.c.x,f=this.w.c.y,d=8,g=-b*M(this.a)),c=M(this.a),c=1+c*d*.25*(this.a.N?1:-1));b=this.w;x(a,a.i,a.l,64*b.l);d=64*b.i/2;var h=64*b.l/2,k=0,l=0;1<=a.i/a.l?k=a.viewport.x/2-d:l=a.viewport.y/2-h;null!=e&&(d=e);null!=f&&(h=f);a.translate(k,l);a.translate(d,h);null!=g&&a.rotate(g*(0==b.id%2?-1:1));a.scale(c,c);a.translate(-d,-h);z(a);b=this.w;c=U(this.h);for(e=0;e<b.l;++e)for(g=0;g<b.i;++g)switch(f=O(b,g,e),f){case 1:Da(b,a,g,e,1,ya);break;case 8:Da(b,a,g,e,8,za);break;case 16:f=
a;d=64*(g+.5);h=64*(e+.5);Da(b,f,g,e,-1,Aa);f.g(0,0,0);D(f,3,d,h+-8,8,8);D(f,2,d,h+4,12,16);break;default:d=a;h=g;k=e;h%2==k%2?d.g(.9,.75,.5):d.g(.8,.55,.3);D(d,0,64*h,64*k,64,64);if(2==f)if(l=b.a/30,c&&0>=l)Ea(b,a,g,e,1);else{if(!c||0<l)d=a,h=g,k=e,d.push(),d.translate(64*(h+.5),64*(k+.5)),d.rotate(Math.PI/4),z(d),d.g(.67,0,0),D(d,0,-25.6,-8,51.2,16),D(d,0,-8,-25.6,16,51.2),d.pop(),Ea(b,a,g,e,1-l)}else if(4<=f&&7>=f){k=b;d=a;l=g;var p=e,n=f-4;h=[[.67,1,.67],[0,.67,0]];d.push();d.translate(64*(l+
.5),64*(p+.5));d.rotate(n*Math.PI/2);z(d);k=30>=k.U?0:1;for(l=0;2>l;++l)d.g(...[0,.33,0]),D(d,2,0,-14+26*l,36,14),d.g(...h[(l+k)%2]),D(d,2,0,-14+26*l,24,10);d.pop()}else if(9==f)for(d=a,h=64*g,k=64*e,d.g(.6,.05,.25),l=0;2>l;++l)for(p=0;2>=p;++p)D(d,0,h+24*p,k+56*l,16,8),D(d,0,h+56*l,k+24*p,8,16);else 11==f?N(b.b,a,g,e,!0,Ba):19==f&&N(b.b,a,g,e,!0,Ca);{var q;d=b;h=a;k=g;l=e;p=[1!=d.I[l*d.i+(k-1)],1!=d.I[(l-1)*d.i+k],1!=d.I[l*d.i+(k+1)],1!=d.I[(l+1)*d.i+k]];h.g(0,0,0,.25);n=1==d.I[(l-1)*d.i+(k-1)];
var t=q=0;p[0]?p[1]?n&&D(h,0,64*k,64*l,16,16):(p[0]&&!n&&(q=3),D(h,p[0]&&!n?1:0,64*k-q,3+64*l,-16,-13),D(h,0,64*(k+.25)-q,3+64*l,48+q,13)):(p[1]&&!n&&(t=1,q=3),D(h,0,3+64*k,64*(l+.25)-q,13,48+q),D(h,t,3+64*k,64*l-q,13,16),p[1]||D(h,0,64*(k+.25),64*l,48,16));h.g(0,0,0);p[0]||D(h,0,64*k,64*l,3,64);p[1]||D(h,0,64*k,64*l,64,3);p[2]||D(h,0,64*(k+1)-3,64*l,3,64);p[3]||D(h,0,64*k,64*(l+1)-3,64,3);t=[0,1,1,0];const B=[0,0,1,1];for(let u=0;4>u;++u)q=t[u],n=B[u],p[u]&&p[(u+1)%4]&&1==d.I[(l-1+2*n)*d.i+(k-1+
2*q)]&&D(h,0,64*k+61*q,64*l+61*n,3,3)}10==f?N(b.b,a,g,e,!1,Ba):18==f?N(b.b,a,g,e,!1,Ca):17==f&&wa(a,64*(g+.5),64*(e+.5),b.h+(g+e)*Math.PI*2/b.i)}this.h.u(a);y(a);x(a,a.i,a.l,720);z(a);this.a.u(a);if(this.a.active&&0<this.c){b=[88,72][this.c-1];c=[72,56][this.c-1];e=["STUCK","STAGE CLEAR"][this.c-1];g=[[1,.4,0],[1,1,.5]][this.c-1];f=a.viewport.y/2;d=a.viewport.x/2-(e.length-1)*c/2;H(a,!0);h=M(this.a);this.a.N&&(h=qa(this.a));l=1/e.length;for(n=0;n<e.length;++n)k=(h-l*(this.a.N?n:e.length-1-n))/l,k=
Math.max(0,Math.min(k,1)),p=-64+64*k+-16*Math.sin(this.O+n*Math.PI*2/e.length),I(a,k),G(a,e.charAt(n),d+n*c,f-b/2+p,0,b,b,!0,null,null,null,8,.25,g);H(a,!1);I(a,1)}Z(a,0,0,128,this.s);Z(a,a.viewport.x,0,96,-this.s);Z(a,0,a.viewport.y,96,-this.s);Z(a,a.viewport.x,a.viewport.y,128,this.s);b=["STAGE "+String(Math.min(ua.length,this.id)),"Password: "+this.S];c=[64,48];e=[6,4];g=[Math.PI/3,Math.PI/6];f=[6,4];d=[1,1,.5];H(a,!0);for(l=0;2>l;++l)k=2==this.c&&this.a.active?Math.max(M(this.a),qa(this.a))*(e[l]+
c[l]):0,h=0==l?36:a.viewport.y-4-32,h-=c[l]/2,h-=(1-2*l)*k,G(a,b[l],a.viewport.x/2,h,-16,c[l],c[l],!0,g[l],e[l],this.P,f[l],.25,d);c=a.viewport.y/3;e=this.h.G.b;e!=this.L&&0==this.j&&(this.j=e<this.L?-1:1,this.J=30);this.L=e;if(!(0>=e&&0==this.j)){-1==this.j&&++e;H(a,!1);b=1;0!=this.j&&(b=this.J/30,1==this.j&&(b=1-b));for(g=0;g<e;++g)I(a,g==e-1?b:1),wa(a,64,c+128*g,0,2,2);I(a,1);H(a,!0)}this.C&&this.K.u(a,48,[.33,.67,1,.75]);0<this.b&&(c=this.b/120,c=1+3*c,I(a,Math.max(0,Math.min(this.b/60,1))),G(a,
"Save the unborn!",a.viewport.x/2,a.viewport.y/2-32*c/2,-24,32*c,32*c,!0,null,null,null,2*c,.25,[1,.75,.33]),I(a,1))}$(a){0==a?(this.b=120,a=1):this.b=0;Wa(this,a);this.C=!1;this.c=0;J(this.a,!1,1,...Y)}};class Ya{constructor(a){this.a=120;J(a.D,!1,1,0,0,0)}update(a){a.D.active||0>=(this.a-=a.step)&&J(a.D,!0,2,0,0,0,()=>{a.R("title")})}u(a){let b=a.viewport.x/2,c=a.viewport.y/2;a.clear(0,0,0);H(a,!0);y(a);a.translate(b,c);x(a,a.i,a.l,720);z(a);a.g(1,1,1);G(a,"Created by",0,-64,-20,32,32,!0);G(a,"Jani Nyk#nen",0,-32,-20,64,64,!0)}};function Za(a){let b=document.createElement("canvas");b.width=1024;b.height=256;var c=b.getContext("2d");c.font="bold 172px sans-serif";c.textAlign="center";for(let d=1;5>d;++d)c.fillStyle="rgb(170, 85, 0)",c.fillText("PUZZLEggs",512+2*d,128+2*d),c.fillRect(32+2*d,144+2*d,640,16);c.fillStyle="rgb(255, 255, 85)";c.fillText("PUZZLEggs",512,128);c.fillRect(32,144,640,16);a=a.m;c=a.createTexture();a.bindTexture(a.TEXTURE_2D,c);a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR);a.texParameteri(a.TEXTURE_2D,
a.TEXTURE_MAG_FILTER,a.LINEAR);a.texImage2D(a.TEXTURE_2D,0,a.RGBA,a.RGBA,a.UNSIGNED_BYTE,b);b.remove();return new aa(c,1024,256)}function $a(a,b){a.J=(a.J+.0125*b.step)%(2*Math.PI);let c=1;3==a.a&&(c=a.w/60);let d,e,f;for(let g=0;g<a.c.length+1;++g)d=a.J+2*Math.PI/a.c.length*g,e=c/(a.c.length+3)*(g+3),e*=e,d*=1-g%2*2,f=g<a.c.length?a.c[g]:a.h,f.A=new w(360*Math.cos(d)*e,360*Math.sin(d)*e),f.scale=3.75*e,f.angle=(f.angle+.05*b.step*(-1+g%2*2))%(2*Math.PI)}
class ab{constructor(a,b){this.S=new Ta;this.P=new Ta;this.C=this.S;let c=[new X("New Game",()=>{this.a=3;this.w=60;this.j=0}),new X("Continue",()=>{this.j=0;J(a.D,!0,2,...Y,()=>{a.R("game")})}),new X("Password",()=>{this.b="";this.a=2})];this.S.b(c[0],c[2]);this.P.b(c[0],c[1],c[2]);this.K=this.a=0;this.Z=new Va;this.b="";this.L=this.s=this.w=this.j=0;this.scale=1;this.O=Za(b);this.c=Array(8);for(b=0;b<this.c.length;++b)this.c[b]=new Ha(0,0),this.c[b].scale=1,this.c[b].angle=0,this.c[b].v=1;this.J=
0;this.h=new Ga(0,0);this.h.scale=1;this.h.angle=0}update(a){let b;this.scale=1;if(a.D.active){if($a(this,{step:0}),a.D.N&&3==this.a){var c=M(a.D);this.scale=1+9*c*c}}else{this.s=this.s+=.0125*a.step;1<=this.s&&(--this.s,this.L=(this.L+1)%2);$a(this,a);if(0==this.a)2==a.input.getKey(13)&&++this.a,this.K+=.05*a.step;else if(1==this.a)this.C.update(a);else if(2==this.a){if(0<this.b.length&&2==a.input.getKey(8))this.b=this.b.substr(0,this.b.length-1);else if(5>this.b.length)for(c=48;57>=c;++c)2==a.input.getKey(c)&&
(this.b+=String(c-48));2==a.input.getKey(13)&&(5==this.b.length?(b=Ua(this.Z,this.b),-1==b?(this.a=1,this.j=120):J(a.D,!0,2,...Y,()=>{a.R("game",b)})):(this.a=1,this.j=120))}else 3==this.a&&0>=(this.w-=a.step)&&J(a.D,!0,.5,...Y,()=>{a.D.speed=2;a.R("game",0)});0<this.j&&(this.j-=a.step)}}u(a){a.clear(...Y);let b=a.viewport.x/2,c=a.viewport.y/2;var d="";y(a);x(a,a.i,a.l,720);z(a);H(a,!1);var e=a.viewport.x/2,f=a.viewport.y/2;a.push();a.translate(e,f);z(a);for(f=0;8>f;++f)e=1-(.125*f+.125*this.s)%1,
e*=e,a.push(),a.rotate(2*Math.PI*e*(0==this.L?1:-1)*(1-f%2*2)),a.scale(this.scale,this.scale),z(a),a.g(Y[0]*e,Y[1]*e,Y[2]*e),D(a,8,0,0,720*e,720*e),a.pop();for(var g of this.c)g.u(a,!0,g.angle,!0,g.scale,!0,!0);a.translate(this.h.A.x,this.h.A.y);a.rotate(this.h.angle);a.scale(this.h.scale,this.h.scale);z(a);this.h.u(a,!0);a.pop();H(a,!0);a.translate(0,192);z(a);if(0==this.a)G(a,"Press Enter",b,c-32,-20,64,64,!0,2*Math.PI/6,8,this.K,8,.25,[1,1,.5]);else if(1==this.a)this.C.u(a,48),0<this.j&&(a.g(1,
.5,0),G(a,"Incorrect password!",b,c-144,-20,32,32,!0));else if(2==this.a){for(g=0;5>g;++g)d+=g>=this.b.length?"_":this.b.charAt(g);G(a,"Enter password and press enter:",b,c-24,-24,32,32,!0,null,null,null,4,.25,[1,1,.5]);G(a,d,b,c-24+48,-20,48,48,!0,null,null,null,4,.25,[1,1,.5])}else 3==this.a&&I(a,this.w/60);y(a);z(a);G(a,"$2019 Jani Nyk#nen",b,a.viewport.y-32+-8,-20,32,32,!0,null,null,null,4,.25,[1,1,1]);for(g=-4;4>=g;++g)for(e=-4;4>=e;++e)4>Math.abs(e)&&4>Math.abs(g)||(a.g(0,0,0),d=this.O,F(a,
d,0,0,d.i,d.l,b-300+e,c+-224+g,600,360));a.g(1,1,1);d=this.O;F(a,d,0,0,d.i,d.l,b-300,c+-224,600,360);I(a,1)}$(a){this.j=0;this.scale=1;null!=a&&(this.a=1,this.C=this.P);this.C.a=null==a?0:1}};window.onload=()=>{let a=new ta;var b=new Xa(a.b);a.c.game=b;a.c.ending=new Ma(a.b);b=new ab(a.b,a.j);a.c.title=b;b=new Ya(a.b);a.c.intro=b;a.a=b;a.frameRate=60;a.b.step=60/a.frameRate;a.target=1E3/a.frameRate;a.w.remove();a.j.a.hidden=!1;sa(a,0)};
