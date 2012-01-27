drt.sel = {		// selection (mark and register) methods
	marcar:function(dsd,hst){		// mark all the elements, it changes class clatexto by claselec
									// note that it is not using es and obt methods, this way is faster
		var t = drt.abuelo.getElementsByTagName('*');
		var i,rtrn=false,s;
		var d = drt.aux.posEnLista(t,dsd);
		var h = drt.aux.posEnLista(t,hst);
		if(d>h){s=d;d=h;h=s;}
		for(i=d;i <= h; i++){
			if(p_.cambiaClase(t[i], drt.clatexto, drt.claselec)){ rtrn=true;};
		}		
		return rtrn;
	},
	selElemento: function(elm,des){ // mark/unmark all marcable elements inside the elm HTMLElement
		// des==true: unmark
		var rtrn = false, t, i, cn, cv;
		cn = (des)? drt.clatexto : drt.claselec;
		cv = (des)? drt.claselec : drt.clatexto;
		if(p_.es.HTMLElement(elm)){
			t = elm.getElementsByTagName('*');
			for(i=0; i < t.length; i++){
				if(drt.es.Marcable(t[i])){
					p_.ponClase(t[i],cn);
					p_.quitaClase(t[i],cv);
				}
			}
		}
		return rtrn;
	},
	selPalabra:function(elm,des){ // mark/unmark until limits of characters relative to elm
		// if elm is an space, the method will select both contiguous words
		// (des=true): desmarca en vez de marcar
		var dsd,sig,hst,m,rtrn = false, bl,tags;
		bl = drt.es.enBloque(elm);
		tags = bl.getElementsByTagName('*');
		if(drt.es.Letra(elm) || elm.tagName == "BR"){
			m = (drt.es.Letra(elm) && elm.firstChild.nodeValue.match(/\S/gi))?true:false;
			dsd = (elm.tagName == "BR")?drt.proximo(-1,elm,tags):elm;			 
			hst = (elm.tagName == "BR")?drt.proximo(1,elm,tags):elm;	 
			while(dsd){
				sig = drt.obt.proximo(-1,dsd,tags);
				if(!m && sig && sig.firstChild.nodeValue.match(/\S/gi)){m=true;};
				if(!sig || !sig.firstChild || m && 
				(sig && sig.firstChild && (sig.firstChild.nodeValue.match(/\s/gi))) 
				){
					break;
				}else{
					dsd = sig;
				}
			}
			m = false;
			while(hst){
				sig = drt.obt.proximo(1,hst,tags);
				if(!m && sig && sig.firstChild.nodeValue.match(/\S/gi)){m=true;};
				if(!sig || !sig.firstChild || m && 
				(sig && sig.firstChild && (sig.firstChild.nodeValue.match(/\s/gi))) 
				){
					break;
				}else{
					hst = sig;
				}
			}
			rtrn = (des)?drt.sel.desmarcar(dsd,hst):drt.sel.marcar(dsd,hst);
		}else if(elm.tagName == "IMG" || elm.tagName == "IMG" ){
			if(p_.cambiaClase(elm, drt.clatexto, drt.claselec)){ rtrn = true; };
		}
		return rtrn;
	},
	desmarcar:function(dsd,hst){
		var t = drt.abuelo.getElementsByTagName('*');
		var i,rtrn=false;
		var d = drt.aux.posEnLista(t,dsd);
		var h = drt.aux.posEnLista(t,hst);
		for(i=d;i <= h; i++){
			if(p_.cambiaClase(t[i], drt.claselec, drt.clatexto)){ rtrn=true;};
		}		
		return rtrn;
	},
	desmarcarTodo:function(a){
		//var m = p_.sel(drt.claselec,"className",drt.abuelo);
		a = (a)?a.elm:drt.abuelo;
		var ets = ["SPAN","IMG","BR"];
		var n,i,m;
		for(n=0; n < ets.length; n++){
			m = a.getElementsByTagName(ets[n]);
			for(i=0;i < m.length;i++){
			//p_.nodo('span','tst1',false,' '+m[i].firstChild.nodeValue)
				p_.cambiaClase(m[i], drt.claselec, drt.clatexto);
			}
		}
	},
	remarcar:function(){
		var i,j;
		for(i=0;i < drt.rangos.length;i++){
			for(j=0; j < drt.rangos[i].item.length; j++){
				p_.cambiaClase(drt.rangos[i].item[j], drt.clatexto, drt.claselec);
			}
		}
	},
	registrarTodo:function(){
		var t = drt.abuelo.getElementsByTagName('*'); //p_.sel(drt.claselec,'className',);
		var i,pr,j = 0,cn=false;
		drt.sel.deregistrarTodo();
		for(i=0;i < t.length; i++){
			if(t[i].className.match(drt.reClaselec)){
				if(!cn){
					j = drt.rangos.length
					drt.rangos[j] = {item:[]};
					cn = true;
				}
				drt.rangos[j].item.push(t[i]);
			}else if(t[i].className.match(drt.reClatexto)){
			/* ---------- Here it should be inserted a way to create a native range in order to 
				allow user to copy what is selected
			*/
				cn = false;
			}
		}
	},
	deregistrarTodo:function(){
		drt.rangos = [];
		drt.selecIniciada = false;
	},
	deregistrar:function(coso){
		if(p_.es.HTMLElement(coso)){
			var dnd = drt.sel.registrado(coso);
			if(dnd){coso = dnd.rng;};
		}
		if(p_.es.Number(coso)){
			drt.rangos.splice(coso,1);
		}
	},
	registrarSel:function(elm){ // elm: elemento inmerso en la selección marcada
		var t,i, rtrn=false, dsd,hst,j;
		if(elm.className.match(drt.reClaselec)){
			t = drt.abuelo.getElementsByTagName('*');
			i = drt.aux.posEnLista(t,elm);
			if(i > -1){
				dsd = (i==0)?0:-1;
				hst = (i== t.length-1)?i== t.length-1:-1;
				j = i;
				while(j > 0){
					if(t[j-1].className.match(drt.reClaselec) || !t[j-1].className.match(drt.reClatexto)){
						if(t[j-1].className.match(drt.reClaselec)){dsd = j};
						j--;
					}else{
						break;
					}
				}
				j = i;
				while(j < t.length-1){
					if(t[j+1].className.match(drt.reClaselec) || !t[j+1].className.match(drt.reClatexto)){
						if(t[j+1].className.match(drt.reClaselec)){hst = j};
						j++;
					}else{
						break;
					}
				}
				n = drt.rangos.length;
				for(j=dsd;j<=hst;j++){
					drt.rangos[n].item.push(t[j]);
								
				}
				if(dsd<hst){ rtrn = true;};
			}
		}
		return rtrn;
	},
	registrado:function(elm){
		var i,j,rtrn=false;
		for(i=0; i < drt.rangos.length;i++){
			j = drt.rangos[i].item.donde(elm);
			if(j > -1){
				rtrn = {rng:i,pos:j};
				break;
			}
		}
		return rtrn;
	},
	elmEstaMarcado: function(elm){
		var rtrn = false, t, i;
		if(p_.es.HTMLElement(elm)){
			t = elm.getElementsByTagName('*');
			rtrn = true;
			for(i = 0; i < t.length && rtrn; i++){
				if(drt.es.Marcable(t[i]) && !t[i].className.match(drt.reClaselec)){
					rtrn = false;
					break;
				}
			}
		}
		return rtrn;
	},
	elmRegistrados: function(){
		var rtrn, i, j, tg = [], ancs = [], elm, ts, tod, reg = [];
		// lista de padres únicos
		for(i=0; i < drt.rangos.length; i++){
			for(j=0; j < drt.rangos[i].item.length; j++){
				if(tg.donde(drt.rangos[i].item[j].parentNode) == -1){ tg.push(drt.rangos[i].item[j].parentNode); }
			}
		}
		// hacer lista con padres sólo de completos
		for(i = 0; i < tg.length; i++, j = 1){
			if(drt.sel.elmEstaMarcado(tg[i])){
				reg.push(tg[i]);
				ancs = p_.ancestros(tg[i]).reverse();
				while(ancs[j] && !drt.bloques[ancs[j].tagName]){
					if(drt.sel.elmEstaMarcado(ancs[j]) && reg.donde(ancs[j] == -1)){
						reg.push(tg[i]);
					}
					j++;
				}
				
			};
		}
		rtrn = (reg.length > 0)? reg: false;
		return rtrn;
	},
	arbolMarcado: function(d){
		var este, i, mrc, nmrc, hijos = [];
		este = {elm: d, elmM:[], elmPM: [], elmNM: [], hijosM:[], hijosNM:[]};
		if(d.hasChildNodes()){
	//	p_.nodo('div', 'tst1', false, 'haschild')
			for(i=0; i < d.childNodes.length; i++){
				if(drt.es.Marcable(d.childNodes[i])){
					if(d.childNodes[i].className.match(drt.reClaselec)){
						este.hijosM.push(d.childNodes[i]);
					}else{
						este.hijosNM.push(d.childNodes[i]);
					}
				}else if(p_.es.HTMLElement(d.childNodes[i])){
					h = drt.arbolMarcado(d.childNodes[i]);
					if(h.hijosNM.length == 0 && h.elmNM.length == 0 && h.elmPM.length == 0){
						este.elmM.push(h);
					}else if(h.hijosM.length == 0 && h.elmM.length == 0 && h.elmPM.length == 0){
						este.elmNM.push(h);
					}else{
						este.elmPM.push(h);
					}
				}
			}
		}
		return este;
	},
	
	mayoresMarcados: function(arb){
		/*  arb: HTMLElement u objeto a caminar
			sh: bool, true: evita definir las franjas marcadas en el elemento */
		var arb, rtrn = {elm:[], frn:[]}, i, e, prim;
		arb = (p_.es.HTMLElement(arb))? drt.sel.arbolMarcado(arb): arb;
		if(arb.hijosNM.length == 0 && arb.elmNM.length == 0 && arb.elmPM.length == 0){
			rtrn.elm.push(arb.elm);
		}else{
			if(arb.elmM.length > 0){
				for(i = 0; i < arb.elmM.length; i++){
					rtrn.elm.push(arb.elmM[i].elm);
				}
			}
			if(arb.hijosM.length > 0){
				prim = arb.hijosM[0];
				for(i=1; i < arb.hijosM.length; i++){
					if(arb.hijosM[i].previousSibling != arb.hijosM[i - 1]){
						rtrn.frn.push({dsd:prim, hst:arb.hijosM[i - 1]});
						prim = arb.hijosM[i];
					}
				}
				rtrn.frn.push({dsd:prim, hst:arb.hijosM[arb.hijosM.length - 1]});
			}
			if(arb.elmPM.length > 0){
				for(i = 0; i < arb.elmPM.length; i++){
					e = drt.sel.mayoresMarcados(arb.elmPM[i]);
					rtrn.elm = (e.elm.length > 0)? rtrn.elm.concat(e.elm): rtrn.elm;
					rtrn.frn = (e.frn.length > 0)? rtrn.frn.concat(e.frn): rtrn.frn;
				}
			}
		}
		return rtrn;
	},

}
