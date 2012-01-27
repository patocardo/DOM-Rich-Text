drt.ops = {
	ponSel: function(rng,dnd,antes,copia, prop){
		var rtrn = false, d, o;
		if(p_.es.Number(rng) && p_.es.HTMLElement(dnd) && drt.rangos[rng]){
			d = drt.es.enEditable(dnd);
			if(d){
				if(antes){
					for(var i=0; i < drt.rangos[rng].item.length; i++){
						o = (copia)?drt.rangos[rng].item[i].cloneNode(true) : drt.rangos[rng].item[i];
						if(dnd.parentNode.insertBefore(o,dnd)) rtrn = true;;
					}
				}else{
					for(var i = drt.rangos[rng].item.length -1; i >= 0 ; i--){
						o = (copia)?drt.rangos[rng].item[i].cloneNode(true) : drt.rangos[rng].item[i];
						if(p_.insertAfter(o,dnd)) rtrn = true;;
					}				
				}
				if(!prop){ 
					drt.evt.lanzar('cambiar', false, d.id, 'ponSel');
					drt.des.regAccion('ponSel', d);
				}
			}
		}else{
					p_.nodo('div','tst1',false,p_.tipo(dnd)+' ;'+rng);
		}
		return rtrn;
	
	},
	ponTodoSel:function(dnd,antes,copia, prop){
		for(var j=0; j < drt.rangos.length; j++){
			drt.ops.ponSel(j,dnd,antes,copia);
		}
	},
	borreTodoSel: function(prop){
	//p_.sinHijos('tst2')
		for(var i = 0; i < drt.rangos.length; i++){
			drt.ops.borreSel(i,true, prop);
		}
		drt.mod.limpiarTodosVacios(true);
	},
	borreSel:function(rng,noLimp, prop){
		//noLimp: no limpiar nodos vacíos porque lo hace otra operación
		var e,p,dv,rtrn = false, areas = [], i, ne;
		if(drt.rangos[rng]){
			ne = drt.obt.proximo(-1, drt.rangos[rng].item[0]);
			if(!ne) { ne = drt.obt.proximo(1, drt.rangos[rng].item[drt.rangos[rng].item - 1])};
			while(drt.rangos[rng].item.length > 0){
				e = drt.rangos[rng].item.shift(); 
				d = drt.es.enEditable(e);
				if(!areas.length || d != areas[areas.length - 1]){
					areas.push(d);
				}
				p = e.parentNode;
				p.removeChild(e);
			};
			if(!noLimp){
				drt.mod.limpiarVacios(dv,true);
			}
			drt.mov.ponCaret(ne);
			rtrn = true;
			if(!prop){
				for(i = 0; i< areas.length; i++){
					drt.evt.lanzar('cambiar', false, d.id, 'borreSel');
					drt.des.regAccion('borreSel', areas[i]);
				}
			}
		}
		return rtrn;
	},

}
