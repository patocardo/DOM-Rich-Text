//-------------------------------------PROTOTIPOS=============================
//-------------------------------------Agregadas a Array

Array.prototype.lugar=function(valor, c, rev, pos){ /* Devuelve la primera o última(rev==true) de un valor en una matriz
												valor puede ser cualquier tipo
												c = comparador (=|>|<|≤|≥|≠)
												pos = 'p' → entra en profundidad en la matriz,y retornará una matriz con
												el camino hacia el punto
												pos = 'n' busca en la primera dimensión
												pos = número, busca sólo en determinada 'columna' para matriz 2d. Números
												negativos se restan desde largo de matriz*/
												
	var r = -1,p=0;
	try{
		c = c || "=";
		rev = rev || false;
		pos = (typeof(pos)=="undefined")?"n":pos;
		for(var i=0;i<this.length;i++){
			if(p_.es.Array(this[i]) && pos != "n"){
				if(pos == "p"){
					r = this[i].lugar(valor, c, rev, 'p');
					if(r!=-1){
						r = (p_.es.Array(r))?r.unshift(i):[i,r];
						if(!rev){break};
					}else{
						if(p_.comparar(this[i],valor,c)){
							r = i;
							if(!rev){break};
						}
					}	
				}else{
					p = (pos > (-1))? pos : this[i].lenght + pos; // cuenta desde la última posición
					if(p > -1 && p < this[i].length && p_.comparar(this[i][p],valor,c)){ // si p existe y coincide
						r=i;
						if(!rev){break};
					}
				}
			}else if((p_.es.Object(this[i]) && p_.comparar(this[i][pos],valor,c))|| p_.comparar(this[i],valor,c)){
				r = i;
				if(!rev){break};
			}
		}	
	}catch(e){p_.arrojar(e," array.lugar()");}
	return r;
}
Array.prototype.sub = function (valor, c, pos){ /* Igual que lugar pero retorna la matriz que coincide*/
	var r = [], dev= false, p = 0;
	try{
		c = c || "=";
		pos = (typeof(pos)=="undefined")?"n":pos;
		for(var i=0;i<this.length;i++){
			if(p_.es.Array(this[i]) && pos != "n"){
				if(pos == "p"){
					dev = this[i].sub(valor, c, 'p');
					if(r!=-1){
						r[r.length] = dev;
					}else{
						if(p_.comparar(this[i],valor,c)){
							r[r.length]=this[i];
						}
					}	
				}else{
					p = (pos > (-1))? pos : this[i].lenght + pos; // cuenta desde la última posición
					if(p > -1 && p < this[i].length && p_.comparar(this[i][p],valor,c)){ // si p existe y coincide
						r[r.length]=this[i];
					}
				}
			}else if((p_.es.Object(this[i]) && p_.comparar(this[i][pos],valor,c))|| p_.comparar(this[i],valor,c)){
				r[r.length]=this[i];
			}
		}	
	}catch(e){p_.arrojar(e," array.sub()");	}
	return r;
};

Array.prototype.donde = function(v,p){ // versión veloz de array.lugar(). v: valor, p: posición o atributo
	var r=-1,a,esP;
	esP = (typeof(p)=='undefined')?false:true;
	if(!esP && typeof (this.indexOf) === "function"){
		r = this.indexOf(v);
	}else{
		for(a=0;a<this.length;a++){
			if(esP){
				if(this[a][p]==v){r=a;break;}	
			}else{
				if(this[a]==v){r=a;break;}			
			}
		}
	}
	return r;
}
Array.prototype.buscar = function(fn, arg, prim, nv){ 
	/* prim= true: devuelve la posición; prim = false: devuelve matriz;
	nv= true: devuelve el resultado de la función, false: devuelve el valor del elemento de la matriz
	arg: argumento para pasar a la función
	*/
	var r,a,esP, esN, dev;
	if(p_.es.Function(fn)){
		esP = (!prim)? false: true;
		esN = (!nv)? false: true;
		r = (esP)?-1 : [];
		for(a=0;a<this.length;a++){
			dev = fn(this[a], arg);
			if(dev !== false){
				if(esP){
					r = (esN)? dev: a;
					break;
				}else{
					r[r.length] = (esN)? dev: a;
				}
			}
		}
	}
	return r;
}
Array.prototype.parte = function(v,p){// versión veloz de array.sub(). v: valor, p: posición o atributo
	var r=[],a;
	for(a=0;a<this.length;a++){
		if(this[a][p]==v){
			r[r.length]=this[a];
		}
	}
	return r;
}
Array.prototype.insertar = function(item,pos){
	return this.slice(0,pos).concat(item,this.slice(pos));
}
Array.prototype.ordenarPor= function(cl){
/*	cl = [[nºcampo,orden,sentido,expresion],[nºcampo,orden,sentido,expresion],...]
	orden = 0:alfabético; 1:numérico; 2:fecha; 3: cantidad de concordancias; 4: posición de concordancia
	sentido = 0: ascendente; 1:descendente
	expresión = cadena(para RegExp) que pretende concordancias
*/
	try{	
//=========== verificación
		var rtrn=false,iv,i,reto="";
		if(!p_.es.Array(cl)){reto+="·El argumento no es válido, consultar función"};
		for(iv=0;iv<cl.length;iv++){
		 	if(!p_.es.Array(cl[iv])){reto+="·El argumento no es valido, consultar funcion"}
			else if(cl[iv][0]>(this[0].length-1)){reto+="·Campos a ordenar no corresponden"}
			else if(!p_.es.Number(cl[iv][1])){reto+="·el orden debe indicarse con numero"}
		}
		if(reto==""){
//===================
			var tf,cc,oo,ss,may,ee,devo,lafunc,enfunc;
			devo = this.slice(0);
			enfunc = "";
			for(i=0;i<cl.length;i++){
			 	cc = cl[i][0]
			 	oo = (cl[i][1])?cl[i][1]:0;
			 	ss = (cl[i][2])?cl[i][2]:0;
			 	ee = (cl[i][3])?cl[i][3]:"";
			 	b = (ss)?"a":"b";
			 	a = (ss)?"b":"a";
			 	if(p_.es.Number(oo)){
			 	 // ojo que no tiene verificación para los órdenes mayores a 1
					ofn = ["rtrn=("+a+"["+cc+"]>"+b+"["+cc+"])?1:("+b+"["+cc+"]>"+a+"["+cc+"])?-1:0",
						"rtrn=parseInt("+a+"["+cc+"])-parseInt("+b+"["+cc+"])",
						"u=new Date("+a+"["+cc+"]);w=new Date("+a+"["+cc+"]);rtrn=u-w",
						"u=("+a+"["+cc+"].match(/("+ee+")/gi))?"+a+"["+cc+"].match(/("+ee+")/gi).length:0;"+
						"w=("+b+"["+cc+"].match(/("+ee+")/gi))?"+b+"["+cc+"].match(/("+ee+")/gi).length:0;rtrn= u-w",
						"rtrn="+a+"["+cc+"].search(/("+ee+")/gi) - "+b+"["+cc+"].search(/("+ee+")/gi)"]
					enfunc += (enfunc)?";if(rtrn==0){"+ofn[oo]+"}":ofn[oo];
				}
			}
			lafunc = new Function("a","b",enfunc+";return rtrn;");
			devo = devo.sort(lafunc);
			rtrn = devo;
		}else{
			p_.arrojar(new Error(reto)," Array.ordenarPor");
			rtrn = this;
		}
		return rtrn;	
	}catch(e){p_.arrojar(e," ordenarPor");}

}

//-------------------------------------Agregadas a String

String.prototype.explotar = function(args){ // args = ["divisor_1", "divisor_2",..."divisor_n"]
 	var i,j,ret,argus;
	//if(p_.es.Array(args)&&args.length>0){
		ret = this.split(args[0]);
		if(args.length>1){
			argus = args.slice(1);
		 	for(i=0;i<ret.length;i++){
				ret[i] = ret[i].explotar(argus);
			}			
		}
		/*
	}else{
		ret = this;
	}*/
	return ret;
};
String.prototype.podar = function(){
 	//limpia de espacios blancos delante y detrás, y cadenas repetidas pasadas a través de argumentos
	var ia,arg;
	var tex = this.replace(/^\s+/,"");
	tex = tex.replace(/\s+$/,"");
	for(ia=0;ia<arguments.length;ia++){
	 	arg = new RegExp(arguments[ia]+"{2,}","gi")
		tex = tex.replace(arg,arguments[ia]);
	}
	
	return tex;
};
String.prototype.revertir = function(){
	return this.split('').reverse().join('');
}
String.prototype.sinHTML = function(){
 	//los argumentos son cadenas que se desean quitar, como &nbsp;
	var tex = this.podar();
	tex = this.replace(/(<([^>]+)>)/ig,"");
	tex = tex.replace(/[\f\n\r\t\u00A0\u2028\u2029]/ig,""); 
	for(ia=0;ia<arguments.length;ia++){
	 	arg = new RegExp(arguments[ia]+"+","igm")
		tex = tex.replace(arg,"");
	}
	return tex;
}
String.prototype.aFecha = function(){ //devuelve un objeto Date a partir de una cadena aaaa-mm-dd
	var rgdia = /^(\d{4})[\-\/·.](\d{1,2})[\-\/·.](\d{1,2})$/;
	var resu
	if(rgdia.test(this)){
		resu = this.match(rgdia)
		resu = new Date(parseInt(resu[1]),parseInt(resu[2])-1,parseInt(resu[3]));
		return resu;
	}else{
		return false;
	}
};
String.prototype.primeraLetra = function(){
	return this.substr(0,1).toUpperCase()+this.slice(1).toLowerCase()
};
String.prototype.camello = function(){ // Como Para Título
	var s = this.replace(/[\w\u00c0-\u00d6]+/gi,
		function(str){
			return str.primeraLetra();
		}
	);
	return s;
};
String.prototype.repetir= function(veces){
	var rtrn=this,i,str;
	if(isNaN(veces)){
		p_.arrojar(new Error("veces debe ser entero"), " en String.repetir");
	}else{
		for(i=1;i<Math.abs(parseInt(veces));i++){
			rtrn+=this;
		}
	}
	return rtrn;
}
String.prototype.fijo= function(largo,relleno,alin){ /* relleno: caracter de relleno cuando this.length < largo
												   alin: 'izq' | 'med' | 'der' */
	var rtrn,p,l,r;
	if(isNaN(largo)){
		p_.arrojar(new Error("largo debe ser numérico")," String.fijo()");
		rtrn = this;
	}else if(this.length!=largo){
		relleno = relleno || " ";
		alin = alin || "izq";
		switch(alin){
			case "izq":
				rtrn = (this.length<largo)?this+relleno.repetir(largo-this.length):this.slice(0,largo);
				break;
			case "der":
				rtrn = (this.length<largo)?relleno.repetir(largo-this.length)+this:this.slice(this.length-largo);
				break;
			case "med":
				p = Math.abs(this.length-largo)/2;
				l = (p==Math.round(p))?p:Math.floor(p);
				r = (p==Math.round(p))?p:Math.ceil(p);
				rtrn = (this.length<largo)?relleno.repetir(l)+this+relleno.repetir(r) : this.slice(l,-r);
		}
	}else{
		rtrn = this;
	}
	return rtrn;
}

//-------------------------------------Agregadas a Number
Number.prototype.ajustar =function(b,may,men){ // b= divisor; may = máximo; men = mínimo
 	var num,res;
	res = (!isNaN(b))?(Math.round(this/b))*b:this;
	if(!isNaN(may)&&!isNaN(men)&& men>=may){
		p_.arrojar(new Error("'may' debe ser mayor que 'men'")," Number.ajustar()");
	}else{
		res = ((!isNaN(may))&&(res>may))?may:res;
		res = ((!isNaN(men))&&(res<men))?men:res;	
	}
	return res;
}
Number.prototype.esEntero = function(){
	return (this==parseInt(this))?true:false;
}
Number.prototype.esNatural = function(){
	return (this.esEntero() && this > 0)?true:false;
}
Number.prototype.esPar = function(){
	return (this.esEntero() && this % 2 == 0)?true:false;
}
Number.prototype.esPrimo = function(){
	var nums= Math.floor(Math.sqrt(this));
	var i = 1;
	rtrn = true;
	while (++i <= nums){
		if((num % i) == 0){
			rtrn = false;
			i = nums;
		}
	} 	
	return rtrn;
}
Number.prototype.largo = function(p){ //p: parte → "e": entrera, "f": fracción, otra: toda
	p = p || true;
	var num, rtrn;
	if(p=="e"){
		rtrn = Math.round(this).toString().length;
	}else if(p=="f"){
		if(this.esEntero()){
			rtrn = 0;
		}else{
			num = this.toString();
			rtrn = num.substring(num.indexOf(".")+1).length;		
		}
	}else{
		rtrn = this.toString().length;
	}
	return rtrn;
}
Number.prototype.fraccion = function(m){ /* m: modo → "n": numérico fraccionario, ej: 0.231
													"f": numérico entero, ej: 231 */
	m = m || "f";
	var num, rtrn;
	if(this.esEntero()){
		rtrn = 0;
	}else{
		num = this.toString();
		num = num.substring(num.indexOf(".")+1);		
		rtrn = (m=="n")?parseFloat("0."+num):parseInt(num);
	}
	return rtrn;
}
/*
Number.prototype.esRacional = function(l){ // l: largo máximo de dígitos para nominador y denominador
	var rtrn = true,lrg=this.largo("e");
	l = (l && l>lrg*2)?l:lrg*2;
	
	if()
	
}
*/
//-------------------------------------Agregadas a Date
Date.prototype.corta =function(sep){ // sep: separdor, predeterminado "-"
 	var dev,dia,mes;
 	sep = sep || "-"
 	dia = this.getDate(); dia = (dia<10)?"0"+dia:dia;
 	mes = this.getMonth()+1; mes = (mes<10)?"0"+mes:mes;
	dev = this.getFullYear()+sep+mes+sep+dia;
	return dev;	
}
p_ = {
	//----------------CONSTANTES
	cerrados: {"IMG":true,"BR":true,"INPUT":true,"HR":true,"AREA":true, "BASE":true, 
		"BASEFONT":true, "COL":true, "FRAME":true, "LINK":true, "META":true, "PARAM":true},
		/*no me acepta los rangos
	reLetra: new RegExp("\[A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02AF\\u0370-\\u0373"+
		"\\u0376\\u0377\\u0386\\u0388-\\u0482\\u048A-\\u0556\\u0561-\\u586\\u05D0-\\u05EA\]","gi"),
		*/
    //----------------AJAX
	ajax : function(url,met,val,cN,func){
		try{
			var xhr =(window.XMLHttpRequest)?new XMLHttpRequest():null;
			if(xhr==null){
			 	try{xhr=new ActiveXObject('Msxml2.XMLHTTP')}
			 	catch(e){
					try{xhr=new ActiveXObject('Microsoft.XMLHTTP')}
					catch(e){p_.arrojar(e," Sin soporte de XMLHTTP en p_.ajax()");xhr = null;}
				}
			}
			this.conn = function(){
		            xhr.open(met,url,true);
		            var cnt;
		            var dice = "<br>";
		            xhr.onreadystatechange = function() {
							if(xhr.readyState==4){
								if(xhr.status==200 || xhr.status==0){
									if(func){
										cnt=(cN)? xhr.responseXML.documentElement: xhr.responseText;
										func(cnt);
									}else{
										return xhr.responseText;
									}
						            delete xhr;
								}else{
									p_.arrojar(new Error('Problema con XML')," p_.ajax.conn()");
								}
							}else{
								return;
							}
		            }
		            if(met=='POST'){
		            	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		            };
	            	xhr.send(val);
			};
		
		}catch(e){p_.arrojar(e," en p_.ajax")}
	
	},
	cargar: function(url,met,val,cN,func){ // _p.cargar(str url, str método, str valores, bool comoNodo, func ajaxFunc )
		try{
			//document.getElementById('aux3').innerHTML +='hasta aca';
			met = met || 'GET';
			val = val || '';
			cN = cN || false; // si devuelve como Nodo o como texto
			func = (typeof(func)!="undefined" && p_.es.Function(func))?func:false;
				 // función que especifica lo que hay que hacer cuando cargue
			var a = new p_.ajax(url,met,val,cN,func);
			a.conn();
		}catch(e){p_.arrojar(e," en p_.cargar");}
	},
	montar: function(url,frm,func,mrc){ /* envío asincrónico de datos de formulario sin recarga de página
										frm: elemento o id de formulario
										func: [opt] función que se llamará cuando se complete la carga, si no se define
										devuelve el contenido como texto.
										mrc: [opt] marco donde irán los datos, si no se define se creará uno oculto*/
		try{
			frm = p_.sel(frm)
			if(!frm.tagName ||frm.tagName.toUpperCase() != "FORM"){
				p_.arrojar(new Error('segundo parámetro debe ser un formulario')," p_.ajax.montar()");};
			func = func || false;
			mrc = mrc || p_.nodo("iframe",p_.sel("body","#")[0],{style:{width:"0px",height:"0px",display:"none"}});
			if(func){
				mrc.onload = function(){
					func(this.documentElement); // revisar a ver que sorto devuelven los iframes
				}
			}
		
		}catch(e){p_.arrojar(e," en p_.montar")}
	
	},

	// ------- Para trabajar con el DOM
	atributar: function(nodo,attrib){ /* ambos parámetros son obligatorios,
										attrib debe ser objeto del modo {id:"idelem",style:{backgroundColor:"white"}}
										*/
										
		nodo = p_.sel(nodo)
		if(nodo && p_.es.Object(attrib)){
			for(var a in attrib){
			 	if(p_.es.Boolean(attrib[a])||p_.es.Null(attrib[a])||p_.es.String(attrib[a])||p_.es.Number(attrib[a])){
			 	 	nodo[a]=attrib[a]; //nodo.setAttribute(a,attrib[a]);				
				}else if((p_.es.Array(attrib[a])||p_.es.Object(attrib[a]))&& nodo[a]){
					for(var b in attrib[a]){nodo[a][b]=attrib[a][b];}					

				}
			}				
		}else{p_.arrojar(new Error("malos parámetros")," en p_.atributar");}
	},
	sinHijos: function(elm){
		try{
			elm = p_.sel(elm)
			if(elm){
				while(elm.childNodes.length){elm.removeChild(elm.lastChild)};
				rtrn = true;
			}else{	rtrn =false;}
			return rtrn;
		}catch(e){p_.arrojar(e," en p_.sinHijos")}	
	},
	cuantosHijos: function(elm){ // como un hasChildElements, pero devuelve la cantidad si la pide;
		var rtrn, h;
		rtrn = ('childElementCount' in elm)? elm.childElementCount: 0;
		if(!rtrn && elm.hasChildNodes()){
			for(h = elm.firstChild; h; h = h.nextSibling){
				rtrn += (h.nodeType == 1)?1:0;
			}
		}
		return rtrn;
	},
	insertAfter: function(elm,hermano){
		try{
			elm = p_.sel(elm);
			hermano = p_.sel(hermano);
			var rtrn;
			if(hermano.nextSibling){
				rtrn = hermano.parentNode.insertBefore(elm,hermano.nextSibling);
			}else{
				rtrn = hermano.parentNode.appendChild(elm);
			}
			return rtrn
		}catch(e){p_.arrojar(e," en p_.insertAfter "+ p_.tipo(hermano))}
	},
	nodo: function(tag,padre,attrib,inhtml,ref, delante){ // crea un nodo con atributos y contenido
		// ref es para insertBefore, delante cambia insertBefore por insertAfter
		try{
		  	var atrs,a,b,nuelem;
			if(tag=="text" && typeof(inhtml)!="undefined"){
				nuelem = document.createTextNode(inhtml.toString());
			}else{
				nuelem = document.createElement(tag);		
				if(attrib) p_.atributar(nuelem, attrib);
				if(typeof(inhtml)!="undefined" && inhtml !== false){
					inhtml = (p_.es.Node(inhtml))?inhtml:document.createTextNode(inhtml.toString());
					nuelem.appendChild(inhtml);
				}
			}
			if(padre && p_.sel(padre)){
				if(ref && !delante){
					p_.sel(padre).insertBefore(nuelem,p_.sel(ref));
				}else if(ref && delante){
					p_.insertAfter(nuelem, p_.sel(ref));
				}else{
					p_.sel(padre).appendChild(nuelem);
				}
			};		
			return nuelem;	
		}catch(e){p_.arrojar(e," en p_.nodo")}
	},
	grilla: function(padre,filas,cols,attrib,attd){ /* devuelve tbody de una tabla creada sin colSpan ni rowSpan
												attrib : atributos para tabla
												attd: atributos para celda
												attrib y attd son objeto con propiedades que reemplazan las predeterminadas */
		try{
			if(p_.es.Number(filas) && p_.es.Number(cols)){
				var gr,tb,f,l,tr=[],td=[];
				attd = attd || {style:{border:"1px solid black"}}
				gr = p_.nodo("table",padre,{cellSpacing:"0",cellPadding:"0",border:"0",style:{borderCollapse:"collapse"}});
				//
				tb = p_.nodo("tbody",gr);
				if(p_.es.Object(attrib)) p_.atributar(gr, attrib);
				for(var r=0;r<filas;r++){
					gr.insertRow(-1);
					f=gr.rows.length;
					tr[f] = gr.rows[f-1];
					for(var c = 0; c<cols;c++){
						tr[f].insertCell(-1);
						l = tr[f].cells.length			
						p_.atributar(tr[f].cells[l-1],attd)
					}
				}
				return gr;
			}else{
				return false;
			}
		}catch(e){p_.arrojar(e," en p_.grilla");}
	},
	coleccion: function(e,v,a,c){ // es para usar recursivamente en p_.sel, por ahora solo para valores String*/
		try{
			var i=0;
			if(e[a] && p_.es.String(e[a]) && e[a].match(v)){c[c.length] = e}		
			while(e.childNodes && i<e.childNodes.length){
				c = p_.coleccion(e.childNodes[i],v,a,c);			
				i++;
			}
			return c;
		}catch(err){p_.arrojar(err," en p_.coleccion");}
 	},
	colstl: function(e,r,v,c){ // es para usar recursivamente en p_.sel cuando busca reglas de estilo
		try{
			if(p_.es.Node(e)){
				var i=0;
				if(r){
					if(p_.estiloDe(e,r)==v){c[c.length] = e}
				}else{
					if(e.style.cssText.match(v)){c[c.length] = e} // hasta ahora sólo trabaja con los estilos declarados
				}
				while(e.childNodes && i<e.childNodes.length){
					c = p_.colstl(e.childNodes[i],r,v,c);			
					i++;
				}			
			}
			return c;
		}catch(err){p_.arrojar(err," en p_.colslt");}
 	},
 	sel: function(base,clc,elm){ /* base: nodo HTML ó
 									!clc : str id
 									clc=="#": str tagName
 									clc==str[atributo]: str valor
 								elm : elemento, si no document.
 								*/
 		try{
 			clc = clc || false;
 			var v,c,desde,sc,rg;
			if(!p_.es.Node(base)){
				if(p_.es.String(base)){
					if(!clc){
						base = document.getElementById(base) || null ;
					}else if(clc=="#"){
							if(!p_.es.HTMLElement(elm)) throw {message:"elm es "+p_.tipo(elm)}
						desde = (elm && p_.es.HTMLElement(elm))?elm:document;
						base = desde.getElementsByTagName(base) || [];
					}else if(p_.es.String(clc)){
						if(clc=="className" && document.getElementsByClassName){
							desde = (elm && p_.es.HTMLElement(elm))?elm:document;
							base = desde.getElementsByClassName(base) || [];
						}else{
							c = [];
							elm = (typeof(elm)!="undefined" && p_.es.Node(elm))? elm : document;
							if(clc=="style"){
								sc = base.indexOf(":");
								sc = (sc>-1)?sc:base.indexOf("=");
								rg = (sc>-1)?base.substring(0,sc):false;
								v = (sc>-1)?base.substring(sc+1):new RegExp("\\b"+base+"\\b","gi");
								base = p_.colstl(elm,rg,v,c);
							}else{
								v = new RegExp("\\b"+base+"\\b","gi");
								base = p_.coleccion(elm,v,clc,c);						
							}
						}
					}
				}else{base = false;}
			}
 			return base;
 		}catch(e){p_.arrojar(e," en p_.sel por "+p_.tipo(base));}
		
	},
	ancestros: function(elm){
		try{
			elm = p_.sel(elm);
			if(elm){
				elm = (elm.nodeType == 3)? elm.parentNode: elm;
				var nodes = []
	 			for (; elm && elm.tagName; elm = elm.parentNode){				
					nodes.unshift(elm)
				}
			}
			return nodes
		}catch(e){p_.arrojar(e," en p_.ancestros");}
	},
	ancestroComun: function(elms){
		try{
			var elms, rtrn = true, ascend = [],i=0,j;
			if((p_.es.Array(elms) || p_.es.NodeList(elms)) && elms.length > 1){
				for(i=0;i<elms.length;i++){
					j = ascend.length;
					elms[i] = p_.sel(elms[i]);
					ascend[j] = p_.ancestros(elms[i]);
					if(j && ascend[j][0] != ascend[j-1][0]){
						rtrn = false;
						break;
					}
				}
				if (rtrn){
					rtrn = false;
					for (i = 1; i < ascend[0].length && !rtrn; i++) {
						for(j=1;j < ascend.length && !rtrn; j++){
							if(ascend[j-1][i] != ascend[j][i]){
								rtrn = ascend[0][i-1];
							}
						}
					}
				}

			}else{
				rtrn = (elms.length==1)?p_.sel(elms[0]):false;
			}
			return rtrn;
		}catch(e){p_.arrojar(e," en p_.ancestroComun")}
	},
	colloc:[],
	ocultar: function (iddiv){
		try{
		 	var ladiv = p_.sel(iddiv);
		 	if(ladiv.nodeType==1){
				var pos = p_.colloc.donde(ladiv,0);
				if(pos==-1){
					p_.colloc[p_.colloc.length]=[ladiv,ladiv.style.display]
				}
				ladiv.style.visibility = "hidden";
				ladiv.style.display = "none";			 	
		 	}
		}catch(e){p_.arrojar(e," p_.ocultar"+ladiv.nodeName)}
	},
	mostrar: function(iddiv){
		try{
		 	var ladiv = p_.sel(iddiv);
		 	if(ladiv.nodeType==1){
				ladiv.style.visibility = "visible";
				var pos = p_.colloc.donde(ladiv,0);
				ladiv.style.display = (pos>-1 && p_.colloc[pos][1])?p_.colloc[pos][1]:"block";
			}
		}catch(e){p_.arrojar(e," p_.mostrar")}
	},
	// geometría
	geomet: function(elem,rapido){
		try{
			if(!rapido){
			 	elem = p_.sel(elem);
			 	var pL = parseInt(p_.estiloDe(elem,"padding-left")),
			 		mL = parseInt(p_.estiloDe(elem,"margin-left")),
			 		bL = parseInt(p_.estiloDe(elem,"border-left-width")),
			 		pT = parseInt(p_.estiloDe(elem,"padding-top")),
			 		mT = parseInt(p_.estiloDe(elem,"margin-top")),
			 		bT = parseInt(p_.estiloDe(elem,"border-top-width"));
		 	}
			var iW = elem.offsetWidth,
				iH = elem.offsetHeight,
				iLeft = 0, iTop = 0;
			if(!rapido){
				var innW = elem.clientWidth - pL - parseInt(p_.estiloDe(elem,"padding-right")),
					innH = elem.clientHeight - pT - parseInt(p_.estiloDe(elem,"padding-bottom")),
					ouW = iW + mL + parseInt(p_.estiloDe(elem,"margin-right")),
					ouH = iH + pT + parseInt(p_.estiloDe(elem,"margin-bottom")),
					innL, innT, ouL, ouT;
			}
			while(elem.offsetParent && elem.tagName.toUpperCase != "BODY") {
				iLeft += elem.offsetLeft;
				iTop += elem.offsetTop;
				elem = elem.offsetParent;        
			}
			if(!rapido){
				innL = iLeft + pL + bL;
				innT = iTop + pT + bT;
				ouL = iLeft - mL;
				ouT = iTop - mT;
				return {x:iLeft, y:iTop, w:iW, h:iH, iw:innW, ih:innH, 
					ow: ouW, oh: ouH, ix: innL, iy: innT, ox:ouL, oy:ouT};		
			}else{
				return {x:iLeft, y:iTop, w:iW, h:iH};		
			}
		}catch(e){p_.arrojar(e," p_.geomet")	}
	},
	moverA: function (elem, dnd,ref) {/* dnd: [x,y] || parentNode; 
										ref: childNode para insertBefore, ninguno append
									*/
		try{
			elem = p_.sel(elem);
			var rtrn = false;
		 	if(p_.es.Node(dnd)){
		 		if(ref && p_.es.Node(ref) && ref.parentNode == dnd){
		 			dnd.insertBefore(elem,ref);
		 		}else{
			 		dnd.appendChild(elem);		 		
		 		}
		 		rtrn = true;
			}else if(p_.es.Array(dnd)){
				var units = (parseInt(elem.style.left) == elem.style.left) ? 0:"px";
				if(elem.style.position!="absolute" && elem.style.position!="relative"){
					elem.style.position="absolute";
				}
				if(p_.es.Number(dnd[0])){elem.style.left = dnd[0] + units;}
				if(p_.es.Number(dnd[1])){elem.style.top = dnd[1] + units;}
				rtrn = true;
			}
			//p_.sel("aux4").innerHTML+="position:"+elem.style.position;
			return rtrn;
		}catch(e){p_.arrojar(e," p_.moverA")	}
	},
	aMedidas: function (elem,w,h){
		try{
			elem = p_.sel(elem);
			var units = (parseInt(elem.style.width) == elem.style.width) ? 0:"px";
			elem.style.width = w+units;
			elem.style.height = h+units;	
		}catch(e){p_.arrojar(e," p_.aMedidas")	}
	},
	pantalla: function(){
		var rtrn = {w:0,h:0,sT:0,sL:0};//w=ancho,h=alto,sT=scrol lArriba,sL=scroll Izquierda
		if (window.innerHeight) {
		    rtrn.h = window.innerHeight;
		    rtrn.w = window.innerWidth;
		} else if(document.body){
			rtrn.h = (document.body.parentElement)? document.body.parentElement.clientHeight: document.body.clientHeight;
			rtrn.w = (document.body.parentElement)? document.body.parentElement.clientWidth: document.body.clientWidth;
		}
		if (document.body && typeof document.body.scrollTop != "undefined") {
		    rtrn.sL += document.body.scrollLeft;
		    rtrn.sT += document.body.scrollTop;
		    if (document.body.parentNode && 
		        typeof document.body.parentNode.scrollTop != "undefined") {
		        rtrn.sL += document.body.parentNode.scrollLeft;
		        rtrn.sT += document.body.parentNode.scrollTop;
		    }
		} else if (typeof window.pageXOffset != "undefined") {
		    rtrn.sL += window.pageXOffset;
		    rtrn.sT += window.pageYOffset;
		}
		return rtrn;
	},
	centrar: function(elm){
		try{
			var pnt,g,x,y;
			elm = p_.sel(elm);
			g = p_.geomet(elm);
			pnt = p_.pantalla();
			x = Math.round(pnt.w/2-g.w/2)+pnt.sL;
			y = Math.round(pnt.h/2-g.h/2)+pnt.sT;
			p_.moverA(elm,[x,y]);
		}catch(e){p_.arrojar(e," p_.leerXML")}
	},
	rango: function(control){ // nofunca en MSIE 6, revisar
		control = p_.sel(control);
		var position = new Object();
		if (typeof(control.selectionStart) != 'undefined' && typeof(control.selectionEnd) != 'undefined' ){
		    position.start = control.selectionStart;
		    position.end = control.selectionEnd;
		}else{
		    var range = document.selection.createRange();
		    position.start = (range.offsetLeft - 1) / 7;
		    position.end = position.start + (range.text.length);
		}
		position.length = position.end - position.start;
		return position;
	},
	// ------- Para trabajar con estilos
	transformar: function(elm,tr){
		try{
			var spec = ['transform','WebkitTransform','MozTransform','msTransform','OTransform'];
			var rtrn = false;
			for(var i=0;i<spec.length;i++){
				if(elm.style[spec[i]]!="undefined"){
					elm.style[spec[i]] = tr;
					rtrn = true;
				}
			}
		}catch(e){p_.arrojar(e," p_.transformar")}
	},
	estiloDe: function(elm,r){
		try{
//	p_.arrojar({message:"elm.tipo:"+p_.tipo(elm)}," en p_.estiloDe") // problema al llamarlo desde colstl
			elm = p_.sel(elm);
			var rslt = "", g = r.indexOf("-");
			rcg = (g>-1)?r:r.replace(/([A-Z])/g, function(s,p1){return "-"+p1.toLowerCase();});
			rsg = (g==-1)?r:r.replace(/\-(\w)/g, function(s,p1){return p1.toUpperCase();});
			rslt = (document.defaultView && document.defaultView.getComputedStyle)?
					document.defaultView.getComputedStyle(elm, "").getPropertyValue(rcg):
					elm.currentStyle[rsg];
			return rslt;
		}catch(e){p_.arrojar(e," en p_.estiloDe ;"+p_.tipo(elm));}
	},
	ponClase:function(elm,cN){
		try{
			var rtrn = false, re;			
			elm = p_.sel(elm);
			if(!p_.es.String(cN)){ p_.arrojar({message:'parámetro cN inválido'},' debe ser String y es '+p_.tipo(cN))};
			re = new RegExp('\\b'+cN+'\\b','gi');
			if(!elm.className.match(re)){
				elm.className = (elm.className == '')? cN: elm.className += ' '+cN;
				rtrn = true;
			}
			return rtrn;
		}catch(e){p_.arrojar(e," en p_.ponClase ")};		
	},
	quitaClase:function(elm,cN){
		try{
			var rtrn = false, cln, re;
			elm = p_.sel(elm);
			if(!p_.es.String(cN)){ p_.arrojar({message:'parámetro cN inválido'},' debe ser String y es '+p_.tipo(cN))};
			re = new RegExp('\\s?\\b'+cN+'\\b','gi');
			cln = elm.className;
			elm.className = cln.replace(re,'');
			elm.className = elm.className.replace(/\s+/gi,' ');
			elm.className = elm.className.replace(/^\s|\s$/gi,'');;
			if(elm.className != cln){rtrn = true;};
		}catch(e){p_.arrojar(e," en p_.quitaClase ")};		
	},
	cambiaClase:function(elm,cNo,cNn){
		try{
			var rtrn = false, cn, re;
			elm = p_.sel(elm);
			if(!p_.es.String(cNo) || !p_.es.String(cNn)){ p_.arrojar({message:'parámetro cNo o cNn inválido'},'')};
			re = new RegExp('\\b'+cNo+'\\b','gi');
			cn = elm.className;
			elm.className = cn.replace(re, cNn);
			if(elm.className != cn){rtrn = true;};
			return rtrn;
		}catch(e){p_.arrojar(e," en p_.cambiaClase ")};	
	},
	// ------- Para trabajar con eventos
	objetivo: function (e){
		try{		
			e = (e)?e:((window.event)?window.event:null);
			if(e){
			 	var target = (e.target) ? e.target : e.srcElement;
				target = (target.nodeType == 3) ? target.parentNode : target;
			}else{target=null}
			return target;
		}catch(e){p_.arrojar(e," p_.objetivo")}	
	},
	coords: function(e) {
		try{
			var coo = {x:0, y:0};
			if (!e) var e = window.event;
			if (e.pageX || e.pageY) {
				coo.x = e.pageX;
				coo.y = e.pageY;
			} else if (e.clientX || e.clientY) {
				coo.x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
				coo.y = e.clientY + document.body.scrollTop - document.body.clientTop;
				if (document.body.parentElement && document.body.parentElement.clientLeft) {
				    var bodParent = document.body.parentElement;
				    coo.x += bodParent.scrollLeft - bodParent.clientLeft;
				    coo.y += bodParent.scrollTop - bodParent.clientTop;
				}
			}
			return coo;
		}catch(e){p_.arrojar(e," p_.coords")}				
	},
	ponEvento: function(ob,ev,fn,cap){
		try{
			var rtrn;
			if(ob){
				ev=ev.toLowerCase();
				if(ob.addEventListener) ob.addEventListener(ev,fn,cap);
				else if(ob.attachEvent) ob.attachEvent('on'+ev,fn);
				else {
					if(ob['on'+ev]){
						ob['on'+ev]=  function() { 
										ev();
										(typeof(ob['on'+ev]) == 'string')? eval(ob['on'+ev]) : ob['on'+ev](); };
					}else{
						ob['on'+ev]= ev
					}
				}
				rtrn = true;
			}else{
				rtrn = false;
			}
			return rtrn;
		}catch(e){p_.arrojar(e," p_.ponEvento");}

	},
	removerEvento: function (ob,ev,fn,cap){ // 	NO ESTÁ RESPONDIENDO, ERROR raro
		try{
			ob=p_.sel(ob);
			cap = cap||false;
			if(ob){
				ev=ev.toLowerCase();
				if(ob.removeEventListener){
					ob.removeEventListener(ev,fn,false);
		//alert('intenta con ev:'+fn.toSource())
				}else if(ob.detachEvent) {
					ob.detachEvent('on'+ev,fn);
				}else {
					ob['on'+ev]=false;
				};
			}else{
				return false;
			}	
		}catch(e){p_.arrojar(e," en p_.removerEvento")}
	},
	sinBurbuja: function(){
	},
	// tipos de datos
	es: {
		Null:function(a){
			return a===null;
		},
		Function:function(a){
			return Object.prototype.toString.call(a) == "[object Function]";
		},
		String:function(a){
			return Object.prototype.toString.call(a) == "[object String]";
		},
		Array:function(a){
			return Object.prototype.toString.call(a) == "[object Array]";
		},
		Boolean:function(a){
			return Object.prototype.toString.call(a) == "[object Boolean]";
		},
		Date:function(a){
			return Object.prototype.toString.call(a) == "[object Date]";
		},
		Number:function(a){
			return Object.prototype.toString.call(a) == "[object Number]";
		},
		RegExp:function(a){
			return Object.prototype.toString.call(a) == "[object RegExp]";
		},
		HTMLElement:function(a){	
			return (a && a.nodeType==1);
		},
		Node:function (a){
			return (a && p_.es.Number(a.nodeType));
		},
		NodeList: function(a){
			var result = Object.prototype.toString.call(a);
			if (typeof a === 'object' &&
				/^\[object (HTMLCollection|NodeList|Object)\]$/.test(result) &&
				typeof (a.length) == 'number' &&
				(a.length == 0 || a[0].nodeType > 0)) {
				return true;
			}
			return false;
		},
		Object:function(a){
			return Object.prototype.toString.call(a) == "[object Object]";
		}
	},
	tipo : function (a){
		for(var i in p_.es){
			if(p_.es[i](a)){
				return i.toLowerCase();
			}
		}
	},
	comparar: function(v1,v2,c){ /* v1 = valor 1 considerado el no controlable; v2 = valor 2, considerado el piloto;
							c = {'=': igual; '!=':distinto ; 'c' : contiene a; '!c': no contiene;
								'^c': contenido por; '!^c': no es contenido por; '<': menor que; '>': mayor que;
								'<=' : menor o igual; '>=': mayor o igual; '*': múltiplo; '/': divisor}
								*/
		try{
			var rtrn, comp, vl=false, tipo1, tipo2;
			tipo1 = p_.tipo(v1);
			tipo2 = p_.tipo(v2);
			c = c.toLowerCase() || '=';
			if(tipo1 == tipo2 && c=='='){
				rtrn = (v1==v2)?true:false;
			//alert(v1+" | "+v2)
			}else{
				c=(c=="≤")?"<=":c;
				c=(c=="≥")?">=":c;
				c=(c=="≠")?"!=":c;
				c=(c=="∋")?"c":c;
				c=(c=="∌")?"!c":c;
				c=(c=="∈")?"^c":c;
				c=(c=="∉")?"!^c":c;
				switch(tipo1){
					case "string":
						switch(tipo2){
							case "array":
								if(c=='^c'){
									rtrn = (v2.indice(v1) > (-1))?true:false;
									break;
								}
							case "object":
								if(c=='^c'){ // devuelve true si v1 es valor o atributo de v2;
									rtrn = (v2.indice(v1) > (-1))?true:((typeof(v2[v1])!="undefined")?true:false);
									break;
								}
							case "regexp":
								if(c=='c'){ // devuelve true si v1 encuentra en él la expresión v2;
									rtrn = (v1.match(v2).length)?true:false;
									break;
								}
							case "number": //
								if(c=="=" || c=="!=" || c=="<" || c==">" || c=="<=" || c==">="){
									rtrn = ((c=="=" && parseFloat(v1) == v2) || (c=="!=" && parseFloat(v1) != v2) ||
										(c=="<" && parseFloat(v1) < v2.length) || (c==">" && parseFloat(v1) > v2.length) ||
										(c=="<=" && parseFloat(v1) <= v2.length) || (c==">=" && parseFloat(v1) >= v2.length))?
										true:false;
									break;
								}
							default:
								v2 = (tipo2=='string')?v2:v2.toString();
								if((c=="=" && v1 == v2) || (c=="!=" && v1 != v2) ||
									(c=="<" && v1.length < v2.length) || (c==">" && v1.length > v2.length) ||
									(c=="<=" && v1.length <= v2.length) || (c==">=" && v1.length >= v2.length) ||
									(c=="c" && v1.indexOf(v2)>(-1)) || (c=="!c" && v1.indexOf(v2)==(-1)) ||
									(c=="^c" && v2.indexOf(v1)>(-1)) || (c=="!^c" && v2.indexOf(v1)==(-1))){
									rtrn = true;
								}else{
									rtrn = false;
								}
						}
						break;
					case "number":
						switch(tipo2){
							case "array":
								if(c=='^c'){
									rtrn = (v2.indice(v1) > (-1))?true:false;
									break;
								}else{
									v2 = v2.length;
									vl = true;							
								}
							case "object":
								if(c=='^c'){ // devuelve true si v1 es valor o atributo de v2;
									rtrn = (v2.indice(v1) > (-1))?true:((typeof(v2[v1])!="undefined")?true:false);
									break;
								}else{
									v2 = p_.atributos(v2).length;
									vl = true;
								}
							case "regexp":
								if(c=='c'){ // devuelve true si v1 como cadena encuentra en él la expresión v2;
									rtrn = (v1.toString().match(v2).length)?true:false;
									break;
								}
							case "string":
								if(c=="=" || c=="!=" || c=="<" || c==">" || c=="<=" || c==">="){
									rtrn = ((c=="=" && v1.toString() == v2) || (c=="!=" && v1.toString() != v2) ||
										(c=="<" && v1 < v2.length) || (c==">" && v1 > v2.length) ||
										(c=="<=" && v1 <= v2.length) || (c==">=" && v1 >= v2.length))?true:false;
									break;
								}else{
									v2 = parseFloat(v2);
									vl = true;
								}
							case "date":
								v2 = (vl)?v2:v2.getTime();
							default:
								rtrn = ((c=="=" && v1 == v2) || (c=="!=" && v1 != v2) ||
										(c=="<" && v1 < v2) || (c==">" && v1 > v2) ||
										(c=="<=" && v1 <= v2) || (c==">=" && v1 >= v2) ||
										(c=="c" && v1.toString().indexOf(v2.toString()) > -1) ||
										(c=="!c" && v1.toString().indexOf(v2.toString()) == -1) ||
										(c=="^c" && v2.toString().indexOf(v1.toString()) == -1) ||
										(c=="!^c" && v2.toString().indexOf(v1.toString()) == -1) ||
										(c=="*" && v1 % v2 == 0) || (c=="/" && v2 % v1 == 0))?true:false;
						}				
						break;
				}
			}
			return rtrn
		}catch(e){p_.arrojar(e," en p_.comparar");}
	},
	// Números y Cadenas
	aXHTML: function(el){
		var a, atr, val, x = '';
		try{
			if(p_.es.Node(el)){
				if(el.nodeType == 3){
					x += el.nodeValue.replace(/(\u00A0|<|>|&)/gi, function(str,p1){
						var r = {'\u00A0':'nbsp', '<':'lt', '>':'gt', '&': 'amp'};
						return '&'+r[p1]+';';
					});
				}else if(el.nodeType == 1){
					x += '<'+el.nodeName.toLowerCase();
					for(a = 0; a < el.attributes.length; a++){
						atr = el.attributes[a].nodeName.toLowerCase()
						val = (atr != 'style')? el.attributes[a].nodeValue : 
							((el.style.cssText)? el.style.cssText.toLowerCase():'');
						if(val !== ''){ x += ' '+atr+':"'+val+'"'; }
					}
					if(p_.cerrados[el.tagName]){
						x += ' /'+'>';
					}else{
						x += '>';
						for(a = 0; a < el.childNodes.length; a++){
							x += p_.aXHTML(el.childNodes[a]);
						}
						x += '</'+el.nodeName.toLowerCase()+'>';
					}
				}	
			}
			return x;
		}catch(e){p_.arrojar(e," en p_.aXHTML");}
	},

	explotar: function(str,dv){// divide str sucesivamente por las cadenas de la matriz dv
		var i=0;
		str = str.split(dv[0]);
		if(dv.length>1){
			dv.shift();
			for(i=0; i<str.length;i++){
				str[i] = p_.explotar(str[i],dv);
			}
		}
		return str;
	},
	aNum: function(n){
		return (parseFloat(n).toString()==n.toString())?parseFloat(n):null;	
	},
	serializar : function(ob,l,s){ /* l= limitador, predeterminado '' [opcional];
											s= separador, predeterminado ninguno, ej: "\n" [opcional] */
		var rtrn ,i=0,a;
		l = (typeof(l)==undefined)?"'":l;	
		s = (typeof(s)==undefined)?"_":s;
		if(p_.es.Number(ob) || p_.es.Boolean(ob)){
			rtrn = ob;
		}else if(p_.es.String(ob)){
			rtrn = l+ob+l;
		}else if(p_.es.Object(ob)){
			rtrn = "{";
			for(a in ob){
				rtrn += (i)?","+s:"";
				rtrn += l+a+l+":"+p_.serializar(ob[a],l,s);
				i=1;
			}
			rtrn += "}";
		}else if(p_.es.Array(ob)){
			rtrn = "[";
			for(i=0;i<ob.length;i++){
				rtrn += (i)?","+s:"";
				rtrn += p_.serializar(ob[i],l,s);
			}
			rtrn += "]";
	
		}else{
			rtrn += ob.toString();		
		}
		return rtrn;
	},
	idunico: function(ext){ // ext: largo del ID
		var i,str="", chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
		for(i=0;i<ext;i++){
			str += chars.substr(Math.random()*62, 1);
		}
		return str;
	},
	convertirA: function(val,un){
		un = un || 'px';
		switch(un){
			case 'px':
				break;
		}
	},
	
	// ---------------- Matrices y objetos
	atributos: function(o){
		try{
			var rtrn = [];
			o = (p_.es.Object(o))?o:p_.sel(o);
			if(o){
				for(var i in o){
					rtrn[rtrn.length] = i;
				}			
			}
			return rtrn;
		}catch(e){ p_.arrojar(e," en p_.atributos");}
	},
	// ---------------- Expresiones Regulares
	regQuote: function (str, delimiter) {
		 // version: 1107.2516
		// discuss at: http://phpjs.org/functions/preg_quote    // +   original by: booeyOH
		 return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
    },
    // Errores
    arrojar: function(e,msg){
    	var m = (e.message) ? e.message : e.description;
    	var err = new Error(m+msg);
        if (!err.message) {err.message = msg;}
        throw err;
    }
}

m_ = function(avisador,lng){ /* clase maestra para administrar frases multi idioma, trazar avisos
						*/
	this.avisador = (avisador)?(p_.es.Node(avisador)?avisador:document.getElementById(avisador)):false;
	this.avisar = function(msj){
		if(this.avisador){
			msj = p_.nodo("div",this.avisador,false,msj);
		}
		return true;
	}
	this.cargalng = function(){
	
	}
	this.fras = function(str){
	
	}
	this.error = function(e,fn){
	/*
		var msg;
		for(var a in e){
			msg+= a+":"+e[a].toString()+". ";
		}*/
		this.avisar(e.message+": "+fn);
		// lo óptimo es poner archivo, línea, función y mensaje
	}
}


