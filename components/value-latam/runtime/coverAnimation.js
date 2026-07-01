export function initCoverAnimation() {
  
      var mount=document.getElementById('coverBrain');
      var scroller=document.getElementById('coverScroll');
      var cap=document.getElementById('coverCaption');
      if(!mount || !scroller || !cap) return;
  
      mount.innerHTML='';
      var canvas=document.createElement('canvas');
      canvas.className='vl2-cover-canvas';
      mount.appendChild(canvas);
      var hud=document.createElement('div');
      hud.className='vl2-cover-hud';
      mount.appendChild(hud);
      var note=document.createElement('div');
      note.className='vl2-cover-note';
      note.textContent='Scroll para desplegar el mapa de unidades';
      mount.appendChild(note);
  
      var ctx=canvas.getContext('2d',{alpha:true});
      var perfLow=window.matchMedia('(max-width: 900px)').matches || (window.devicePixelRatio||1)>1.25;
      var coverActive=true,lastFrame=0,minFrame=perfLow?26:18;
      var dpr=1,w=0,h=0,t=0,progress=0,targetProgress=0,activeStage=-1,lastCaptionStage=-2,captionFade=1,captionPending=null;
      var capS=cap.querySelector('.pb-step'), capT=cap.querySelector('.pb-txt');
      var stages=[
        {p:.07,n:'01',t:'Financiamiento: banca, SGRs y mercado de capitales conectados en un mismo benchmark.',a:['fin']},
        {p:.28,n:'02',t:'Liquidez: se abre la gestion de caja de la empresa y el capital de los socios.',a:['liq','socios']},
        {p:.52,n:'03',t:'Medios de pago: cobros, pagos, saldo remunerado y optimizacion fiscal.',a:['pay','tax']},
        {p:.76,n:'04',t:'Procesos con IA: agentes para ejecutar tareas, reportes y flujos administrativos.',a:['ai','ops']}
      ];
      var nodes=[
        {id:'hub',label:'VALUE LATAM',x:.5,y:.5,r:13,show:0,c:[210,183,117]},
        {id:'fin',label:'Financiamiento',x:.5,y:.17,r:9,show:.07,c:[143,178,214],labelY:-38},
        {id:'liq',label:'Liquidez empresa',x:.8,y:.34,r:9,show:.28,c:[143,178,214],labelX:86,labelY:-6},
        {id:'socios',label:'Capital socios',x:.77,y:.68,r:7,show:.36,c:[210,183,117],labelX:76,labelY:28},
        {id:'pay',label:'Medios de pago',x:.5,y:.82,r:9,show:.52,c:[143,178,214],labelY:42},
        {id:'tax',label:'Optimizacion fiscal',x:.2,y:.68,r:7,show:.49,c:[210,183,117],labelX:-88,labelY:28},
        {id:'ai',label:'Procesos con IA',x:.2,y:.34,r:9,show:.76,c:[143,178,214],labelX:-86,labelY:-6},
        {id:'ops',label:'Agentes IA',x:.32,y:.54,r:7,show:.72,c:[210,183,117],labelX:-78,labelY:2}
      ];
      var links=[
        ['hub','fin',.07],['hub','liq',.28],['liq','socios',.36],
        ['hub','pay',.52],['pay','tax',.51],['hub','ai',.76],['ai','ops',.74]
      ];
      var particles=[];
      var particleTotal=perfLow?58:82;
      for(var i=0;i<particleTotal;i++){
        var ang=Math.random()*Math.PI*2, rad=Math.pow(Math.random(),.5);
        particles.push({a:ang,rad:rad,ph:Math.random()*7,show:Math.random()*.42});
      }
  
      function resize(){
        dpr=Math.min(window.devicePixelRatio||1,perfLow?1:1.1);
        w=mount.clientWidth||innerWidth; h=mount.clientHeight||innerHeight;
        canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
        canvas.style.width=w+'px'; canvas.style.height=h+'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
      }
      function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
      function sm(a,b,v){var x=clamp((v-a)/(b-a),0,1); return x*x*(3-2*x);}
      function stageWeight(i){
        var start=stages[i].p;
        var next=stages[i+1] ? stages[i+1].p : 1.06;
        var fadeIn=sm(start-.13,start+.18,progress);
        var fadeOut=i<stages.length-1 ? 1-sm(next-.18,next+.12,progress) : 1;
        return clamp(fadeIn*fadeOut,0,1);
      }
      function currentStage(){
        var best=-1, bestW=.08;
        stages.forEach(function(s,i){
          var wt=stageWeight(i);
          if(progress>=s.p-.09 && wt>bestW){best=i;bestW=wt;}
        });
        return best;
      }
      function nodePower(id){
        if(id==='hub') return 1;
        var power=0;
        stages.forEach(function(s,i){
          if(s.a.indexOf(id)>-1) power=Math.max(power,stageWeight(i));
        });
        return power;
      }
      function pt(n){
        var s=Math.min(w,h)*.56;
        return {
          x:w*.5+((n.x-.5)*s),
          y:h*.5+((n.y-.5)*s)
        };
      }
      function node(id){return nodes.filter(function(n){return n.id===id})[0];}
      function labelFont(){return (w<520?'700 9.5px IBM Plex Mono, monospace':'600 11px IBM Plex Mono, monospace');}
      function labelPoint(n,p){
        var offsetScale=w<520?.18:1;
        var lx=p.x+(n.labelX||0)*offsetScale, ly=p.y+(n.labelY || (n.y<.5?-34:34))*(w<520?.82:1);
        ctx.font=labelFont();
        var bw=ctx.measureText(n.label).width+(w<520?18:24);
        return {
          x:clamp(lx,bw/2+14,w-bw/2-14),
          y:clamp(ly,22,h-22)
        };
      }
      function softAppear(v){
        return sm(0,1,clamp(v,0,1));
      }
      function drawLabel(text,x,y,c,strength){
        var on=softAppear(strength||0);
        if(on<=.01) return;
        ctx.save();
        ctx.font=labelFont();
        var tw=ctx.measureText(text).width, bw=tw+(w<520?18:24), bh=w<520?25:28;
        ctx.globalAlpha=on;
        ctx.fillStyle='rgba(1,4,10,.72)';
        round(x-bw/2,y-bh/2,bw,bh,14); ctx.fill();
        ctx.strokeStyle='rgba('+c.join(',')+','+(.22+.6*on)+')';
        ctx.stroke();
        ctx.fillStyle='rgba('+c.join(',')+','+(.55+.45*on)+')';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(text,x,y+1);
        ctx.restore();
      }
      function focusBeam(a,b,c,intensity){
        intensity=softAppear(intensity);
        if(intensity<=.01) return;
        var dx=b.x-a.x, dy=b.y-a.y, len=Math.max(1,Math.sqrt(dx*dx+dy*dy));
        var sx=a.x+dx/len*42, sy=a.y+dy/len*42;
        var ex=b.x-dx/len*32, ey=b.y-dy/len*32;
        var mx=(sx+ex)/2+(ey-sy)*.18, my=(sy+ey)/2-(ex-sx)*.18;
        ctx.save();
        ctx.globalCompositeOperation='screen';
        ctx.shadowBlur=14;
        ctx.shadowColor='rgba('+c.join(',')+','+(.35*intensity)+')';
        ctx.strokeStyle='rgba('+c.join(',')+','+(.42*intensity)+')';
        ctx.lineWidth=4.8;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(mx,my,ex,ey); ctx.stroke();
        ctx.shadowBlur=0;
        ctx.strokeStyle='rgba(246,243,236,'+(.26*intensity)+')';
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(mx,my,ex,ey); ctx.stroke();
        ctx.restore();
      }
      function spotlight(p,c,force,intensity){
        var on=softAppear(intensity==null?1:intensity);
        if(on<=.01) return;
        var r=Math.min(w,h)*(force||.22);
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);
        g.addColorStop(0,'rgba('+c.join(',')+','+(.18*on)+')');
        g.addColorStop(.32,'rgba('+c.join(',')+','+(.08*on)+')');
        g.addColorStop(1,'rgba('+c.join(',')+',0)');
        ctx.save();
        ctx.globalCompositeOperation='screen';
        ctx.fillStyle=g;
        ctx.fillRect(0,0,w,h);
        ctx.restore();
      }
      function round(x,y,w,h,r){
        ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
      }
      function curve(pa,pb,alpha,c,strength){
        var on=softAppear(strength||0);
        var dx=pb.x-pa.x, dy=pb.y-pa.y, len=Math.max(1,Math.sqrt(dx*dx+dy*dy));
        var sx=pa.x+dx/len*34, sy=pa.y+dy/len*34;
        var ex=pb.x-dx/len*24, ey=pb.y-dy/len*24;
        var mx=(sx+ex)/2+(ey-sy)*.16, my=(sy+ey)/2-(ex-sx)*.16;
        ctx.save();
        ctx.globalAlpha=alpha;
        ctx.strokeStyle='rgba('+c.join(',')+','+(.24+.48*on)+')';
        ctx.lineWidth=1.15+.85*on;
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(mx,my,ex,ey); ctx.stroke();
        var q=(Math.sin(t*2.2+pa.x*.01)+1)/2;
        var x=(1-q)*(1-q)*sx+2*(1-q)*q*mx+q*q*ex;
        var y=(1-q)*(1-q)*sy+2*(1-q)*q*my+q*q*ey;
        ctx.fillStyle='rgba('+c.join(',')+','+((.35+.6*on)*alpha)+')';
        ctx.beginPath(); ctx.arc(x,y,2.4+on,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      function draw(now){
        requestAnimationFrame(draw);
        if(document.hidden || !coverActive) return;
        if(now && now-lastFrame<minFrame) return;
        lastFrame=now||0;
        t+=perfLow?.01:.012;
        progress += (targetProgress-progress)*.14;
        if(Math.abs(targetProgress-progress)<.0006) progress=targetProgress;
        activeStage=currentStage();
        if(activeStage!==lastCaptionStage){
          captionPending=activeStage;
          lastCaptionStage=activeStage;
        }
        updateCaptionFade();
        ctx.clearRect(0,0,w,h);
        var g=ctx.createRadialGradient(w*.5,h*.5,10,w*.5,h*.5,Math.min(w,h)*.55);
        g.addColorStop(0,'rgba(27,58,92,.22)');
        g.addColorStop(.55,'rgba(1,4,10,.2)');
        g.addColorStop(1,'rgba(1,4,10,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
        ctx.save();
        ctx.globalAlpha=.075;
        ctx.strokeStyle='rgba(246,243,236,.28)';
        ctx.lineWidth=1;
        for(var rr=0;rr<3;rr++){
          ctx.beginPath();
          var ringRadius=Math.min(w,h)*(.18+rr*.09);ctx.arc(w*.5,h*.5,ringRadius,0,Math.PI*2);
          ctx.stroke();
        }
        ctx.restore();
  
        var cx=w/2,cy=h/2,scale=Math.min(w,h)*(perfLow?.235:.255);
        particles.forEach(function(p,i){
          var rv=sm(p.show,p.show+.36,progress);
          if(rv<=0) return;
          var wob=Math.sin(t+p.ph)*.025;
          var x=cx+Math.cos(p.a+t*.04)*scale*(p.rad+wob);
          var y=cy+Math.sin(p.a-t*.025)*scale*(p.rad+wob);
          ctx.globalAlpha=rv*(.22+.42*Math.sin(t*1.5+p.ph)*Math.sin(t*1.5+p.ph));
          ctx.fillStyle='rgba(143,178,214,.9)';
          ctx.beginPath(); ctx.arc(x,y,1.15,0,Math.PI*2); ctx.fill();
        });
        ctx.globalAlpha=1;
  
        var finalMap=progress>.92;
        spotlight(pt(node('hub')), [210,183,117], .14, .9);
        var hubPt=pt(node('hub'));
        stages.forEach(function(s,i){
          var wt=stageWeight(i);
          if(wt>.01) s.a.forEach(function(id){
            var an=node(id);
            if(an){
              spotlight(pt(an), an.c, .13+.06*wt, wt);
              focusBeam(hubPt,pt(an),an.c,wt*(.68+.12*Math.sin(t*2.4)*Math.sin(t*2.4)));
            }
          });
        });
        links.forEach(function(l){
          var a=sm(l[2],l[2]+.12,progress); if(a<=0) return;
          var na=node(l[0]), nb=node(l[1]);
          var strength=Math.min(nodePower(l[0]),nodePower(l[1]));
          var goldMix=softAppear(strength);
          curve(pt(na),pt(nb),a,goldMix>.08?[210,183,117]:[143,178,214],strength);
        });
        nodes.forEach(function(n){
          var a=sm(n.show,n.show+.24,progress); if(a<=0) return;
          var power=nodePower(n.id), active=power>.01, visible=a>.01 || finalMap, pulse=1+Math.sin(t*4)*.08*softAppear(power);
          var p=pt(n);
          ctx.save(); ctx.globalAlpha=a;
          var np=softAppear(power);
          ctx.fillStyle='rgba('+n.c.join(',')+','+(.055+.125*np)+')';
          ctx.beginPath(); ctx.arc(p.x,p.y,n.r*4.2*pulse,0,Math.PI*2); ctx.fill();
          ctx.strokeStyle='rgba('+n.c.join(',')+','+(.24+.64*np)+')';
          ctx.lineWidth=1+1.2*np;
          ctx.beginPath(); ctx.arc(p.x,p.y,n.r*1.9*pulse,0,Math.PI*2); ctx.stroke();
          ctx.fillStyle='rgba('+n.c.join(',')+','+(.44+.56*np)+')';
          ctx.beginPath(); ctx.arc(p.x,p.y,n.r*pulse,0,Math.PI*2); ctx.fill();
          if(n.id!=='hub' && visible){
            var lp=labelPoint(n,p);
            var labelStrength=Math.max(power*(.22+.78*a), finalMap?1:a*.62);
            drawLabel(n.label,lp.x,lp.y,n.c,labelStrength);
          }
          ctx.restore();
        });
      }
      function onScroll(){
        var rect=scroller.getBoundingClientRect(), total=scroller.offsetHeight-innerHeight;
        targetProgress=total>0?clamp(-rect.top/total,0,1):0;
      }
      function applyCaption(){
        if(activeStage>=0){capS.textContent=stages[activeStage].n;capT.textContent=stages[activeStage].t;cap.style.opacity=.62+.38*stageWeight(activeStage); note.style.opacity=0;}
        else{capS.textContent='';capT.textContent='';cap.style.opacity=.0; note.style.opacity=1;}
      }
      function updateCaptionFade(){
        if(captionPending!==null){
          captionFade += (0-captionFade)*.22;
          if(captionFade<.08){
            activeStage=captionPending;
            captionPending=null;
            applyCaption();
          }
        }else{
          captionFade += (1-captionFade)*.16;
        }
        if(activeStage>=0){
          cap.style.opacity=(.62+.38*stageWeight(activeStage))*captionFade;
          cap.style.transform='translateY('+(10*(1-captionFade))+'px)';
          note.style.opacity=0;
        }else{
          cap.style.opacity=0;
          cap.style.transform='translateY(10px)';
          note.style.opacity=1;
        }
      }
      if('IntersectionObserver' in window){
        var coverObserver=new IntersectionObserver(function(entries){coverActive=entries[0] ? entries[0].isIntersecting : true;},{rootMargin:'120px 0px 120px 0px'});
        coverObserver.observe(mount);
      }
      addEventListener('resize',resize,{passive:true});
      addEventListener('scroll',onScroll,{passive:true});
      resize(); onScroll(); draw();
}
