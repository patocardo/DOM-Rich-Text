drt.es = {	// Detecting methods
	enEditable: function(nodo){		// return the canvas' div if "nodo" is in it, otherwise return false
		nodo = nodo || drt.caret.elm;
		var ac,rtrn=false;		
		if(p_.es.Node(nodo)){
			ac = nodo;
			while(!(ac.tagName && ac.tagName == 'BODY')){
				if(drt.es.Area(ac)){
					rtrn = ac;
					break;
				}else{
					ac = ac.parentNode;
				}
			}
		}
		return rtrn;
	},
	enBloque: function(nodo){
		nodo = nodo || drt.caret.elm;
		var rtrn=false;		
		if(p_.es.Node(nodo)){
			rtrn = (p_.es.HTMLElement(nodo))? nodo: ((nodo.parentNode)? nodo.parentNode:false);
			while(rtrn && !drt.bloques[rtrn.tagName]){rtrn = rtrn.parentNode;}
		}
		return rtrn;
	},
	Area: function(elm){		// return true if the HTMLElement in the argument is a canvas' div
		//return (elm.className.match(/\bareaVirtual\b/gi))
		return (elm.id && drt.areas[elm.id])?true:false;
	},
	Letra:function(elm){		// return true if the HTMLElement in the argument represents a single character
		var rtrn = (elm.tagName && elm.tagName == "SPAN" && elm.className.match(drt.reClases))?true:false;
		return rtrn;
	},
	Temporal:function(elm){	// return true if the HTMLElement in the argument represents a temporal &nbsp;
		return (elm.className.match(/\bdrt_elmtemporal\b/gi))?true:false;
	},
	Imborrable: function(elm){	// return true if the HTMLElement in the argument cannot be deleted
		return (elm.className.match(/\bdrt_imborrable\b/gi))?true:false;
	},
	Marcable: function(elm, nobr){	// return true if the HTMLElement in the argument is a markable element
		var tg = {"IMG":true,"INPUT":true,"HR":true};
		if(!nobr){ tg["BR"] = true;};
		var rtrn = (drt.es.Letra(elm) || (elm.tagName && tg[elm.tagName]))?true:false;
		return rtrn;
	},
	Especial: function(elm, fn){	// return true if the HTMLElement has special behavior in drt.evt[fn] function
		var rtrn = -1, i;
		for(i = 0; i < drt.especiales[fn].length && rtrn == -1; i++){
			if(drt.especiales[fn][i].verif(elm)){ rtrn = i;}
		}
		return rtrn;
	},
	Espacio: function(elm){	// return if the HTMLElement elm represents a single space character
		var rtrn = false, m;
		if(elm.firstChild){
			m = elm.firstChild.nodeValue.match(/\s/gi); 	// I don't use .test because it doesn't work properly
			rtrn = (!m || !m.length)? false: true;
		}
		return rtrn;
	},
	EnClases: function(elm, obEst){		// THIS FUNCTION IS STILL NOT OPERABLE
		var rtrn = false, i, j, cs, sh, slct;
		if(elm.className){
			cs = elm.className.match(/(\w+)/gi);
			sh = document.styleSheets;
			for(i=0; i<sh.length; i++){
				rules = (sh[i].cssRules)?sh[i].cssRules:((sh[i].rules)?sh[i].rules:null);
				if (rules) {
					for(j=0; j<rules.length; j++){
						slct = rules[j].selectorText
						txt += '<br>'+j+', '+rules[j].selectorText+': '+rules[j].style.backgroundColor;
						//txt += '; '+rules[j].selectorText
					}
				}
			}

		}
		return rtrn;
	},
	DefinidorDe: function(elm, et){		// tell if the HTMLElement elm, is definig a character property
		var rtrn = false, est;
		if(p_.es.HTMLElement(elm)){
			if(drt.equivalentes[et.toLowerCase()]){
				est = drt.equivalentes[et].est;
				if(drt.equivalentes[et].etiq && drt.equivalentes[et].etiq.donde(elm.tagName.toLowerCase()) > -1){
					rtrn = true;
				}else if(elm.style && elm.style[est.dec] && est.val.donde(elm.style[est.dec]) > -1){
					rtrn = true;
				}
				/* falta terminar esta función
				else if(drt.es.EnClases(elm, drt.equivalentes[et].est)){
			//p_.nodo('div','tst1',false,'llega a esDefinidorDe '+et);
					rtrn = true;
				}*/
			}else{
				rtrn = (elm.tagName.toLowerCase() == et.toLowerCase())?true:false;
			}
		}
		return rtrn;
	},
	OperadorExterno: function(elm){		// tell if the HTMLElement elm is or is in a element that can operate over canvas
		var rtrn = false, anc;
		if(p_.es.HTMLElement(elm)){
			anc = p_.ancestros(elm).reverse();
			for(var i=0; i < anc.length && !rtrn; i++){
				if(anc[i].tagName && (
					anc[i].tagName.toUpperCase() == "A" || 
					anc[i].tagName.toUpperCase() == "BUTTON" || 					
					(anc[i].type && anc[i].type.toUpperCase() == "BUTTON" )|| 
					anc[i].id.match(/^drt_op/g))) { rtrn = true};
			}
		}
		return rtrn;
	},
	mismoBloque: function(elms){		// tell if the array of HTMLElements elms are inside the same block
		var rtrn = false, anc1, anc, bl, j, i = 0, k;
		if(p_.es.Array(elms)){
			anc1 = p_.ancestros(elms[0]).reverse();
			while(anc1[i] && !drt.bloques[anc1[i].tagName]){ i++; }
			bl = anc1[i];
			rtrn = true;
			for(j=1; j < elms.length && rtrn; j++, i = 0){
				anc = p_.ancestros(elms[j]);
				k = anc.donde(bl);
				rtrn = (k>-1)? true: false;
			}
		}
		return rtrn;
	},
	info:function(elm, nopos){
		// nopos: true → do not retrieve the position information (which is the slowest)
		elm = (elm && p_.es.HTMLElement(elm))?elm:drt.caret.elm;
		var l = 1, anc, d, y1, y2, h2, pr, d, h, i, j = false, t, pi, bl = false;
		var ln = 0, col = 0, tr = false, row = 0, td = false, cell = 0, tbl = false, ind = 0, dst= -1, ib = -1;
		var neg = false, cur = false, subr = false, tach = false, sobr = false,
			vers = false, supi = false, subi = false;
		d = drt.es.enEditable(elm);
		anc = p_.ancestros(elm).reverse();
		i = 0;
		while(anc[i] && anc != d){		// check if within ancestor are elements that define different properties
			if(!bl && drt.bloques[anc[i].tagName]){bl = anc[i]}
			if(!neg && drt.es.DefinidorDe(anc[i], 'strong')){ neg = true};
			if(!cur && drt.es.DefinidorDe(anc[i], 'em')){ cur = true};
			if(!subr && drt.es.DefinidorDe(anc[i], 'u')){ subr = true};
			if(!tach && drt.es.DefinidorDe(anc[i], 'del')){ tach = true};
			if(!sobr && drt.es.DefinidorDe(anc[i], 'ovlin')){ sobr = true};
			if(!vers && drt.es.DefinidorDe(anc[i], 'vers')){ vers = true};
			if(anc[i].tagName.toLowerCase() == "sup"){ supi = true};
			if(anc[i].tagName.toLowerCase() == "sub"){ subi = true};
			if(!td && anc[i].tagName.toLowerCase() == "td"){ td = anc[i]};
			if(!tr && anc[i].tagName.toLowerCase() == "tr"){ tr = anc[i]};
			if(!tbl && tr && anc[i].tagName.toLowerCase() == "table"){ tbl = anc[i]};
			i++;
		}

		if(!nopos){
			if(td && tbl){		// get position in table
				for(i=0; i < tbl.rows.length; i++){
					if(tbl.rows[i] == tr){
						for(h = 0; h < tbl.rows[i].cells.length; h++){
							if(tbl.rows[i].cells[h] == td){
								cell = h;
								break;
							}
						}
						row = i;
						break;
					}
				}
				
			};
			
			t = d.getElementsByTagName('*');	// get caracter positions
			y1 = elm.offsetTop;
			pi = elm.offsetParent;
			for(i = t.length - 1 ; i >=0 ; i--){
				if(j && drt.es.Marcable(t[i])){
					if(t[i].offsetParent == pi){
						y2 = t[i].offsetTop
						h2 = t[i].offsetHeight;
						if(y2 + h2 <= y1){
							ln++;
							y1 = y2;
						}
						if(!ln){ col++ };
					}
					if(dst == -1 && t[i].parentNode != anc[1]){dst = ind};
					if(ib == -1 && p_.ancestros(t[i]).donde(bl) == -1){ib = ind};
					ind ++;
					pr = t[i];
				}
				if(t[i] == elm){j = true;}
			}
			dst = (dst == -1)?ind:dst;
			ib = (ib == -1)?ind:ib;
		}

		return {linea: ln, columna: col, indice: dst, indiceBlq: ib, indiceArea: ind, 
			ancestros: anc, bloque: bl, tr: tr, fila:row, td: td, celda: cell, area: d,
			negrita: neg, cursiva: cur, subrayada: subr, tachada: tach, sobrelinea: sobr,
			versalita: vers, superindice:supi, subindice: subi};
	},

}
