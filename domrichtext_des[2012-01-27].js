drt.des = {		// Undo and Redo methods
	regAccion: function(acc, d, elm){
		var rtrn, i, pa;
		a = drt.areas[d.id]
		if(elm && p_.es.HTMLElement(elm)){
			elm = elm.cloneNode(true);
			elm = (drt.es.Letra(elm) && elm.firstNode)? elm.firstNode.nodeValue: elm.tagName;
		}
		rtrn = {estado:d.cloneNode(true), accion:acc, elm:elm};
		if(a.accionAct < a.acciones.length - 1){
			for(i = a.acciones.length - 1; i >= a.accionAct; i--){
				/* hay que ver cómo se borran los cloneNode
				pa = a.acciones[i].estado.parentNode;
				pa.removeChild(a.acciones[i].estado);
				if(a.acciones[i].elm && p_.es.HTMLElement(a.acciones[i].elm)){
					pa = a.acciones[i].elm.parentNode;
					pa.removeChild(a.acciones[i].elm);
				}
				*/
				a.acciones.pop();
			}
		}
		a.acciones.push(rtrn);
		return rtrn;
	},
	deshacer: function(a,i){
		// a: area, i: cantidad de deshacer
		var pa, n, d, rtrn = false;
		a = (p_.es.HTMLElement(a))? drt.areas[a.id]: ((p_.es.String(a))? drt.areas[a]: a);
		if(a && a.elm && a.acciones){
			i = i || 1;
			drt.evt.lanzar('prevdeshacer', false, a.elm.id, i);
			pa = a.elm.parentNode;
			n = a.acciones.length - i - 1;
			n = (n > 0)? n: 0;
			d = pa.insertBefore(a.acciones[n].estado.cloneNode(true), a.elm);
			pa.removeChild(a.elm);
			a.elm = d;
			a.accionAct = n;
			rtrn = true
			drt.evt.lanzar('deshacer', false, a.elm.id, i);
		}
		return rtrn;
	},
	rehacer: function(a, i){
		var pa, n, d, rtrn = false;
		if(a && a.elm && a.acciones){
			i = i || 1;
			drt.evt.lanzar('prevrehacer', false, a.elm.id, i);
			pa = a.elm.parentNode;
			n = a.accionAct + i ;
			n = (n < a.acciones.length - 1)? n: a.acciones.length - 1;
			d = pa.insertBefore(a.acciones[n].estado.cloneNode(true), a.elm);
			pa.removeChild(a.elm);
			a.elm = d;
			a.accionAct = n;
			drt.evt.lanzar('rehacer', false, a.elm.id, i);
			rtrn = true
		}
		return rtrn;
	},
}
