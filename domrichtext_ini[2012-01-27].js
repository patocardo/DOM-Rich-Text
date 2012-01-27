drt = {
	conf:{ // Configuration options that can be overwritten by "conf" argument while creating canvas
		eventos:{
			'keydown':[{obj:'evt', met:'teclaAb'}],
			'keyup':[{obj:'evt', met:'teclaArr'}],
			'desenfocar':[{obj:'evt', met:'actualizarValor'}],
		},
		teclaPres:{
			t8: [{obj:'ed', met:'retro'}],
			t9: [{obj:'ed', met:'tabular'}],
			t13: [{obj:'ed', met:'nuevaLinea'}],
			t37: [{obj:'mov', met:'izquierda'}],
			t38: [{obj:'mov', met:'arriba'}],
			t39: [{obj:'mov', met:'derecha'}],
			t40: [{obj:'mov', met:'abajo'}],
			t46: [{obj:'ed', met:'del'}],
			t63272: [{obj:'ed', met:'del'}],
			t35: [{obj:'mov', met:'aUltimoEnLinea'}],
			t63275: [{obj:'mov', met:'aUltimoEnLinea'}],
			t36: [{obj:'mov', met:'aPrimeroEnLinea'}],
			t63273: [{obj:'mov', met:'aPrimeroEnLinea'}],
			t45: [{obj:'mov', met:'modoInsertar'}]
		},
		teclaSolt:{
			t32: [{obj:'ed', met:'espacio'}]
		},
	},
	// Variables used for common setup and to communicate between methods
	abuelo:false, // Common ancestor of all started canvas
	areas:{},
	arrastra:false, // object that indicates which range is being dragged, false none
	
	bloques: {"P":true,"LI":true,"DIV":true,"TD":true,"TH":true, "BLOCKQUOTE": true, 
			"H1": true, "H2": true, "H3": true, "H4": true, "H5": true, "H6": true},
	caret:{obj:false, elm:false, x:0, y:0, h:10, w:1, ancho:1, prev:false, area: false},
	clatexto: "drt_letra",		
	claselec: "drt_letrasel",
	desde:false,
	equivalentes: {'strong':{ etiq : ['b','strong'], est: {dec:'fontWeight', val:['bold','bolder', '600', '700', '800', '900']}},
					'em':{ etiq : ['i','em'], est:{dec:'fontStyle', val:['italic', 'oblique']}},
					'u':{ etiq : ['u'], est:{dec:'textDecoration', val:['underline']}},
					'del':{ etiq : ['s', 'strike', 'del'], est:{dec:'textDecoration', val:['line-through']}},
					'ovlin':{ est:{dec:'textDecoration', val:['overline']}},
					'vers':{ est:{dec:'fontVariant', val:['small-caps']}},
					'may':{ est:{dec:'textTransform', val:['uppercase']}},
					'min':{ est:{dec:'textTransform', val:['lowercase']}},
					'cap':{ est:{dec:'textTransform', val:['capitalize']}}
				},
	estaRtnAb: false,
	especiales: {
	// elements that behaves different in event methods,
		'rtnAbajo':[], 
		// array of object with functions of the type 'fn(elm)' that verify the element and launch when event ocurr
		'rtnArriba':[],
		// each object in these arrays are {verif:fn, lanza:fn}
		'rtnMueve':[]	
	}, 
	eventosBODY:{
		'mousedown':[{obj:'evt', met:'rtnAbajo'}],
		'mousemove':[{obj:'evt', met:'rtnMueve'}],
		'mouseup':[{obj:'evt', met:'rtnArriba'}],
	},

	hasta:false,
	hazInicio: [], 		// arrays of functions triggered after drt object initiates
	hazPrevInicio: [],	//	arrays of functions triggered before drt object initiates. Both are usefull for extensions
	IDareaActual:false,
	otrosEventos: {'prevcambiar':true, 	// before change canvas node
			'cambiar':true, 			// after change canvas node
			'prevenfocar': true, 		// before focus canvas node
			'enfocar': true,			// focus canvas node
			'desenfocar': true, 		// equivalent to blur
			'cargar': true, 			// when canvas is created
			'prevredim': true,			// befor resize canvas node
			'redim': true, 				// resize canvas node
			'prevelegir': true, 		// before select start
			'elegir': true, 			// after select elements >>>> MAKE IT WORK WITH KEYBOARD!!
			'prevrecargar': true, 		// before return to canvas node original value (reset)
			'recargar': true,			// after return to canvas node original value (reset)
			'prevponcaret': true, 		// before put caret in new position
			'poncaret': true, 			// after put caret in new position
			'prevdeshacer': true, 		// before undo
			'deshacer': true,			// after undo
			'prevrehacer': true, 		// before redo
			'rehacer': true,			// after redo
			'dobleclick': true			// as it has attached mousedown and mouseup, doubleclick must be simulated
			},			
	primClick:false,
	rangos:[],
	rotCur:false,
	selecIniciada: false,
	sobreEscribir: false, // for the tipical insert key behavior
	ultClick:false,
	vel2Click:1000,
	
	
	camCaret: function(){	// function to blink caret (because blinking is deprecated)
		drt.caret.obj.style.visibility = (drt.caret.obj.style.visibility == 'hidden')?'visible':'hidden';		
	},
	
	iniciar:function(haz){ // initiate the DOMRichTextEditor
		//haz: bool, true=>create canvas getting divs by del className, false=> do not create
		var i,d,idinpt,oe;
		for(i=0; i < drt.hazPrevInicio.length; i++){
			drt.hazPrevInicio[i](haz);
		}
		for(ev in drt.eventosBODY){
			for(i=0; i < drt.eventosBODY[ev].length; i++){
				oe = drt.eventosBODY[ev][i];
				p_.ponEvento(document.body, ev, drt[oe.obj][oe.met]);
			}
		}
		// Creation of Regular Expression
		drt.reClatexto = new RegExp('\\b'+drt.clatexto+'\\b','gi');
		drt.reClaselec = new RegExp('\\b'+drt.claselec+'\\b','gi');
		drt.reClases = new RegExp('\\b('+drt.clatexto+'|'+drt.claselec+')\\b','gi');
		
		
		// Caret (cursor) declaration 
		drt.caret.obj = p_.nodo('span', document.body, {id:'drt_caret_obj', className:'drt_caret',
						style:{visibility:'visible', position:'absolute',top:'0',left:'0'}});
		drt.caret.ancho = parseInt(p_.estiloDe(drt.caret.obj, 'width'));
		drt.caret.obj.style.display = 'none';
		drt.rotCur = self.setInterval('drt.camCaret()',500);
				
		// make the canvas selecting them by their className
		if(haz){
			d = p_.sel('domrichtext','className'); // I can use getElementsByClassName with few elements
			for(i=0;i<d.length;i++){
				drt.hacerDRT(d[i]);
			}
		}
		for(i=0; i < drt.hazInicio.length; i++){
			drt.hazInicio[i](haz);
		}
	},
	
	hacerDRT:function(d,conf, conforz){
		d = p_.sel(d);
		conf = (conf && p_.es.Object(conf))?conf:{}; 
			// all values of conf are arrays or objects that concatenates width default values. Aimed for events and other arrays
		conforz = (conforz && p_.es.Object(conforz))?conforz:{}; 
			// all values of conforce will overwrite defaults. Aimed for classes and other strings
		
		var g, fn, id, areas = [], i, a, anc, k, v, vv;
		
		d.onselectionstart = function(){return false}; 		// cancel triggering native selection objcet
		d.onmousedown = function(){return false};		
		
		drt.mod.explotar(d);

		if(!d.id){ d.id = p_.idunico(6);}

		p_.ponClase(d, 'drt_activado'); // change style of the DIV, it is managed by estilos.css
		
		drt.areas[d.id] = drt.conf 	// Charge the default values
		for(v in conforz){			// OverWrite existing values
			drt.areas[d.id][v] = conforz[v]
		}
		for(v in conf){				// Append values to te existing ones
			if(p_.es.Array(drt.areas[d.id][v]) && p_.es.Array(conf[v])){
				drt.areas[d.id][v] = drt.areas[d.id][v].concat(conf[v]);
			}else if(p_.es.Object(drt.areas[d.id][v]) && p_.es.Object(conf[v])){
				for(vv in conf[v]){
					if(p_.es.Array(drt.areas[d.id][v][vv]) && p_.es.Array(conf[v][vv])){
						drt.areas[d.id][v][vv] = drt.areas[d.id][v][vv].concat(conf[v][vv]);
					}else{
						drt.areas[d.id][v][vv] = conf[v][vv];
					}
				}
			}else{
				drt.areas[d.id][v] = conf[v];
			}
		}
		
		drt.areas[d.id].elm = d ;	// put unnegotiable vars in the canvas
		drt.areas[d.id].acciones = [{estado:d.cloneNode(true), tarea:'cargar'}]; 
		drt.areas[d.id].accionAct = 0; 
		drt.mod.actualizarArea(d.id);
		
		//drt.areas[d.id].hidden = p_.nodo('textarea',d.parentNode,
		//	{id:id, cols:'40', rows:'5', value:drt.aTexto(d)},false,d, true);
		
		drt.areas[d.id].hidden = p_.nodo('input',d.parentNode,
			{id:'h_'+d.id, type:'hidden', value:drt.mod.aTexto(d)},false,d, true);
		
		if(!conf.inpt){
			idinpt = 'i_'+d.id;
			drt.areas[d.id].inpt = p_.nodo('input',d.parentNode,{id:idinpt, type:'text',
					style:{width:'1px',height:'1px',border:'0',margin:'0',
					padding:'0', opacity:'0', filter:'Alpha(opacity=0)' }},false,d);
		}
		p_.ponEvento(drt.areas[d.id].inpt, 'focus', drt.evt.focoInpt);
		
		if(!drt.areas[d.id].form){
			anc = p_.ancestros(d).reverse();
			k = anc.donde('FORM', 'tagName');
			if(k > -1){
				drt.areas[d.id].form = anc[k];
				p_.ponEvento(anc[k], 'reset', drt.mod.aOriginal);	// attach event to 'reset' of parent form
			}else{
				drt.areas[d.id].form = false;				
			}
		}

		for(ev in drt.areas[d.id].eventos){
	//	p_.nodo('div','tst2',false,'ev:'+drt.conf.eventos[ev].toSource());
			if(!p_.es.Array(drt.areas[d.id].eventos[ev])){
				drt.areas[d.id].eventos[ev] = [drt.areas[d.id].eventos[ev]];		// correct the "non-arrayed" functions
			}

			for(i=0; i < drt.areas[d.id].eventos[ev].length; i++){ 				
				fn = drt.areas[d.id].eventos[ev][i];
//			p_.nodo('p', 'tst1', false, 'evento:'+ev+'; i:'+i+'; fnc:'+fnc.name+'; tipo:'+p_.tipo(fnc))
				// check if it is internal event or external
				fn = (p_.es.Object(fn) && fn.obj && fn.met && p_.es.Function(drt[fn.obj][fn.met]))? drt[fn.obj][fn.met]:		
						((p_.es.Function(fn))? fn : function(){return false});
				if(!drt.otrosEventos[ev]){
					drt.evt.ponerEvento(ev,fn,drt.areas[d.id],i);
				}else{
					drt.areas[d.id].eventos[ev][i] = fn;
				}
			}
		}
		// define the common ancestor
		for(i in drt.areas){ areas.push(drt.areas[i].elm); }
		drt.abuelo = p_.ancestroComun(areas);

		drt.evt.lanzar('cargar', false, d.id);
	},
	

}
