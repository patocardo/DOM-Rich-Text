drt.evt = {				// Event related methods
	focoInpt: function(e){		// check if whole canvas receive focus
		o = p_.objetivo(e);
		p_.nodo('div','tst1','focoInpt en:'+o)
		var ida = o.id.slice(2);
		if(drt.IDareaActual != ida){
			drt.evt.lanzar('prevenfocar', e, ida, 'focoInpt');
			drt.IDareaActual = ida;
			drt.evt.lanzar('enfocar', e, ida, 'focoInpt');
		}	
	},
	teclaArr: function(e){			// Key up
		var dnd = p_.objetivo(e), id, l, o, m, prev, val, tN;
		var id = dnd.id.slice(2);
		if(dnd.value){
			var cod = dnd.value.charCodeAt(0), rtrn = false;
			var ctrl = e.ctrlKey, shft = e.shiftKey, alt = e.altKey;
			if(drt.areas[id].teclaSolt['t'+cod] && p_.es.Array(drt.areas[id].teclaSolt['t'+cod])){
				for(i = 0; i < drt.areas[id].teclaSolt['t'+cod].length; i++){
					o = drt.areas[id].teclaSolt['t'+cod][i];
					l = drt[o.obj][o.met](ctrl,shft,alt);
				}
			}else{		// if it is not a special key, introduce the inserted text
				delante = (drt.caret.prev)?false:true;
				tN = p_.nodo('text', drt.caret.elm.parentNode, false, dnd.value, drt.caret.elm, delante);
				if(drt.es.Temporal(drt.caret.elm)){			// removes the temporal element when is not needed
					drt.caret.elm.parentNode.removeChild(drt.caret.elm);
				}
				txt = drt.mod.txt2span(tN,delante);
				l = txt[txt.length -1]
			}
			rtrn = true;
			drt.mov.ponCaret(l);
			dnd.value="";
		}else{
			// use this to check about errors
		}
		return rtrn;
	},
	teclaAb:function(e){			// Key Down, just for events
		var dnd = p_.objetivo(e), cod = e.keyCode, o, i, rtrn = false;
		var ctrl = e.ctrlKey, shft = e.shiftKey, alt = e.altKey;
		var id = dnd.id.slice(2);
		if(drt.areas[id].teclaPres['t'+cod] && p_.es.Array(drt.areas[id].teclaPres['t'+cod])){
			for(i = 0; i < drt.areas[id].teclaPres['t'+cod].length; i++){
				o = drt.areas[id].teclaPres['t'+cod][i];
				rtrn = drt[o.obj][o.met](ctrl,shft,alt);
			}
		}else{
		}
		return rtrn;
	},
	rtnAbajo:function(e){			// mousedown and its efects of put caret, start selection or start to drag
		//drt.desdeXY = p_.coords(e);
		var o = p_.objetivo(e);
		var i = drt.es.Especial(o, 'rtnAbajo');
		if(i == -1){
			var d = drt.es.enEditable(o);
			var reg, quit = false, anc, m;
			if(d){
				if(drt.IDareaActual && drt.IDareaActual != d.id){		// trigger functions of focus if it happen
					drt.evt.lanzar('desenfocar', e, drt.IDareaActual, 'rtnAbajo');
					drt.evt.lanzar('prevenfocar', e, d.id, 'rtnAbajo');
				}
				drt.desde = drt.obt.cercano(e, o, d);		// look for the nearest markable element
				if(!drt.desde){ drt.desde = drt.obt.ultimoHijo(o);}	// or look for the last markable in the object
				if(!drt.desde){ drt.desde = drt.obt.ultimoHijo(d);}	// or look for the last markable in the canvas' div
				drt.caret.obj.style.display = 'inline';
				drt.mov.ponCaret(drt.desde);
				drt.estaRtnAb = true;
				drt.mod.actualizarArea(d.id);

			}
			m = o.className.match(drt.reClaSelec)
			if(m && m.length){
				reg = drt.sel.registrado(drt.desde);	// if it is a marked element, start drag it
				drt.arrastra = reg;
			}else{
				if((!d && !drt.es.OperadorExterno(o)) || (d && !e.ctrlKey) ){
					drt.sel.desmarcarTodo();
					drt.sel.deregistrarTodo();
				}
			}
		}else{
			drt.especiales.rtnAbajo[i].lanza(e, o);
		}
	},
	rtnMueve:function(e){			// mousemove, dragging, selecting
		var coo, d, o, caja, i;
		o = p_.objetivo(e);
		i = drt.es.Especial(o, 'rtnMueve');
		if(i == -1){
			if(drt.estaRtnAb && o != drt.hasta){
				drt.hasta = o
				var d = drt.es.enEditable(drt.hasta);
				if(d){
					if(!drt.selecIniciada){
						drt.evt.lanzar('prevelegir', false, d.id, 'rtrnMueve');
						drt.selecIniciada = true;
					}
					e = (e) ? e : ((window.event) ? event : null);
					drt.hasta = drt.obt.cercano(e, drt.hasta, d);
					if(!drt.hasta){ drt.hasta = drt.obt.ultimoHijo(d); }
					if(drt.hasta){
						if(drt.arrastra){
							if(e.ctrlKey){
								// mostrar + y un poco de lo arastrado
							}else{
								// mostrar → y un poco de lo arastrado
							}			
						}else{
							drt.sel.desmarcarTodo();
							drt.sel.marcar(drt.desde,drt.hasta);
							if(e.ctrlKey ){	//&& drt.hasta.className.match(drt.reClatexto)
								drt.remarcar();
							}
						
						}
						/*
						Si es primero en línea y x < mitad elemento, caret.prev = true;
						*/
						drt.mov.ponCaret(drt.hasta);
					}
			
				}
			}
		}else{
			drt.especiales.rtnMueve[i].lanza(e, o);
		}
		//var dnd = (drt.hasta)?drt.hasta.tagName:false;
		//p_.sel('coordens').value = 'x:'+coo.x+'; y:'+coo.y+'; elm:'+dnd;
	},
	rtnArriba:function(e){
		drt.estaRtnAb = false;
		var o = p_.objetivo(e);
		var i = drt.es.Especial(o, 'rtnArriba');
		if(i == -1){
			var d = drt.es.enEditable(o);
			var s = (drt.hasta)?drt.hasta:drt.desde;
			var t = new Date(), des, r, copia, m;
			var r = t - drt.ultClick
			var rn, quit = false, anc;
			if(d){
				if(drt.arrastra && drt.hasta){		// drop the range
					rn = drt.sel.registrado(drt.hasta);
					if(!rn || rn.rng != drt.arrastra.rng){
						copia = (e.ctrlKey)? true: false;
						drt.ops.ponSel(drt.arrastra.rng, drt.hasta, drt.caret.prev, copia);
						drt.sel.desmarcarTodo();
						drt.sel.deregistrarTodo();
					}			
				}else{							
					if(drt.ultClick && t - drt.ultClick < drt.vel2Click && !drt.hasta && drt.desde == drt.primClick){ 
					// check if it is a double click
						drt.evt.lanzar('dobleclick', e, d.id, 'rtnArriba');
						m = drt.desde.className.match(drt.reClaselec);
						des = (m && m.length)?true:false;
						drt.sel.desmarcarTodo();
						drt.sel.selPalabra(drt.desde,des);	// select to the limits of the word
						drt.selecIniciada = true;
						if(e.ctrlKey ){
							drt.sel.remarcar();
						}
						drt.primClick = false;

					}else{
						drt.ultClick = t;
						drt.primClick = drt.desde;
					}
					drt.sel.registrarTodo();
				}
				
				drt.areas[d.id].inpt.focus();	// focus on zero-width input to wait for key event
			}
			if(drt.selecIniciada){		// launch events if something has been marked
				drt.evt.lanzar('elegir', e, drt.IDareaActual, 'rtnArriba');			
			}
			if(drt.IDareaActual && ( (!d && !drt.es.OperadorExterno(o)) || drt.IDareaActual != d.id)){
				drt.evt.lanzar('desenfocar', e, drt.IDareaActual, 'rtnArriba');
			}
			if(!d && quit){
				drt.mov.ocultarCaret();
			}
			drt.IDareaActual = (d)? d.id:false;
			drt.arrastra = false;
			drt.desde = false;
			drt.hasta = false;
		}else{
			drt.especiales.rtnArriba[i].lanza(e, o);
		}
		
	},
	lanzar: function(evt, eb, id, lanzador){	// trigger all the functions attached to certain events 
	// eb : evento de buscador, si se lanza por un click, pasar el click;
		var rtrn = false, i;
		if(drt.areas[id]){
			var fn = drt.areas[id].eventos[evt];
			if(p_.es.Array(fn) && fn.length){
			//p_.nodo('div','tst1', false, 'lanza:'+evt+' con:'+lanzador+'; fn:'+fn.length)
				for(i=0; i< fn.length; i++){
			//p_.nodo('p','tst1', false, 'lanza:'+evt+' con:'+fn[i]+' para id:'+id)
					rtrn = fn[i](eb, id, lanzador);
				}
			}
		}else{
			p_.nodo('div','tst1', false, 'lanza:'+evt+' con:'+lanzador+' para id:'+id)
		}
		return rtrn;
	},
	ponerEvento: function(evt,fn,a,i){		
		var rtrn = false, dnd, m;
		if(p_.es.Function(fn)){
			if(drt.otrosEventos[evt] && p_.es.Object(a)){ // por ahora solo aplicable a los objetos de drt.areas
				a.eventos[evt] = (a.eventos[evt] && p_.es.Array(a.eventos[evt]))?a.eventos[evt]:[];
				a.eventos[evt].push(fn);
				rtrn = a;
			}else{
				if(p_.es.HTMLElement(a)){
					dnd = a;
				}else if(p_.es.Object(a)){
					m = evt.match(/key/gi);
					dnd = (m && m.length)?a.inpt: a.elm;
				}else{
					dnd = false;
				}
				rtrn = (dnd)? p_.ponEvento(dnd, ev, fn): false;
			}
		}
		return rtrn;
	},

}
