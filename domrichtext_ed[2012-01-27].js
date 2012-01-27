drt.ed = {
	etiquetar: function(etiq, rng, prop) { 	// get elements inside a desirable tag
		/* args= etiq: str o HTMLElement; 
		rng: integer=> range to set property, or null=> every range
			prop: bool, propagate event
				*/
		var etiq = (p_.es.HTMLElement(etiq))? etiq: ((p_.es.String(etiq))? p_.nodo(etiq): false);
		var dsd, hst, i, j, pa, paPrev = null, et = null, tag, ant = null, camb = false;
		if(drt.rangos.length > 0 && etiq){
			dsd = (rng !== null && drt.rangos[rng])? rng: 0;
			hst = (rng !== null && drt.rangos[rng])? rng: drt.rangos.length - 1;
			tag = etiq.tagName.toLowerCase();
			for(i = dsd; i <= hst; i++){
				paPrev = null; ant = null; prim = null; 
				for(j=0; j< drt.rangos[i].item.length; j++){
					anc = p_.ancestros(drt.rangos[i].item[j]).reverse();
					k = anc.buscar(function(v,t){
						rtrn = (drt.es.DefinidorDe(v, t))? true:false; return rtrn;}, tag, true);
									
					pa = anc[1];
					if(k == -1){
						if(pa != paPrev){
							et = (!et)?etiq:et.cloneNode();
							ant = pa.insertBefore(et, drt.rangos[i].item[j])
						}
						et.appendChild(drt.rangos[i].item[j]);
						camb = true;
					}
					paPrev = pa;
				}
			}
		}
		if(paPrev && camb && !prop){
			d = drt.es.enEditable(paPrev);
			drt.evt.lanzar('cambiar',false, d.id, 'etiquetar');
			drt.des.regAccion('etiquetar', d, etiq);
		}
		return paPrev;
	},
	desetiquetar: function(tag, rng, prop){		// Remove the tag of a selection
		/* args= tag: str a remover; 
		rng: integer=> range to set property, or null=> every range
			prop: bool, propagate event
				*/
		var dsd, hst, i, j, k, anc=[], paPrev = null, ntg, prim, ant, camb = false;
		if(drt.rangos.length > 0){
							// set the ranges to work on
			dsd = (rng !== null && drt.rangos[rng])? rng: 0;
			hst = (rng !== null && drt.rangos[rng])? rng: drt.rangos.length - 1;

			for(i = dsd; i <= hst; i++){
				ant = null; prim = null; paPrev = null;
				for(j=0; j<= drt.rangos[i].item.length; j++, k = -1){
					if(j< drt.rangos[i].item.length){ // check if the character is inside a tag that defines the property
						/* as es.DefinidorDe is not getting the property by className
						this process is still not enough
							Moreover, it does not check if there are redundant declarations, so user must "desetiquetar"
							more than one time if there are multiple declarations of the same property
						*/
						anc = p_.ancestros(drt.rangos[i].item[j]).reverse();
						k = anc.buscar(function(v,t){
							rtrn = (drt.es.DefinidorDe(v, t))? true:false; return rtrn;}, tag, true);
					}
					pa = (k > -1)? anc[k]: null;
					if(pa != paPrev){ 
						// if the current ancestor is different to the previous, it means other element to remove
						if(prim && paPrev){ 
							// if range already started
							if(drt.obt.ultimoHijo(paPrev) != drt.rangos[i].item[j-1]){
								ant = drt.ed.dividirElemento(paPrev, drt.rangos[i].item[j-1], true, true);
							}
							drt.ed.saltearPadre(paPrev, true);
							drt.mod.limpiarVacios(paPrev.parentNode, true);
							prim = null;
						}
						if(j< drt.rangos[i].item.length && pa){
							if(drt.obt.primerHijo(pa) != drt.rangos[i].item[j]){						
								ntg = drt.ed.dividirElemento(pa, drt.rangos[i].item[j], true, true);
								drt.mod.limpiarVacios(pa.parentNode, true);
								pa = ntg;
								camb = true
							//p_.nodo('div','tst1',false,'pa = '+pa.textContent+'; paPrev:'+paPrev.textContent);
							}
							prim = drt.rangos[i].item[j];
						}
					}
					paPrev = pa;
					
				}
			}
			if(!prop && camb){
				d = drt.es.enEditable(paPrev);
				drt.evt.lanzar('cambiar',false, d.id, 'desetiquetar');
				drt.des.regAccion('desetiquetar', d, etiq);
			}
		}
		return paPrev;
	
	},
	insertar: function(elm, dnd, cons, delante, prop){ // it inserts a tag, replacing or preserving the selection
		/* elm: Nodo para meter
		 dnd: Nodo de referencia
		 cons: bool, conservar selección
		 prop: true→ indica que es una propagación
		 delante: bool, para insertAfter
		*/
		elm = (p_.es.HTMLElement(elm))? elm: ((p_.es.String(elm))? p_.nodo(elm) : false);
		var areas = [], d;
		if(elm){
			var pa, i, rtrn = false;
			if(p_.es.Number(dnd)){
				if(drt.rangos[dnd]){
					pa = drt.rangos[dnd].item[0].parentNode;
					rtrn = pa.insertBefore( elm, drt.rangos[dnd].item[0]);
					if(cons){ drt.ops.borreSel({rng:dnd})};
					areas.push(drt.es.enEditable(pa));					
				}
			}else if(dnd === true){
				if(drt.rangos.length > 0){
					rtrn = [];
					for(i=0; i < drt.rangos.length; i++){
						pa = drt.rangos[i].item[0].parentNode;
						rtrn.push( pa.insertBefore( elm, drt.rangos[i].item[0]) );
						if(cons){ drt.ops.borreSel({rng:i})};
						d = drt.es.enEditable(pa);
						if(!areas.length || areas[areas.length - 1] != d){
							areas.push(d);					
						}
					}
				}
			}
			if(!rtrn){
				dnd = (p_.es.Node(dnd))? dnd : drt.caret.elm;
				rtrn = (delante)? p_.insertAfter(elm, dnd): dnd.parentNode.insertBefore(elm, dnd);
		//p_.nodo('span','tst1',false, '; delante:'+p_.tipo(rtrn));
				if(!cons && drt.rangos.length > 1){ drt.ops.borreTodoSel(true)};
				areas.push(drt.es.enEditable(dnd));
			}
			if(!prop){
				for(i=0; i < areas.length; i++){
					drt.evt.lanzar('cambiar',false, areas[i].id, 'insertar');
					drt.des.regAccion('insertar', areas[i], elm);
				}
			}
		}
		return rtrn;
	},
	cambiarBloque: function(nuevo, elm, prop){		// it changes the nature of the block
		/*	elm: HTMLElement o false para elemento de caret
			nuevo: str o HTMLElement del nuevo bloque;
			tipo: para las listas 'ol' o 'ul'
		*/
		elm = (elm && p_.es.HTMLElement(elm))? elm : drt.caret.elm;
		var blq, nv, t1, t2, pa = false;
		blq = drt.es.enBloque(elm);
		nv = (p_.es.HTMLElement(nuevo))? nuevo : p_.nodo(nuevo);
		
		// condiciones de tipos de cambios
		t1 = blq.tagName.toLowerCase();
		t2 = nv.tagName.toLowerCase();
		if( t1 == 'li' ){					//	LI may be the block, but its parent rules
			if( t2 =='ol' || t2=='ul'){
				blq = blq.parentNode;
				nv = blq.parentNode.insertBefore(nv, blq);
			}else{
				if(blq == blq.parentNode.firstChild){
					nv = blq.parentNode.insertBefore(nv, blq.parentNode);			
				}else if(blq == blq.parentNode.lastChild){
					nv = p_.insertAfter(nv, blq.parentNode);
				}else{
					pa = drt.ed.dividirElemento(blq.parentNode, blq, false, true);
					nv = p_.insertAfter(nv, pa);
				}
			}
		}else if(t2 =='ol' || t2=='ul'){
			pa = blq.parentNode.insertBefore(nv, blq);
			nv = p_.nodo('li', pa);
		}else{
			nv = blq.parentNode.insertBefore(nv, blq);
		}

		// traslado de contenido
		while(blq.firstChild){
			nv.appendChild(blq.firstChild);
		}
		blq.parentNode.removeChild(blq);
		drt.mov.ponCaret(drt.caret.elm, drt.caret.prev, false, true)
		if(!prop){
			d = drt.es.enEditable(nv);
			drt.evt.lanzar('cambiar',false, d.id, 'cambiarBloque');
			drt.des.regAccion('cambiarBloque', d, nv);
		}
		return nv;
	},
	asignarClaseTodos: function(clase, prop){		// asigns a clase className to every canvas
		var rtrn = false;
		for(var a in drt.areas){
			rtrn = (!drt.ed.asignarClase(drt.areas[a]))? false: rtrn;
		}
		return rtrn;
	},
	asignarClase: function(clase, d, prop){ // it asign clase className to every selected in a canvas
		/*	clase: str clase a designar
		*/
		// buscar los mayores elementos registrados completos y p_.ponClase
		var h, i, j, n, rtrn = false, t = [], ch;
		h = drt.sel.mayoresMarcados(d);
		//p_.nodo('div','tst1',false,h.toSource());
		for(i = 0; i < h.elm.length; i++){
			p_.ponClase(h.elm[i], clase);
		}
		for(i = 0; i < h.frn.length; i++, t = [], ch = false){
			n = p_.nodo('span', h.frn[i].dsd.parentNode, {className:clase}, false, h.frn[i].dsd);
			while(ch != h.frn[i].hst){
				ch = (!ch)? h.frn[i].dsd :ch.nextSibling;
				t.push(ch);
			}
			for(j=0; j<t.length; j++){
				n.appendChild(t[j]);			
			}
			//p_.nodo('div', 'tst1', false, 'hst:'+p_.tipo(j));				
		}
		
	},
	dividirElemento: function(elm, punto, desp, prop){		// split an HTMLElement, even if the reference node is at start or end
		/* elm: HTMLElement a dividir
			punto: HTMLElement de referencia donde dividir
			desp: bool, si se divide después del punto
		*/
		var marca, marca2, clon, t1, i, t2, mrk = false, act = false, pa, listo;
		marca = p_.nodo('span',false,{title:'drt_marca', className:drt.clatexto},'#');
		if(desp){
			marca = p_.insertAfter(marca, punto);
		}else{
			marca = punto.parentNode.insertBefore(marca, punto);
		}
		clon = elm.cloneNode(true);
		p_.insertAfter(clon, elm);
		t1 = elm.getElementsByTagName('*');
		t2 = clon.getElementsByTagName('*');
		for(i = t2.length - 1; i>=0; i--){		// walk from end becaus it deletes contents
			if(drt.es.Marcable(t2[i])){
				if(t2[i].title == 'drt_marca'){ 
					act = true;
					if(t1[i-1].firstChild.nodeValue == " "){ t1[i-1].firstChild.nodeValue = "\u00A0";}
					t1[i].parentNode.removeChild(t1[i]);
					if(t2[i+1].firstChild.nodeValue == " "){ t2[i+1].parentNode.removeChild(t2[i+1]);}
					t2[i].parentNode.removeChild(t2[i]);
				}else{
					if(act){
						t2[i].parentNode.removeChild(t2[i]);
					}else{
						t2[i].parentNode.replaceChild(t1[i],t2[i]);
					}
				}
			}
		}
		if(!prop){
			d = drt.es.enEditable(elm);
			drt.evt.lanzar('cambiar',false, d.id, 'dividirElemento');
			drt.des.regAccion('dividirElemento',d, elm);
		}
		return clon;
	},
	unirElementos: function(elm1, elm2, prop){ // join two elements. Put the contents of the second element into the first
												// it does not work for TD elements
		/* elm1: HTMLElement primero
			elm2: HTMLElement segundo
		*/
		var rtrn = false, tag1, tag2, i;
		prop = prop || false;
		if(p_.es.HTMLElement(elm1) && p_.es.HTMLElement(elm2)){
			tag1 = elm1.tagName.toUpperCase();
			tag2 = elm2.tagName.toUpperCase();
			if(tag1 != "TD" && tag1 != "TH" && tag2 != "TD" && tag2 != "TH" ){
				if(elm2.hasChildNodes()){
					while(elm2.firstChild){
						elm1.appendChild( elm2.firstChild);
					}
				}
				elm2.parentNode.removeChild(elm2);
				rtrn = true;
			}
		}
		if(!prop){
			d = drt.es.enEditable(elm1);
			drt.evt.lanzar('cambiar',false, d.id, 'unirElementos');
			drt.des.regAccion('unirElementos', d, elm1);
		}
		return rtrn;
	},
	removerHijos: function(elm, dsd, hst, prop){		// removes certain children from elm HTMLElement
		/* elm: HTMLElement a limpiar
			dsd: str o HTMLElement hijo inicial incluido
			hst: str o HTMLElement hijo final incluido
		*/
		if(p_.es.HTMLElement(elm)){
			var t, act, i = 0, pd, rtrn=false, listo= false;
			dsd = (dsd)?p_.sel(dsd):null;
			hst = (hst)?p_.sel(hst):null;
			act = (!dsd)?true:false;
			t = elm.getElementsByTagName('*');
			while(t[i] && !listo){
				if(drt.es.Marcable(t[i])){
					if(t[i] == dsd){ act = true ;}
					if(t[i] == hst){ listo = true;}
					if(act){
						pd = t[i].parentNode
						pd.removeChild(t[i]);
						i--;
						rtrn = true;
					}
				}
				i++;
			}
			if(!prop){
				d = drt.es.enEditable(elm);
				drt.evt.lanzar('cambiar',false, d.id, 'removerHijos');
				drt.des.regAccion('removerHijos', d, elm);
			}
			return rtrn;
		}
	},
	saltearPadre: function(elm, prop){		// put all childNodes before the elm HTMLElement and remove it
		/* elm: HTMLElement a sortear
		*/
		if(p_.es.HTMLElement(elm)){
			var abu = elm.parentNode, rtrn = false;
			var tag = elm.tagName
			if(abu && elm.hasChildNodes()){
				while(elm.firstChild){
					rtrn = abu.insertBefore(elm.firstChild, elm);
				}
			}
			abu.removeChild(elm);
			if(!prop){
				d = drt.es.enEditable(abu);
				drt.evt.lanzar('cambiar',false, d.id, 'saltearPadre');
				drt.des.regAccion('saltearPadre', d, tag);
			}
			return rtrn;
		}
	},
	hazLetra:function(padre, letra, ref, delante, prop){	// make the span with a single letter
		/*padre: HTMLElement donde poner la letra
		  letra: str
		  ref: HTMLElement de referencia para poner la letra
		  delante: bool, si va después de la referencia
		*/
		delante = delante || false;
		ref = ref || false;
		var l;
		l = p_.nodo('span', padre, {className:drt.clatexto}, letra);
		l = drt.ed.insertar(l, ref, false, delante, true);
		if(!prop){
			d = drt.es.enEditable(padre);
			drt.evt.lanzar('cambiar',false, d.id, 'hazLetra');
			drt.des.regAccion('hazLetra', d, l);
		}
		
		return l;
	},
	hazTemporal: function(padre, ref){ // it is for empty blocks, it allows to put the caret without content
		/*padre: HTMLElement donde poner la letra
		  ref: HTMLElement de referencia para poner la letra
		*/
		var l = p_.nodo('span', padre, {className:drt.clatexto+' drt_elmtemporal'},"\u00A0", ref, true);
		return l;
	},
	espacio: function(prop){		// it is for avoiding non displayed spans
		var ant = (drt.caret.prev)?drt.caret.elm.previousSibling : drt.caret.elm;
		var txt = (ant && drt.es.Letra(ant) && ant.firstChild.nodeValue.match(/( |\u00A0)$/gi))? "\u00A0":" ";
		var delante = (drt.caret.prev)?false:true
		rtrn = drt.ed.hazLetra(drt.caret.elm.parentNode, txt, drt.caret.elm, delante);
		return rtrn;
	},
	nuevaLinea: function(ctrl,shft,alt, prop){		// new line in different modes
		var nl = false, bl, elm, nb, ul;
		elm = drt.caret.elm;
		if(elm){
			bl = drt.es.enBloque(elm);
			if(shft){
				var nl = p_.nodo('br', elm.parentNode, {className:drt.clatexto},false,drt.caret.elm);
				drt.mov.ponCaret(nl);
			}else if(ctrl && bl.tagName.toLowerCase() == 'li'){
				ul = bl.parentNode;
				nl = drt.mov.ponCaret(ul.parent, true, ul);
			}else{
				if(drt.obt.ultimoHijo(bl) == elm && !drt.caret.prev){
					nb = p_.nodo(bl.tagName, bl.parentNode, {className: bl.className}, false, bl, true);
					nl = drt.mov.ponCaret(nb, true);								
				}else{
					nb = drt.ed.dividirElemento(bl, elm, true);
					drt.mod.limpiarVacios(bl);					
					drt.mod.limpiarVacios(nb);
					nl = drt.mov.ponCaret(drt.obt.primerHijo(nb), true);					
				}
			}
			if(!prop){
				d = drt.es.enEditable(nl);
				drt.evt.lanzar('cambiar',false, d.id, 'nuevaLinea');
				drt.des.regAccion('nuevaLinea', d, nl);
			}
		}
		return nl;
		
	},
	borreSig:function(prop){		// Delete the next markable element
		var o, tag, pa;
		if(drt.caret.prev){
			o = drt.obt.proximo(-1);
			tag = (drt.es.Letra(o))? o.firstChild.nodeValue : o.tagName;
			pa = drt.caret.elm.parentNode
			pa.removeChild(drt.caret.elm);
			drt.mov.ponCaret(o);
		}else{
			o = drt.obt.proximo(1);
			tag = (drt.es.Letra(o))? o.firstChild.nodeValue : o.tagName;
			pa = o.parentNode;
			pa.removeChild(o);
		}
		if(!prop){
			d = drt.es.enEditable(pa);
			drt.evt.lanzar('cambiar',false, d.id, 'borreSig');
			drt.des.regAccion('borreSig', d, tag);
		}
	},
	retro:function(prop){		// Deletes selection or the previous markable element, runned by backspace key
		prop = prop || false;
		if(drt.rangos.length){
			drt.ops.borreTodoSel();
		}else{
			var pr = drt.obt.proximo(-1), inf1, inf2;
			if(drt.obt.extremo(-1, 'bloque') == drt.caret.elm && drt.caret.prev && pr){
				inf1 = drt.es.info(drt.caret.elm, true);
				inf2 = drt.es.info(pr, true);
				if(inf1.td || inf2.td || !drt.ed.unirElementos(inf1.bloque, inf2.bloque, false)){
					rtrn = drt.mov.izquierda();
				}else{
					rtrn = true;
				};
			}else{
				drt.mov.izquierda();
				rtrn = drt.ed.borreSig(false);
			}
		}
	},
	del:function(prop){	// Deletes selection or the next markable element, runned by del key
		var rtrn = false;
		if(drt.rangos.length){
			rtrn = drt.ops.borreTodoSel();
			drt.sel.deregistrarTodo();
		}else{
			var pr = drt.obt.proximo(1), bl1, bl2;
			if(drt.obt.extremo(1, 'bloque') == drt.caret.elm && pr){
				bl1 = drt.es.enBloque();
				bl2 = drt.es.enBloque(pr);
				if(!drt.ed.unirElementos(bl1, bl2, false)){			// if it cannot merge two blocks go to the second block.
					rtrn = drt.mov.derecha();
				}else{
					rtrn = true;
				};
			}else{
				rtrn = drt.ed.borreSig(false);
			}
		}
		return rtrn;
	},

}

