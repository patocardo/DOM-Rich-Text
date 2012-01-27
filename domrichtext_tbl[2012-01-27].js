drt.tabla = {
	select : [], // ranges of rows, columns or cells
	actual: {tabla:null, titulo: null, desc: null, fila:null, celda:null},
	tiradores:{
		anchocol: {txt:'++', cursor:'move', abajo:'ab_anchocol', arriba:'arr_anchocol', mueve:'mu_anchocol'},
		porcol: {txt:'\u00A0v\u00A0', cursor:'pointer', abajo:'ab_porcol', arriba:'arr_porcol'}, /*
						un solo tirador para diferentes opciones en cada click:
						selecciona simple, selecciona combinado, desel combinado, deselecciona */
		altofila: {txt:'‡', cursor:'move', abajo:'ab_altofila', arriba:'arr_altofila', mueve:'mu_altofila'},
		porfila: {txt:'>', cursor:'pointer', abajo:'ab_porfila', arriba:'arr_porfila'},
		der: {txt:'>|', cursor:'pointer', abajo:'ab_der', arriba:'arr_der', mueve:'mu_der'},
		izq: {txt:'|<', cursor:'pointer', abajo:'ab_izq', arriba:'arr_izq', mueve:'mu_izq'},
		aba: {txt:'v', cursor:'pointer', subry: true, abajo:'ab_aba', arriba:'arr_aba', mueve:'mu_aba'},
		der_aba: {txt:'\\|', subry: true, cursor:'pointer', abajo:'ab_der_aba', arriba:'arr_der_aba', mueve:'mu_der_aba'},
		izq_aba: {txt:'|/', subry: true, cursor:'pointer', abajo:'ab_izq_aba', arriba:'arr_izq_aba', mueve:'mu_izq_aba'},
		
	},
	matTir:[],
	prevX: false,
	prevY: false,
	movido: false,
	crearTiradores: function(){		// creates the handlers that will manage some table properties through mouse actions
		var tir, cuad;

		if(!drt.conf.eventos.poncaret){ drt.conf.eventos.poncaret = [] }; // put it as default event for all canvas
		drt.conf.eventos.poncaret.push(drt.tabla.ponTiradores);

		for(t in drt.tabla.tiradores){
			tir = drt.tabla.tiradores[t];
			drt.tabla.tiradores[t].elm = p_.nodo('div',document.body,
				{className:'drt_tirador', title:t, style:{cursor:tir.cursor}}, tir.txt);
			if(tir.subry){
				drt.tabla.tiradores[t].elm.style.textDecoration = 'underline';
			}
		}
	},
	ubicarTirador: function(pos, x, y, tipo,id, tabla, ncol, nfil, id){		// put in place the specific handler
		var i, g, elm, x, y, tabla;
		
		i = drt.tabla.matTir.length;
		elm = drt.tabla.tiradores[tipo].elm.cloneNode(true);
		elm = drt.areas[id].elm.appendChild(elm);
		elm.style.display = 'inline';
		g = p_.geomet(elm, true);
		if(pos=='arr'){
			x -= g.w /2;
			y -= g.h;
		}else if(pos=='izq'){
			x -= g.w;
			y -= g.h /2;
		}else if(pos=='aba'){
			x -= g.w /2;
		}else if(pos=='der'){
			y -= g.h /2;
		}
		p_.moverA(elm,[x , y] );
		drt.tabla.matTir[i] = {elm: elm, tabla: tabla, x: x, y: y, ncol: ncol, nfil: nfil, idarea: id}
	},
	ponTiradores: function(eb, id, lanzador, tabla){		// put all the handlers in the table
	p_.nodo('div','tst2', false, 'aca')
		var rtrn = false, i, j, gt, cols, cs, pc, ac, gr, gc, tabla;
		tabla = (tabla)? tabla : drt.tabla.esTablaEditable(drt.caret.elm);
		if(tabla){
			tabla = drt.tabla.normalizarTabla(tabla);
			gt = p_.geomet(tabla);
			cs = parseInt(tabla.cellSpacing);
						
			cols = tabla.getElementsByTagName("col");
			pc = gt.ix + cs/2;
			for(i=0; i < cols.length; i++){
				ac = parseInt(cols[i].style.width) + cs/2 + 
					parseInt(cols[i].style.borderLeftWidth)+
					parseInt(cols[i].style.borderRightWidth);
				//pc = parseInt(p_.estiloDe(cols[i], "left"));
				drt.tabla.ubicarTirador('arr', pc + ac/2, gt.y, 'porcol',id, tabla, i, 0, id);
				pc += ac + cs/2;
				drt.tabla.ubicarTirador('arr', pc, gt.y, 'anchocol', id, tabla, i, 0, id);				
			}
			for(i=0; i < tabla.rows.length; i++){
				gr = p_.geomet(tabla.rows[i], true);
				drt.tabla.ubicarTirador('izq', gt.x, gr.y + gr.h/2 + cs/2, 'porfila',id, tabla, i, 0, id);
				drt.tabla.ubicarTirador('izq', gt.x, gr.y + gr.h + cs/2, 'altofila', id, tabla, i, 0, id);				
			}
		}else{
			drt.tabla.removerTiradores(id)
		}
	},
	removerTiradores: function(id){				// remove the displayed handles
		if(drt.tabla.matTir.length){
			for(i = drt.tabla.matTir.length -1; i >= 0 ; i--){
				drt.areas[id].elm.removeChild(drt.tabla.matTir[i].elm);
				drt.tabla.matTir.pop();
			}
		}
	},
	esTablaEditable: function(elm){				// check if the table is editable
		var anc, tb = null, ar = false, i, rtrn = false;
		anc = p_.ancestros(elm).reverse();
		for(i = 1; i < anc.length && !ar; i++){
			if(anc[i].tagName.toUpperCase() == "TABLE"){
				tb = anc[i];
			}
			if(tb && drt.es.Area(anc[i])){
				ar = true;
			}
		}
		rtrn = (ar)? tb: false;
		return rtrn;
	},
	esTirador: function(elm){				// check if the elm HTMLElement is a handler (special element)
		var rtrn = (elm.className.match(/\bdrt_tirador\b/gi));
		return rtrn;
	},
	abajoTirador: function(e, elm){			// when mousedown on any hadler
		var rtrn = false, fn, c;
		fn = drt.tabla.tiradores[elm.title].abajo;
		e = (e) ? e : ((window.event) ? event : null);
		c = p_.coords(e);
		drt.tabla.prevX = c.x;
		drt.tabla.prevY = c.y;
		rtrn = (p_.es.Function(drt.tabla[fn])) ? drt.tabla[fn](e, elm) : false;
		return rtrn;
	},
	arribaTirador: function(e, elm){	// when mouseup on any hadler
		var rtrn = false, fn;
		fn = drt.tabla.tiradores[elm.title].arriba;
		drt.tabla.prevX = false;
		drt.tabla.prevY = false;
		rtrn = (p_.es.Function(drt.tabla[fn])) ? drt.tabla[fn](e, elm) : false;
		return rtrn;
	},
	mueveTirador: function(e, elm){		// when mousemove on any hadler
		var rtrn = false, fn;
		fn = drt.tabla.tiradores[elm.title].mueve;
		rtrn = (p_.es.Function(drt.tabla[fn])) ? drt.tabla[fn](e, elm) : false;
		return rtrn;
	},
	ab_anchocol: function(e, elm){		// when mousedown on a column-width hadler
		drt.estaRtnAb = true;
	},
	arr_anchocol: function(e, elm){		// when drag on a column-width hadler
		var n, tir;
		if(drt.tabla.movido){
			n = drt.tabla.matTir.buscar(function(v,ref){ 
					rtrn = (v.elm == ref)?true: false; return rtrn;}, elm, true);
			tir = drt.tabla.matTir[n];
			drt.tabla.removerTiradores(tir.idarea)
			drt.tabla.ponTiradores(e, tir.idarea, 'arr_anchocol', tir.tabla);
			drt.tabla.movido = false;
		}
		drt.estaRtnAb = false;
	},
	mu_anchocol: function(e, elm){			// when drop a column-width hadler
		if(drt.estaRtnAb){
			e = (e) ? e : ((window.event) ? event : null);
			var c, w, cual,tir, col1w, col2w;
			w = elm.offsetWidth;
			c = p_.coords(e);
			if(c.x != drt.tabla.prevX){
				cual = drt.tabla.matTir.buscar(function(v,ref){ 
						rtrn = (v.elm == ref)?true: false; return rtrn;}, elm, true);
			
				tir = drt.tabla.matTir[cual];

				cols = tir.tabla.getElementsByTagName("col");
				
				col1w = parseInt(p_.estiloDe(cols[tir.ncol], "width")) - drt.tabla.prevX + c.x;
	//p_.nodo('div','tst2',false, 'tir.ncol '+cols[tir.ncol]+'; w:'+col1w);
				if(e.ctrlKey && cols[tir.ncol + 1]){
					col2w = parseInt(p_.estiloDe(cols[tir.ncol+1], "width")) + drt.tabla.prevX - c.x;
					drt.tabla.redimCol(cols[tir.ncol], col1w, cols[tir.ncol+1], col2w);
					
				}else{
					drt.tabla.redimCol(cols[tir.ncol], col1w);
				}
				p_.moverA(elm, [c.x - w/2, false]);
				
				drt.tabla.movido = true;
				drt.tabla.prevX = c.x;
			}
			
		}
	},
	
	selCol: function(col, cubre){
	// cubre: bool, true→ si agarra una celda combinada, seleccionar también las otras columnas
	},
	selFila: function(fila, cubre){
	// cubre: bool, true→ si agarra una celda combinada, seleccionar también las otras columnas
	},
	selCelda: function(fila, cubre){
	// cubre: bool, true→ si agarra una celda combinada, seleccionar también las otras columnas
	},
	celdasRegistradas: function(){ // a partir de los rangos de drt
	},
	celdasElegidas: function(){ // a partir de los rangos de tabla
	},
	redimCol:function(col1, w1, col2, w2){
		// si se define col2, ésta se redimensiona, si no, se mueve
		col1.style.width = w1+'px';
		if(col2 && w2){
			col2.style.width = w2+'px';
		}		
	},
	redimFila: function(fil1, fil2, prop){
	},
	fijarCols: function(cols, w){
	},
	fijarFilas: function(filas, h){
	},
	fijarCeldas: function(cels, w, h){
	},
	ajustarCols: function(cols, regla, prop){
	},
	ponCol: function(ref, desp, prop){
	},
	ponFila: function(ref, desp, prop){
	},
	ponCelda: function(ref, desp, prop){
	},
	borraCol: function(col, prop){
	},
	borraFila: function(fila, prop){
	},
	borraCelda: function(cel, prop){
	},
	unirCeldas: function(cels, prop){
	},
	dividirCelda: function(n, cols, prop){ // en vez de dividir, une las otras
		/* n = cantidad
			cols: bool, false→ divide en filas 
		*/
	},
	normalizarTabla: function(tabla){				// set the usefull tags and properties to a original table
		var cols, r, i, sp, j, c;
		cols = tabla.getElementsByTagName('col');
		if(!tabla.cellSpacing){
			tabla.cellSpacing = ""+ parseInt(p_.estiloDe(tabla, "border-spacing")) +"";
		}
		if(!cols.length){
			r = tabla.rows[0].cells;
			for(i=0; i < r.length; i++){
				sp = (r[i].colspan)? r[i].colspan : 1;
				for(j=0; j< sp; j++){
					c = p_.nodo('col',tabla);			
				}
			}
		}
		r = tabla.getElementsByTagName('col');
		for(i=0; i < r.length; i++){
			r[i].style.width = p_.estiloDe(cols[i], "width");
			r[i].style.borderLeftWidth = p_.estiloDe(cols[i], "border-left-width");
			r[i].style.borderRightWidth = p_.estiloDe(cols[i], "border-right-width");
		}
		
		return tabla;
	}
}

drt.hazPrevInicio.push(drt.tabla.crearTiradores);		// creates handlers befor anything start

drt.especiales.rtnAbajo.push({verif:drt.tabla.esTirador, lanza: drt.tabla.abajoTirador}); 	// attach events for handlers
drt.especiales.rtnArriba.push({verif:drt.tabla.esTirador, lanza: drt.tabla.arribaTirador});
drt.especiales.rtnMueve.push({verif:drt.tabla.esTirador, lanza: drt.tabla.mueveTirador});


