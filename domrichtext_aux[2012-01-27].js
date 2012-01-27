drt.aux = {
	posEnLista:function(nl,elm){
		var i=0,rtrn=-1;
		while(nl[i] && rtrn == -1){
			if(nl[i] == elm){rtrn = i;}
			i++;
		}
		return rtrn;
	},
	seleccionar: function(elm){
		var body = document.body, range, sel;
		if (body.createTextRange) {
		    range = body.createTextRange();
		    range.moveToElementText(elm);
		    range.select();
		} else if (document.createRange && window.getSelection) {
		    range = document.createRange();
		    range.selectNodeContents(elm);
		    sel = window.getSelection();
		    sel.addRange(range);
		}
	},
	deseleccionar: function (){
        sel = window.getSelection();
        sel.removeAllRanges();
	},
	matriz2Arbol: function(m){
		var rtrn = false, i, anc;
		if(p_.es.Array(m) || p_.es.NodeList(m)){
			i = m.length - 1;
			while(m.length){
				anc = p_.ancestros(m)
			}
		}
		return rtrn;
	}

}
