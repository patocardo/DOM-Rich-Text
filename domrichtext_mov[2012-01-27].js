drt.mov = { // movements of caret
	ocultarCaret: function(){		// hide the caret
			p_.nodo('div','tst1',false,'en ocultarCaret');
		drt.caret.obj.style.display = 'none';
		drt.caret.elm = null;
	},
	ponCaret: function(elm,prev,ref, prop){ // prop: propagación, es sólo para uso interno
		ref = (ref && p_.es.HTMLElement(ref))?ref:false;

		var rtrn = false, h = false, s, area;
		area = drt.es.enEditable(elm)
		if(area){
			if(!prop) { drt.evt.lanzar('prevponcaret', false, area.id);}
			if(drt.es.Marcable(elm) || drt.es.Temporal(elm)){
				var g = p_.geomet(elm , true), x;
				prev = (prev)? true: false;
				x = (prev || drt.sobreEscribir)? g.x: g.x + g.w;
				w = (drt.sobreEscribir)? g.w: drt.caret.ancho;
				p_.moverA(drt.caret.obj,[x, g.y]);
				p_.aMedidas(drt.caret.obj, w, g.h);	// get the size of the element to define caret size
				drt.caret.elm = elm;
				drt.caret.area = area;
				drt.caret.x = x
				drt.caret.w = w
				drt.caret.y = g.y; 
				drt.caret.h = g.h;
				drt.caret.prev = prev;
				rtrn = elm;
			}else if(p_.es.HTMLElement(elm)){
				h = (ref && ref.nextSibling)? drt.obt.primerHijo(ref.nextSibling) : drt.obt.primerHijo(elm);
				if(!h){		// make a temporl nbsp to locate the caret until it is overwritten
					h = drt.ed.hazTemporal(elm, ref, false, true);
				}
				rtrn = drt.mov.ponCaret(h, true);
			}
			drt.evt.lanzar('poncaret', false, drt.caret.area.id);
		}
		return rtrn
	},
	modoInsertar: function(){ 			// insert key
		// there is oportunity to enrich it with combinatin keys
		drt.sobreEscribir = (drt.sobreEscribir)?false:true;
	},
	derecha:function(ctrl, shft, alt){		// right key
		var rtrn =false, prev;
		if(drt.caret.prev){
			rtrn = drt.caret.elm;
		}else{
			rtrn = (ctrl)? drt.obt.extremo(1, 'caracter'): drt.obt.proximo(1, false, false, false, true);
		}
		if(rtrn && rtrn.tagName){
			drt.sel.desmarcarTodo();
			if(shft){
				drt.desde = drt.desde || drt.caret.elm;
				drt.sel.marcar(drt.desde, rtrn);
				drt.sel.registrarTodo();
			}else{
				if(!alt){			// alt key will allow to do multiple selections
					drt.desde = false;
					drt.sel.deregistrarTodo();
				}
			}
			prev = (drt.obt.extremo(1, 'linea') == drt.caret.elm)?true:false;
			//prev = (drt.extremoLinea(rtrn, -1) == rtrn)?true:false;
			drt.mov.ponCaret(rtrn, prev);
			
		}
		return rtrn;
	},
	izquierda:function(ctrl, shft){
		var rtrn =false, hst, prev;
		if(!drt.caret.prev && drt.obt.extremo(-1, 'linea') == drt.caret.elm){
			hst = drt.caret.elm;
			prev = true;
		}else{
			rtrn = (ctrl)? drt.obt.extremo(-1, 'caracter'): drt.obt.proximo(-1, false, false, false, true);
			hst = (rtrn && rtrn.tagName)? rtrn: drt.caret.elm;
			prev = (ctrl || !(rtrn && rtrn.tagName))?true:false;
		}

		drt.sel.desmarcarTodo();
		if(shft){
			drt.desde = drt.desde || drt.caret.elm;
			drt.sel.marcar(drt.desde, hst);
			drt.sel.registrarTodo();
		}else{
			drt.desde = false;
			drt.sel.deregistrarTodo();
		}
		
		drt.mov.ponCaret(hst,prev);
		return rtrn;
	},
	arriba:function(ctrl, shft){
	p_.nodo('div', 'tst2', false, 'aca')
		var g, y, y2, gd, d, o = false, lado, go, caja;
		g = p_.geomet(drt.caret.obj,true);
		d = drt.es.enEditable();
		gd = drt.areas[d.id].geom;
		y2 = g.y -1;
		y = y2 - drt.areas[d.id].hl; // por las dudas que tenga tamaños grandes dentro
		y = (y < gd.iy)? gd.iy: y;
		caja = {izq:gd.ix, der:gd.ix+gd.iw};
		if(y >= gd.iy){
			o = drt.obt.proximoXY(g.x, y, 0, y2, caja);
			if(!o){			
				o = drt.obt.proximoXY(g.x, y, drt.areas[d.id].lado, y2, caja);
			}
			if(o){
				drt.sel.desmarcarTodo();
				if(shft){
					drt.desde = drt.desde || drt.caret.elm;
					drt.sel.marcar(drt.desde, o);
					drt.sel.registrarTodo();
				}else{
					drt.desde = false;
					drt.sel.deregistrarTodo();
				}
				go = p_.geomet(o,true);
				prev = (go.x + go.w < g.x)?false:true;
				drt.mov.ponCaret(o,prev);
			}
		}
		return o;
	},
	abajo:function(ctrl, shft){
		var g, y, y2, gd, d, o = false, lado, caja, go;
		g = p_.geomet(drt.caret.obj,true);
		y = g.y + g.h + 1;
		d = drt.es.enEditable();
		gd = drt.areas[d.id].geom;
		y2 = y + drt.areas[d.id].hl;
		y2 = (y2 < gd.iy + gd.ih)? y2 : gd.iy + gd.ih;
		caja = {izq:gd.ix, der:gd.ix+gd.iw};
		if(y < gd.iy + gd.ih){
			o = drt.obt.proximoXY(g.x, y, 0, y2, caja);
			if(!o){
				o = drt.obt.proximoXY(g.x, y, drt.areas[d.id].lado, y2, caja);
			}
			if(o){
				drt.sel.desmarcarTodo();
				if(shft){
					drt.desde = drt.desde || drt.caret.elm;
					drt.sel.marcar(drt.desde, o);
					drt.sel.registrarTodo();
				}else{
					drt.desde = false;
					drt.sel.deregistrarTodo();
				}
				go = p_.geomet(o,true);
				prev = (go.x + go.w < g.x)?false:true;
				drt.mov.ponCaret(o,prev);
			}
		}
		return o;
	},
	aPrimeroEnBloque: function(){
		var o = drt.obt.extremo(-1, 'bloque'), rtrn= false;
		if(o){
			drt.mov.ponCaret(o,true);
			rtrn = true;
		}
		return rtrn;
	},
	aUltimoEnBloque: function(){
		var o = drt.obt.extremo(1, 'bloque'), rtrn= false;
		if(o){
			drt.mov.ponCaret(o);
			rtrn = true;
		}
		return rtrn;
	},
	aPrimeroEnArea:function(){
		var o = drt.obt.extremo(-1, 'area'), rtrn= false;
		if(o){
			drt.mov.ponCaret(o,true);
			rtrn = true;
		}
		return rtrn;
	},
	aUltimoEnArea:function(){
		var o = drt.obt.extremo(1, 'area'), rtrn= false;
		if(o){
			drt.mov.ponCaret(o);
			rtrn = true;
		}
		return rtrn;
	},
	aPrimeroEnLinea: function(){
		drt.mov.ponCaret(drt.obt.extremo(-1, 'linea'),true);
	},
	aUltimoEnLinea: function(){
		drt.mov.ponCaret(drt.obt.extremo(1, 'linea'),false);
	},
}
