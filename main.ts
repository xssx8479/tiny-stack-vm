import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function v(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,x=0,t=0,i=0,n=0;
 const out=()=>o.subarray(0,n);
 for(;;){
  if(t>=1e6)return[10,out()];
  if(x<0||x>=p.length)return[9,out()];
  const b=p[x];
  if(!((b<=7)||(b>=16&&b<=34)||(b>=48&&b<=52)||(b>=64&&b<=65)||(b>=80&&b<=83)))return[5,out()];
  let m=0;
  if(b==1)m=1;else if(b==2)m=4;else if(b>=48&&b<=51)m=2;
  if(m&&x+m>=p.length)return[9,out()];
  let a=0,u=0;
  if(b>=16&&b<=34){a=b==23||b==27?1:2;u=1}
  else if(b==3||b==4){a=1;u=b==3?0:2}
  else if(b==5||b==6){a=2;u=b==5?2:3}
  else if(b==7){a=3;u=3}
  else if(b==49||b==50||b==64||b==80||b==81||b==83){a=1;u=b==64?1:0}
  else if(b==65)a=2;
  else if(b==1||b==2||b==82)u=1;
  if(s<a)return[2,out()];
  if(s-a+u>256)return[3,out()];
  t++;x+=1+m;
  switch(b){
   case 0:return[0,out()];
   case 1:D[s++]=(p[x-1]<<24)>>24;break;
   case 2:D[s++]=p[x-4]|p[x-3]<<8|p[x-2]<<16|p[x-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const z=D[s-1];D[s-1]=D[s-2];D[s-2]=z;break}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const z=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=z;break}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:case 49:case 50:{
    const r=((p[x-2]|p[x-1]<<8)<<16)>>16;
    let k=true;
    if(b!=48){const z=D[--s];k=b==49?z==0:z!=0}
    if(k)x+=r;break}
   case 51:
    if(c>=64)return[7,out()];
    C[c++]=x;x=p[x-2]|p[x-1]<<8;break;
   case 52:
    if(c==0)return[8,out()];
    x=C[--c];break;
   case 64:{const z=D[s-1];if(z<0||z>=256)return[6,out()];D[s-1]=M[z];break}
   case 65:{const z=D[s-1],y=D[s-2];if(z<0||z>=256)return[6,out()];s-=2;M[z]=y;break}
   case 80:{const z=String(D[--s]);if(n+z.length>65536)return[11,out()];for(const h of z)o[n++]=h.charCodeAt(0);break}
   case 81:if(n+1>65536)return[11,out()];o[n++]=D[--s]&255;break;
   case 82:D[s++]=i<q.length?q[i++]:-1;break;
   case 83:return[D[--s]&255,out()];
   default:{
    const B=D[s-1],A=D[s-2];let r=0;
    if(b==16)r=A+B|0;
    else if(b==17)r=A-B|0;
    else if(b==18)r=Math.imul(A,B);
    else if(b==19){if(B==0)return[4,out()];r=A==-2147483648&&B==-1?A:(A/B)|0}
    else if(b==20){if(B==0)return[4,out()];r=B==-1?0:A%B|0}
    else if(b==21){if(B==0)return[4,out()];r=Math.floor((A>>>0)/(B>>>0))|0}
    else if(b==22){if(B==0)return[4,out()];r=(A>>>0)%(B>>>0)|0}
    else if(b==24)r=A&B;
    else if(b==25)r=A|B;
    else if(b==26)r=A^B;
    else if(b==28)r=A<<(B&31);
    else if(b==29)r=A>>(B&31);
    else if(b==30)r=A>>>(B&31)|0;
    else if(b==32)r=A==B?1:0;
    else if(b==33)r=A<B?1:0;
    else if(b==34)r=(A>>>0)<(B>>>0)?1:0;
    s-=2;D[s++]=r;break}
  }
 }
}
for(const d of readdirSync(I).sort()){
 const[e,o]=v(new Uint8Array(readFileSync(join(I,d,'program.bin'))),new Uint8Array(readFileSync(join(I,d,'input.bin'))));
 mkdirSync(join(O,d),{recursive:true});
 writeFileSync(join(O,d,'stdout.bin'),o);
 writeFileSync(join(O,d,'exit.txt'),e+'\n');
}
