drt.obt = {
	extremo: function(lado, que, elm){ // get the first or last element of a canvas, block, line or caracter continuity
	
		// lado == -1: first; lado == 1:last
		lado = (lado)?lado : 1; 
		elm = (elm && p_.es.HTMLElement(elm))? elm : drt.caret.elm;
		que = que || 'bloque';
		var bl, h, o, anc, pa, rtrn = false, i = 0, ea = false, j = false, m;
		anc = p_.ancestros(elm).reverse();

		if(que == 'area'){
			pa = drt.es.enEditable(elm);
			ea = true
		}else if (que == 'bloque' || que == 'linea' || que == 'caracter'){
			while(anc[i] && !drt.bloques[anc[i].tagName]){ i++; }	// search within ancestors where is some block
			pa = anc[i];
			pr = elm;
		
			if(que == 'linea' || que == 'caracter'){
				t = pa.getElementsByTagName('*');				// create the nodelist to use in the searching
			}
			if(que == 'linea'){
				g = p_.geomet(elm, true);
				y1 = (lado == 1)? g.y + g.h: g.y;
				dsd = (lado == 1)? 0: t.length -1;
				hst = (lado == 1)? t.length -1 : 0;
		
				for(i = dsd ; i >=0 && i < t.length && !rtrn; i+= 1 * lado){
				// search within markable object the first wich the next/previous element is over/under
					if(j && drt.es.Marcable(t[i])){
						y2 = (lado == 1)? t[i].offsetTop : t[i].offsetTop + t[i].offsetHeight;
						if((lado == 1 && y2 >= y1) || (lado == -1 && y2 <= y1) || i == hst){
							rtrn = (i == hst)? t[i]: pr;
						}
						pr = t[i];
					}
					if(t[i] == elm){j = true;}
				}
			}else if(que == 'caracter'){
				while(pr){
					enW = (pr != elm && !drt.es.Espacio(pr))? true: false;
					sig = drt.obt.proximo(lado,pr,t);
					if(enW && (!sig || drt.es.Espacio(sig))){
						break;
					}else{
						pr = sig;
					}
				}
				rtrn = pr;
			}else{
				ea = true;
			}
		}
		if(ea){ 	// ea allows to search inside the element
			h = drt.obt.hijosMarcables(pa);
			i = (lado == 1)? h.length - 1: 0;
			if(drt.es.Marcable(h[i])){ rtrn = h[i]; }
		}
		return rtrn;
	},
	hijosMarcables: function(elm){
		var t, h = [], i;
		t = elm.getElementsByTagName('*');
		for(i=0; i < t.length; i++){
			if(drt.es.Marcable(t[i])){
				h.push(t[i]);
			}
		}
		return h;
	},
	primerHijo: function(elm){
		var t, h = false, i;
		t = elm.getElementsByTagName('*');
		for(i=0; i < t.length && !h; i++){
			if(drt.es.Marcable(t[i])){h = t[i]; }
		}
		return h;	
	},
	ultimoHijo: function(elm){
		var t, h = false, i;
		t = elm.getElementsByTagName('*');
		for(i= t.length -1; i >= 0 && !h; i--){
			if(drt.es.Marcable(t[i])){	h = t[i]; }
		}
		return h;
	},
	cercano: function(e,elm,d){
		if(!drt.es.Marcable(elm)){
			coo = p_.coords(e);
			caja = {izq: drt.areas[d.id].geom.ix, der: drt.areas[d.id].geom.ix + drt.areas[d.id].geom.iw};
			elm = drt.obt.proximoXY(coo.x, coo.y, drt.areas[d.id].lado, coo.y, caja);
		}
		return elm;
	},
	proximoXY: function(x,y,lado,y2,caja){ 	// search for the nearest markable element in the geometry
		/* y2 = greater vertical posicion to generate a scanning line
			lado = 0=> don't move, 1: right, -1: left;
			caja: limits of the searching
		*/
		var i = 0,rtrn = false, yt;
		lado = (!lado || lado < 1)?-1:1;
		caja = caja || false;
		y2 = y2 || y;
		var o = document.elementFromPoint(x,y);
		if(drt.es.Marcable(o)){
			rtrn = o;
		}else{
			if(y2 < y){	yt = y2; y2 = y; y = yt;}	
			for(i= y; i<= y2; i++){
				o = document.elementFromPoint(x,i);
				if(drt.es.Marcable(o)){
					rtrn = o;
					break;
				}
			} 		
		}
		if(!rtrn){
			x+=lado;
			if(!caja || (caja.izq <= x && x <= caja.der)){
				rtrn = drt.obt.proximoXY(x,y,lado,y2,caja);
			}
		}
		return rtrn;
	},
	proximo:function(lado,elm,tags,ctos,nobr){	// search the following markable element in the dom tree
		// nobr = true=> do not include <br>
		elm = elm || drt.caret.elm;
		nobr = nobr || false;
		tags = tags || drt.abuelo.getElementsByTagName('*');
		ctos = (p_.es.Number(ctos))?ctos:1;
		var i = 0, j=0, rtrn = false;
		lado = (!lado || lado < 1)?-1:1; // 1 = derecha
		while(tags[i] && tags[i]!=elm){
			i++;
		}
		i+=lado;
		for(j=ctos;j>0 && i >=0; j--){
			while(i >=0 && tags[i] && !drt.es.Marcable(tags[i], nobr)){
				i+=lado;
			}
		}
		rtrn = (i >=0 && tags[i])?tags[i]:false;
		return rtrn;
	},

}
