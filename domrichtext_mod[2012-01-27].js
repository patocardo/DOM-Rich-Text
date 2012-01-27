drt.mod = {
	txt2span:function(tN, delante, prop){		// converts a textNode into SPAN tags
		delante = (typeof(delante) == 'undefined')?false:delante;
		var rtrn=[],i,txt,padre,l, m;
		if(tN.nodeType == 3 && tN.length){	
			//p_.nodo('span','tst1',false,"*"+tN.nodeValue);
			m = tN.nodeValue.match(/^[\n\t\r\f]+$/gi);
			if(!m || !m.length){
				padre = tN.parentNode;
				txt = tN.nodeValue
				txt = txt.replace(/[\n\t\r\f]/gi,""); // perhaps it could be configured to obtain other responses
				txt = txt.replace(/ +/gi, ' '); // change multiple spaces by one, as it is represented by browsers;
				txt = txt.split("");
				l = tN;
				for(i=txt.length-1;i>=0;i--){
					l = drt.ed.hazLetra(padre, txt[i],l,delante, prop)
					rtrn.push(l);
				//p_.nodo('span','tst2',false,'*'+txt[txt.length-i-1].charCodeAt(0))
				}
				padre.removeChild(tN);
			}
		}
		rtrn = (rtrn==[])?false:rtrn;
		return rtrn;
	},
	aTexto:function(d, prop){		// converts the DOM Tree into a XHTML string
		var rtrn = '', i, dv;
		if(p_.es.HTMLElement(d)){
			dv = d.cloneNode(true);
			dv = drt.mod.implotar(dv);
			if(p_.es.HTMLElement(dv) && d.hasChildNodes()){
				for(i = 0; i < dv.childNodes.length; i++){
					rtrn += p_.aXHTML(dv.childNodes[i]);
				}
			}
		}
		return rtrn;
	},
	explotar:function(d, prop){		// explode the XHTML content into manageable DOM Tree
		var c,l;
		if(d.hasChildNodes){
			for(c=0;c<d.childNodes.length;c++){
				l = d.childNodes[c]
			//p_.nodo('div','tst2',false, 'pasa algo:'+ l.nodeType);
				if(l.nodeType == 1){
					if(!drt.es.Letra(l)){
						drt.mod.explotar(l);
					}
				}else if(l.nodeType == 3){
					dev = drt.mod.txt2span(l, false, true);
					if(!dev) d.removeChild(l);
				}
			}
		}
	},
	implotar:function(d, prop){		// implode span letters into textNodes
		var c,txt,i,h;
		if(d.hasChildNodes){
			h = drt.obt.hijosMarcables(d);
			for(i= h.length - 1; i >=0; i--){
				if(drt.es.Letra(h[i])){
					padre = h[i].parentNode;
					txt = p_.nodo('text',padre,false,h[i].firstChild.nodeValue,h[i]);
					padre.removeChild(h[i]);
				}
			}
		}
		d.normalize();
		return d;
	},
	actualizarArea: function(id, prop){		// update data from canvas
		var hl;
		drt.areas[id].geom = p_.geomet(drt.areas[id].elm);
		drt.areas[id].lado = (p_.estiloDe(drt.areas[id].elm,'text-align') == 'right')?1:-1;
		hl = p_.estiloDe(drt.areas[id].elm,'line-height');
		drt.areas[id].hl = parseInt(hl);
		/* hay que convertir hl si no ex px;
		if(hl.match(/em/i)){
			p_.emApx(hl
		}
		*/
	},
	actualizarValor: function(eb, id, prop){
		if(drt.areas[id]){
			drt.areas[id].hidden.value = drt.mod.aTexto(drt.areas[id].elm);
		}
	},
	limpiarTodosVacios:function(prop){
		var rtrn = false;
		for(a in drt.areas){
			if(drt.mod.limpiarVacios(a.elm, prop)){
				rtrn = true;
			}
		}
		return rtrn;
	},
	limpiarVacios: function(elm, prop){
		var i,h,dv,n;
		if(p_.es.Node(elm) && elm.nodeType == 1 && elm.hasChildNodes()){
		//dv = p_.nodo('div', 'tst1', false, 'elm:'+elm.tagName);
			h = elm.childNodes;
			for(i= h.length -1; i >= 0; i--){
				if(h[i].nodeType == 3){
					h[i].nodeValue = h[i].nodeValue.replace(/[\f\n\r\u2028\u2029]/gi, "");
					if(!h[i].nodeValue || h[i].nodeValue == ""){
						elm.removeChild(h[i]);
					}				
				}else if(h[i].nodeType == 1 && h[i].tagName && !p_.cerrados[h[i].tagName] && !drt.es.Imborrable(h[i])){
					n = drt.mod.limpiarVacios(h[i]);
					//p_.nodo('span', 'tst1', false, '; hijos['+i+']:'+n.hasChildNodes);
					if(!n.hasChildNodes()){
						elm.removeChild(n);
					}
				} 
			};
		}
		if(!prop){
			d = drt.es.enEditable(elm);
			drt.evt.lanzar('cambiar',false, d.id, 'borreSig');
			drt.des.regAccion('borreSig', d, elm);
		}
		return elm;
	},
	sintetizar: function(elm, prop){
	},

}
