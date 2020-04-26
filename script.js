var pagActual = '';
var valorIndex = '';
var numIndex = '';
var valorPags = '';
var numPags = '';
var contra1 = '';
var contra2 = '';
var totalArticulos = 0;
var fotoArticulo = 1; 
var numfoto = 0;


var permiteRegistro = true;
var usuarioDisponible = false;
var imagenAceptada = false;

//Cuenta todos los Articulos
function contadorArticulo(){
  let xhr = new XMLHttpRequest();
  let url = 'api/articulos';
      totalArticulos = 0;

  xhr.open('GET', url, true);
  xhr.onload=function(){
    //console.log(xhr.responseText);
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      totalArticulos = r.FILAS.length;
      console.log("Articulos: "+ totalArticulos);
    }
  };
  xhr.send();
}

//Mensaje emergente (mensajes modales) al hacer login
function mensajeModal(html){//El contenido que recibes sy que mostrarás en el mensaje modal
  //Primero una capa semitransparente para bloquear todo lo que no sea la capa del mensaje, con css le ponemos color y demás
  let we = document.createElement('div');
  //div.id = 'capa-fondo';
  we.setAttribute('id','capa-fondo');
  we.innerHTML = html;//La variable recibida por parámetro

  //document.body.appendChild(we);
  document.querySelector('body').appendChild(we);
}

//En funcion del valor que recibes, te envia a index, refresca o tal
/* Valor
0: refrescar
1: lleva a index
*/
function cerrarMensajeModal(valor){
  document.querySelector('#capa-fondo').remove();
  if(valor == 0){
    window.location.reload();
  }else if(valor == 1){
    window.location.href="index.html";
  }else if (valor == 2) {
    window.location.href="login.html";
  }
}

function cerrarMensajeModal2(valor){
  document.querySelector('#capa-fondo').remove();
  if(valor == 0){
    accesoArticulo();
    
  }else if(valor == 1){
    accesoArticulo();
    document.getElementById("texto").focus();
  }
}


//Aqui pillamos las categorias y las metemos en el datalist a la hora de subir un nuevo articulos
function getCategorias(){
  //document.querySelector('#categories').innerHTML = html;
  let url = 'api/categorias';

  fetch(url).then(function(respuesta){
    if(respuesta.ok){
      respuesta.json().then(function(datos){
        console.log(datos);
        if(datos.RESULTADO == 'OK'){
          let html = '';
          datos.FILAS.forEach(function(e){
            //console.log(e.nombre);
            html+=`<option value="${e.nombre}">`;
          });
          document.querySelector('#categories').innerHTML = html;
        }else{
          console.log('ERROR: '+ datos.DESCRIPCION);
        }
      });
    }else{
      console.log("Error en la peticion fetch");
    }
  });
}

//Para el precio del nuevo articulo, que tenga 2 dosDecimales
function dosDecimales(valor){
  valor = parseFloat(valor).toFixed(2);
  document.querySelector('#Price').value = valor;
}

//comprueba el tamaño de la foto
function compruebaTamaño(id){
  let file = document.getElementById('cargarFoto'+id);
  if(file.files.length > 0){
    for(let i = 0; i < file.files.length ;i++){
      fsize = file.files.item(i).size;
      console.log(fsize);
      size = fsize/1024;
      size = size.toFixed(2);
      console.log(size);
      if(size>300){
        imagenAceptada = false;
        let html= '';
        html += '<article>';
        html += '<h2>Error al eleccionar archivo</h2>';
        html += '<p>La imagen seleccionada pesa demasiado. Por favor, seleccione otra';
        html += '<footer><button onclick = "cerrarMensajeModal(-1);">Acceder</button>';
        html += '</article>';
        mensajeModal(html);
      }else{
        imagenAceptada = true;
      }
    }
  }
}

function cargarPreguntas(id_art){
  if(sessionStorage['usuario']){
    let xhr = new XMLHttpRequest(),
    url = 'api/articulos/' +id_art+ '/preguntas';
    sesion = JSON.parse(sessionStorage['usuario']),
    autorizacion = sesion.login+':'+sesion.token;
    xhr.open('GET',url,true);
    xhr.onload = function(){
      let r = JSON.parse(xhr.responseText);
      if(r.RESULTADO == 'OK'){
        let html = '';
        r.FILAS.forEach(function(e){
          console.log(e);
          html+=`<time datetime="${e.fecha_hora}">Fecha de publicaci&oacute;n:${e.fecha_hora}</time>`
          html+=`<p><a href="buscar.html?${e.login}"> <img src="fotos/usuarios/${e.foto_usuario}" width="40" height="40" alt="imagen_usuario"> ${e.login}</a>: ${e.pregunta}</p>`
          
            
            
          if(e.respuesta!=null){
            html+=`<p>Respuesta: ${e.respuesta}</p>`
          }else{
            let esta=false;

            
            let url2='api/articulos/' +id_art;
            fetch(url2).then(function(respuesta2){
              if(respuesta2.ok){
                respuesta2.json().then(function(datos2){
                  if(datos2.RESULTADO == 'OK'){
                      if(datos2.FILAS[0].vendedor==sesion.login){
                        esta=true;
                          if(esta){
                          console.log("hola");
                          //botonResponder(id_art);
                          html+=`<button onclick="responderPregunta(${id_art})" type="button">Responder pregunta</button>`;
                          }
                      }
          
          
                  }else{
                    console.log('ERROR: '+ datos2.DESCRIPCION);
                  }
                  
                });
              }else{
                console.log("Error en la peticion fetch");
              }
            }
            ); 




            
          }


        });
        document.querySelector('#preguntas').innerHTML = html;
        
      }else{
        console.log('ERROR: '+ datos.DESCRIPCION);
      }
    };
    xhr.setRequestHeader('Authorization',autorizacion);
    xhr.send();
  }
  else{
    let url='api/articulos/' +id_art+ '/preguntas';
    fetch(url).then(function(respuesta){
      if(respuesta.ok){
        respuesta.json().then(function(datos){
          console.log(datos);
          if(datos.RESULTADO == 'OK'){
            let html = '';
            datos.FILAS.forEach(function(e){
              console.log(e);
              html+=`<time datetime="${e.fecha_hora}">Fecha de publicaci&oacute;n:${e.fecha_hora}</time>`
              html+=`<p><a href="buscar.html?${e.login}"> <img src="fotos/usuarios/${e.foto_usuario}" width="40" height="40" alt="imagen_usuario"> ${e.login}</a>: ${e.pregunta}</p>`
              
                
                
              if(e.respuesta!=null){
                html+=`<p>Respuesta: ${e.respuesta}</p>`
              }
            }
            );
            document.querySelector('#preguntas').innerHTML = html;

          }else{
            console.log('ERROR: '+ datos.DESCRIPCION);
          }
        });
      }else{
        console.log("Error en la peticion fetch");
      }
    }
    ); 
  }
}

function botonResponder(id_art){
  console.log(id_art);
  
  let html=`<button onclick="responderPregunta(${id_art})" type="button">Responder pregunta</button>`;
  document.querySelector('#responder').innerHTML = html;
}

function responderPregunta(id_art){
    console.log(id_art);
}




//Comprueba que no se intente acceder a la pagina articulo sin id 
function accesoArticulo(){
  let url = document.URL;
  let trozos = url.split("?");
  if(trozos[1]==""){
    window.location.href = "index.html";
  }else{
      pedirInfoArticulo(trozos[1]);
      cargarPreguntas(trozos[1]);
  }
}

function pedirInfoArticulo(id_art){
  fotoArticulo=1;
  if(sessionStorage['usuario']){
    let xhr = new XMLHttpRequest(),
    url = 'api/articulos/' +id_art,
    sesion = JSON.parse(sessionStorage['usuario']),
    autorizacion = sesion.login+':'+sesion.token;

    xhr.open('GET',url,true);
    xhr.onload = function(){
      let r = JSON.parse(xhr.responseText);
      if(r.RESULTADO == 'OK'){
        
        let html = '';
        r.FILAS.forEach(function(e){
          console.log(e);
          getFoto(e.id);
          pasaFotos(e.id);
          html+=`<h2>${e.nombre}</h2>`
          html+=`<div id="fotos_art"><br></div>`
          html+=`<div id="bot_fotos"><br></div>`
          html+=`Precio: ${e.precio}€  Vendedor:<a href="buscar.html?${e.vendedor}"><img src="fotos/usuarios/${e.foto_vendedor}" width="40" height="40" alt="imagen_vendedor">${e.vendedor}</a>`
          html+=`<p>${e.descripcion}</p>`
          html+=`<span class="icon-eye">${e.veces_visto}</span> <span class="icon-heart"> ${e.nsiguiendo}</span><a href="#SeccionComent"><span class="icon-comment"> ${e.npreguntas}</a></span>`
          ponerBoton(e.id);
          html+=`<div id="boton"><br></div>`



        });
        document.querySelector('#articulo').innerHTML = html;
        
      }else{
        console.log('ERROR: '+ datos.DESCRIPCION);
      }
    };
    xhr.setRequestHeader('Authorization',autorizacion);
    xhr.send();
  }
  else{
    let url='api/articulos/' +id_art;
    fetch(url).then(function(respuesta){
      if(respuesta.ok){
        respuesta.json().then(function(datos){
          console.log(datos);
          if(datos.RESULTADO == 'OK'){
            let html = '';
            datos.FILAS.forEach(function(e){
              console.log(e);
              getFoto(e.id);
              pasaFotos(e.id);
              html+=`<h2>${e.nombre}</h2>`
              html+=`<div id="fotos_art"><br></div>`
              html+=`<div id="bot_fotos"><br></div>`
              html+=`Precio: ${e.precio}€  Vendedor:<a href="buscar.html?${e.vendedor}"><img src="fotos/usuarios/${e.foto_vendedor}" width="40" height="40" alt="imagen_vendedor">${e.vendedor}</a>`
              html+=`<p>${e.descripcion}</p>`
              html+=`<span class="icon-eye">${e.veces_visto}</span> <span class="icon-heart"> ${e.nsiguiendo}</span><a href="#SeccionComent"><span class="icon-comment"> ${e.npreguntas}</a></span>`
              
            }
            );
            document.querySelector('#articulo').innerHTML = html;

          }else{
            console.log('ERROR: '+ datos.DESCRIPCION);
          }
        });
      }else{
        console.log("Error en la peticion fetch");
      }
    }
    ); 
  }
  
}

//Imprime los botones del carrusel cada vez que se pasa la pagina

function pasaFotos(id_art){

  let xhr = new XMLHttpRequest(),
  url = 'api/articulos/' +id_art;

  xhr.open('GET',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    if(r.RESULTADO == 'OK'){
      
      let html = '';
      r.FILAS.forEach(function(e){
        
        html+=`<button onclick="fotoAnterior(${e.nfotos}, ${e.id})">Anterior</button>${fotoArticulo}/${e.nfotos}<button onclick="fotoSigiente(${e.nfotos}, ${e.id})">Siguiente</button>`
        
        
        
      });
      document.querySelector('#bot_fotos').innerHTML = html;
    }
  };
  xhr.send();

}

//Pone el boton de seguir o no cuando el usuario esta logeado

function ponerBoton(id_art){
  let xhr = new XMLHttpRequest(),
  url = 'api/articulos/' +id_art;
  sesion = JSON.parse(sessionStorage['usuario']),
  autorizacion = sesion.login+':'+sesion.token;
  xhr.open('GET',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    if(r.RESULTADO == 'OK'){
      
      let html = '';
      r.FILAS.forEach(function(e){
        if(e.estoy_siguiendo==1){
          html+=`<button onclick="cambiarBotonFalse(${id_art})" type="button" name="seguir/no">Dejar de seguir artículo</button>`
        }

        if(e.estoy_siguiendo==0){
          html+=`<button onclick="cambiarBotonTrue(${id_art})" type="button" name="seguir/no">Seguir este artículo</button>`
        }
        
       
      });
      document.querySelector('#boton').innerHTML = html;
    }
  };
  xhr.setRequestHeader('Authorization',autorizacion);
  xhr.send();
}

//Cambia el boton de no siguiendo a siguiendo

function cambiarBotonTrue(id_art){
  let xhr = new XMLHttpRequest();
  url = 'api/articulos/' +id_art+'/seguir/true';
  sesion = JSON.parse(sessionStorage['usuario']);
  autorizacion = sesion.login+':'+sesion.token;

  xhr.open('POST',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      ponerBoton(id_art);
    }
  };
  xhr.setRequestHeader('Authorization',autorizacion);
  xhr.send();
}

//cambia el boton de Siguiendo a no siguiendo

function cambiarBotonFalse(id_art){
  let xhr = new XMLHttpRequest();
  url = 'api/articulos/' +id_art+'/seguir/false';
  sesion = JSON.parse(sessionStorage['usuario']);
  autorizacion = sesion.login+':'+sesion.token;
  console.log(JSON.parse(sessionStorage['usuario']));

  xhr.open('POST',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    if(r.RESULTADO == 'OK'){
      ponerBoton(id_art);
    }
  };
  xhr.setRequestHeader('Authorization',autorizacion);
  xhr.send();
}

//Cambia la foto a la anterior si hay 
function fotoAnterior(num_art, id_art){
  if(fotoArticulo>1){
    fotoArticulo--;
    getFoto(id_art);
    pasaFotos(id_art);
  }
}

//Cambia la foto a la siguente si hay 
function fotoSigiente(num_art, id_art){
  if(fotoArticulo<num_art){
    fotoArticulo++;
    getFoto(id_art);
    pasaFotos(id_art);
  }
}


//Pasa la foto que se le pide que mueste en el carrusel a la info
function getFoto(id_art){
  let xhr = new XMLHttpRequest(),
  url = 'api/articulos/' +id_art+ '/fotos';

  xhr.open('GET',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    if(r.RESULTADO == 'OK'){
      contador=1;
      let html = '';
      r.FILAS.forEach(function(e){
        if(contador==fotoArticulo){
          console.log(e);
          html+=`<img src="fotos/articulos/${e.fichero}" width="300" height="300" alt="imagen ${e.id}">`
        }
        contador++;
       
      });
      document.querySelector('#fotos_art').innerHTML = html;
    }
  };
  xhr.send();
}


function enviarPregunta(frm){
  let id_art="";
  let url2 = document.URL;
  let trozos = url2.split("?");
  
  id_art=trozos[1];
  
  


  let url = 'api/articulos/'+ id_art+'/pregunta';
  fd = new FormData(frm);
  sesion = JSON.parse(sessionStorage['usuario']),
  autorizacion = sesion.login+':'+sesion.token;

  fetch(url,{method:'POST',body:fd,headers:{'Authorization':autorizacion}}).then(function(respuesta){
    if (respuesta.ok) {
      respuesta.json().then(function(datos){
        console.log(datos);
        document.getElementById("formPre"). reset();
        let html = '';
        html += '<article>';
        html += '<h2>Pregunta enviada correctamente</h2>';
        //html += '<p>La operación de login se ha realizado correctamente';
        html += '<p>La pregunta que se ha hecho ha quedado correctamente registrada';
        html += '<footer><button onclick = "cerrarMensajeModal2(0)";>Cerrar</button>';
        html += '</article>';
        
        mensajeModal(html);
      });
    }else {
      //Respuesta incorrecta
      
      console.log('Error en la peticion fetch');
      let html = '';
      html += '<article>';
      html += '<h2>Error al enviar pregunta</h2>';
      //html += '<p>La operación de login se ha realizado correctamente';
      html += '<p>No se ha podido registrar correctamente la pregunta. Por favor, vuelva a intentarlo';
      html += '<footer><button onclick = "cerrarMensajeModal2(1);">Cerrar</button>';
      html += '</article>';
      mensajeModal(html);
      
    accesoArticulo();
    document.getElementById("texto").focus();
    }
  });

  return false;
}



//Carga la imagen en pantalla
function previewImagen(input,id){
  if(imagenAceptada == true){
    var reader = new FileReader();

    reader.onload = function(e){
      document.getElementById('foto'+id).src =  e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}

//Elimina la foto, resetea a un valor estandar
function resetFoto(id){
  document.getElementById('foto'+id).src = "media/default2.png";
  imagenAceptada = false;
}

//Para subir una segunda fotografía
function subirOtraFotografia(){
  imagenAceptada = false;
  let html = '';
  /*
  <img src="media/default2.png" id="Fotos" alt="foto del artículo" height="150" width="200"><br>
  <input type="button" name="bFotoS" onclick="subirOtraFotografia();" value="Añadir foto" >
  <input type="button" onclick="resetFoto();" name="bFotoE" value="Eliminar foto" >
  <label id="botoneable" for="fotaka">Cargar Foto</label>
  <br>
  <input type="file" onchange="compruebaTamaño(); previewImagen(this);" name="Fotito" id="fotaka" accept="image/*"><br>
  */
  numfoto++;
  let idfotos = "foto"+numfoto;
  console.log(idfotos);
  html+='<img src="media/default2.png" id="foto'+numfoto+'" alt="foto del artículo" height="150" width="200"><br>';
  html+='<input type="button" name="NuevaFoto'+numfoto+'" onclick="subirOtraFotografia();" value="Añadir foto" >';
  html+='<input type="button" onclick="resetFoto('+numfoto+');" name="QuitarFoto'+numfoto+'" value="Eliminar foto" >';
  html+='<label id="botoneable" for="cargarFoto'+numfoto+'">Cargar Foto</label><br>';
  html+='<input type="file" onchange="compruebaTamaño('+numfoto+'); previewImagen(this,'+numfoto+');" name="hola'+numfoto+'" id="cargarFoto'+numfoto+'" accept="image/*"><br>';
  document.querySelector('#fotosArticulo').innerHTML = document.querySelector('#fotosArticulo').innerHTML + html;
  let idInput = "cargarFoto"+numfoto;
  console.log(idInput);
  document.getElementById(idInput).setAttribute("style","display: none;");
}

//Obvio, aqui se llama cuando se sube un articulo
function subirArticulo(frm){
  if(imagenAceptada == true){
    let url = 'api/articulos',
    fd = new FormData(frm),
    sesion = JSON.parse(sessionStorage['usuario']),
    autorizacion = sesion.login+':'+sesion.token;

    fetch(url,
      {method:'POST',
      body:fd,
      headers:{'Authorization':autorizacion}}).then(function(respuesta){
        //console.log(respuesta);
        if(respuesta.ok){
          respuesta.json().then(function(datos){
            //console.log(datos.ID);
            if(imagenAceptada == true){
              let contadorFotos = 0;
              let urlf = 'api/articulos/'+datos.ID+'/foto';
              while(contadorFotos < numfoto && imagenAceptada == true){
                let variable = contadorFotos+1;
                /*for(var pair of fd.entries()) {
                  console.log(pair[0]+ ', '+ pair[1]);
                }*/
                console.log("hola:");
                console.log(fd.get('hola'+variable));
                fd.set('fichero',fd.get('hola'+variable));
                console.log("fichero");
                console.log(fd.get('fichero'));
                /*
                console.log("Antes y despues");
                console.log(document.getElementById('cargarFoto'+variable));
                document.getElementById('cargarFoto'+variable).setAttribute("name","fichero");
                console.log(document.getElementById('cargarFoto'+variable));*/
                contadorFotos++;
                fetch(urlf,
                  {method:'POST',
                  body:fd,
                  headers:{'Authorization':autorizacion}}).then(function(respuesta2){
                    console.log(respuesta2);
                    if(respuesta2.ok){
                      respuesta2.json().then(function(datos2){
                        console.log("datos2");
                        console.log(datos2);

                      });
                    }else{
                      imagenAceptada = false;
                    }
                  });
                  //fd.delete('fichero');
              }
              //Aqui elmensaje modal
              let html = '';
              html += '<article>';
              html += '<h2>Articulo subido correctamente</h2>';
              html += '<p>Se ha guardado el articulo correctamente';
              html += '<footer><button onclick = "cerrarMensajeModal(1);">Acceder</button>';
              html += '</article>';
              mensajeModal(html);
            }
          });
        }else{
          console.log("Error en la peticion fetch");
        }
    });
  }
  return false;
}

//Borra sessionStorage y te lleva a Index, ez gg
function hacerLogout(){
  let xhr = new XMLHttpRequest(),
  url = 'api/usuarios/logout',
  sesion = JSON.parse(sessionStorage['usuario']),
  autorizacion = sesion.login+':'+sesion.token;
  console.log(JSON.parse(sessionStorage['usuario']));

  xhr.open('POST',url,true);
  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r.RESULTADO);
    if(r.RESULTADO == 'OK'){
      sessionStorage.removeItem('usuario');
      window.location.href="index.html";
    }
  };
  xhr.setRequestHeader('Authorization',autorizacion);
  xhr.send();
}

//Metodo para saber la pagina en la que estas actualmente
function paginaActual(){
  let url = document.URL
  console.log("La URL es " + url);
  let trozos = url.split("/");
  pagActual = '';
  for(var i = 0;i<trozos.length;i++){
    //console.log("Trozos:"+trozos[i]);
    if(trozos[i] == "acerca.html"||trozos[i] == "articulo.html"||trozos[i] == "buscar.html"||trozos[i] == "index.html"||trozos[i] == "login.html"||trozos[i] == "nuevo.html"||trozos[i] == "registro.html"){
      pagActual = trozos[i];
      break;
    }else{
      pagActual = "index.html";
    }
  }
}

//Esta funcion comprueba si hay algun usuario logueado y muestra el avegador en funcion de ello
function MenuLogin(){
  paginaActual();
  if(sessionStorage['usuario']){
    //console.log("Hay usuario registrado");
    console.log("Esta en la página " + pagActual);
    //console.log("El usuario es "+sessionStorage['usuario']);
    let html = '';
    if(pagActual!="index.html"){
      html+='<li><a href="index.html"><span class="icon-home"></span><span class="textop">Página principal</span></a></li>';
    }
    if(pagActual!="nuevo.html"){
      html+='<li><a href="nuevo.html"><span class="icon-doc-add"></span><span class="textop">Nuevo artículo</span></a></li>';
    }
    html+='<li><a onclick="hacerLogout();"><span class="icon-logout"></span><span class="textop">';
    html+='Logout ('+JSON.parse(sessionStorage['usuario']).login+")";
    html+='</span></a></li>';

    if(pagActual!="buscar.html"){
      html+='<li><a href="buscar.html"><span class="icon-search"></span><span class="textop">Buscar</span></a></li>';
      html+='<li><form action="/buscar.html"><input type="text" placeholder="Busqueda rápida"></form></li>';
    }
    document.querySelector('#navegacion').innerHTML=html;
  }
  if(sessionStorage.length == 0){//No tiene ningun usuario
    console.log("Ningun usuario registrado");
    console.log("Esta en la página " + pagActual);
    //Ahora mostramos el navegador
    let html = '';
    if(pagActual!="index.html"){
      html+='<li><a href="index.html"><span class="icon-home"></span><span class="textop">Página principal</span></a></li>';
    }
    if(pagActual!="login.html"){
      html+='<li><a href="login.html"><span class="icon-login"></span><span class="textop">Login</span></a></li>';
    }
    if(pagActual!="registro.html"){
      html+='<li><a href="registro.html"><span class="icon-user-plus"></span><span class="textop">Registro</span></a></li>';
    }
    if(pagActual!="buscar.html"){
      html+='<li><a href="buscar.html"><span class="icon-search"></span><span class="textop">Buscar</span></a></li>';
      html+='<li><form action="buscar.html"><input type="text"  placeholder="Busqueda rápida"></form></li>';
    }
    document.querySelector('#navegacion').innerHTML=html;
    /*
    <ul class="lista-menu">
      <!--li para definir cada elemento de la lista-->
      <!--<li><a href="index.html"><span class="icon-home"></span><span class="textop">Página principal</span></a></li>
      <li><a href="buscar.html"><span class="icon-search"></span><span class="textop">Buscar</span></a></li>
      <li><a href="nuevo.html"><span class="icon-doc-add"></span><span class="textop">Nuevo artículo</span></a></li>
      <li><a href="index.html"><span class="icon-logout"></span><span class="textop">Logout</span></a></li>
      <li><a href="login.html"><span class="icon-login"></span><span class="textop">Login</span></a></li>
      <li><a href="registro.html"><span class="icon-user-plus"></span><span class="textop">Registro</span></a></li>
      <li><form action="/buscar.html">
      <input type="text" placeholder="Busqueda rápida">
    </form></li>-->
    </ul>
    */

  }
}

//Aqui comprobamos que no puedas acceder a determinadas paginas
function comprobarAcceso(){
  //Primero sabemos en que página estamos
  paginaActual();
  if(sessionStorage['usuario']){
    if(pagActual == "login.html" || pagActual == "registro.html"){
      window.location.href = "index.html";
    }
  }else if(sessionStorage.length == 0){
    if(pagActual == "nuevo.html"){
      window.location.href = "index.html";
    }
  }
}

//FUNCAAAAAAAA
function mostrarArticulos(pagina){
  //let xhr = new XMLHttpRequest(),
  let url = 'api/articulos?pag='+pagina+'&lpag=2';
  valorIndex = pagina;
  numIndex = pagina+1;

  fetch(url).then(function(respuesta){
    if(respuesta.ok){
      respuesta.json().then(function(datos){
        console.log(datos);
        if(datos.RESULTADO == 'OK'){
          let html = '';
          datos.FILAS.forEach(function(e){
            /*console.log(e);
            console.log(e.nombre);*/
            html+='<article class="columna">';
            html+=`<a href="articulo.html?${e.id}" lang="en"><h3>${e.nombre}</h3></a>`;
            html+=`<a href="articulo.html?${e.id}"><img src="fotos/articulos/${e.imagen}" alt="imagen_articulo"></a>`;
            html+=`<br>Precio: ${e.precio}€ <span class="icon-picture">${e.nfotos}</span> <span class="icon-eye">${e.veces_visto}</span><span class="icon-heart">${e.nsiguiendo}</span>`;
            html+=`<p>${e.descripcion}</p>`;
            html+='</article>';
          });
          document.querySelector('#articulos').innerHTML = html;
        }else{
          console.log('ERROR: '+ datos.DESCRIPCION);
        }
      });
    }else{
      console.log("Error en la peticion fetch");
    }
  });

  /*xhr.open('GET', url, true);
  xhr.onload=function(){
    console.log(xhr.responseText);
    let r = JSON.parse(xhr.responseText);
    console.log(r);
  };
  xhr.send();*/
}

//YA FUNCAAAAAAAA
//Bueno esto es para hacer el login
function hacerLogin(frm){
  let url = 'api/usuarios/login',
  fd = new FormData(frm);

  fetch(url,{method:'POST',body:fd}).then(function(respuesta){
    if (respuesta.ok) {
      respuesta.json().then(function(datos){
        console.log(datos);
        console.log(JSON.stringify(datos));
        sessionStorage['usuario'] = JSON.stringify(datos);

        let html = '';
        html += '<article>';
        html += '<h2>Sesión iniciada correctamente</h2>';
        //html += '<p>La operación de login se ha realizado correctamente';
        html += '<p>Los datos introducidos son correctos';
        html += '<footer><button onclick = "cerrarMensajeModal(1)" >Acceder</button>';
        html += '</article>';
        mensajeModal(html);
      });
    }else {
      //Respuesta incorrecta
      console.log('Error en la peticion fetch');
      let html = '';
      html += '<article>';
      html += '<h2>Error en el inicio de sesión</h2>';
      //html += '<p>La operación de login se ha realizado correctamente';
      html += '<p>Ha ocurrido un error al iniciar sesión. Por favor, vuelva a intentarlo';
      html += '<footer><button onclick = "cerrarMensajeModal(0);">Aceptar</button>';
      html += '</article>';
      mensajeModal(html);
    }
  });

  return false;
}

//Mira ya no sé que estoy haciendo
function limpiarMensaje(id){
  let html = '';
  document.querySelector('#'+id+'').innerHTML = html;
}

//Método que comprueba si el nombre de usuario esta disponible
function comprobarNomUsu(nom){
  let xhr = new XMLHttpRequest(),
      url = 'api/usuarios/'+nom;


  xhr.open('GET', url , true);

  xhr.onload = function(){
    let r = JSON.parse(xhr.responseText);
    console.log(r);
    console.log(r.DISPONIBLE);
    usuarioDisponible = r.DISPONIBLE
    //console.log("usuarioDisponible: "+usuarioDisponible);
  };
  xhr.send();

  console.log(nom);
  if(usuarioDisponible == true){
    permiteRegistro = true;
  }
  else{
    permiteRegistro = false;
    let html = '';
    html+='<p>El nombre de usuario no está disponible.</p>';
    document.querySelector('#login-incorrecto').innerHTML = html;
  }
}

//comprobamos que ambas contraseñas coinciden
function coincideContra(){
  console.log("contra1: "+contra1);
  console.log("contra2: "+contra2);
  if(contra1 != '' && contra2 != ''){
    console.log("valor: "+contra1.localeCompare(contra2));
    if(contra1.localeCompare(contra2) != 0){//incorrecto
        permiteRegistro = false;
        let html = '';
        html+='<p>Las contraseñas introducidas no coinciden.</p>';
        document.querySelector('#contraseñas-incorrectas').innerHTML = html;
    }else{
      permiteRegistro = true;
    }
  }
}

//Hace falta que diga lo que hace??
function hacerRegistro(frm){
  let fd = new FormData(frm),
  url = 'api/usuarios/registro';

  console.log(permiteRegistro);
  if(permiteRegistro == true){
    fetch(url,{method:'POST',body:fd}).then(function(respuesta){
      if(respuesta.ok){
        respuesta.json().then(function(datos){
          console.log("Registro: ");
          console.log(datos);
          document.getElementById("formRegistro").reset();
          let html = '';
          html += '<article>';
          html += '<h2>Registro correcto</h2>';
          //html += '<p>La operación de login se ha realizado correctamente';
          html += '<p>Los datos introducidos son correctos y el registro se ha efectuado correctamente.</p>';
          html += '<footer><button onclick = "cerrarMensajeModal(2);">Aceptar</button>';
          html += '</article>';
          mensajeModal(html);
        });
      }
    });

  }else{//permiteRegistro == false
    let html = '';
    html += '<article>';
    html += '<h2>Error en el registro</h2>';
    //html += '<p>La operación de login se ha realizado correctamente';
    html += '<p>Los datos introducidos no son correctos para efectuar el registro.Por favor, vuelva a intentarlo.</p>';
    html += '<footer><button onclick = "cerrarMensajeModal(0);">Aceptar</button>';
    html += '</article>';
    mensajeModal(html);
  }
  return false;
}

//Para cambiar de página en el index, y mostrar otros articulos
function cambiarPagina(caso){
  /* casos
  0: Ir a la primera página
  1: Retroceder una página
  2: Avanzar una página
  3: Ir a la última página
  */
  //Comprobamos que puedas cambiar de página
  switch(caso){
    case 0:
      if(valorIndex>0){
        mostrarArticulos(0);
        numIndex = 1;
        hacerBotonera();
      }
      break;

    case 1:
    if(valorIndex>0){
      mostrarArticulos(valorIndex-1);
      hacerBotonera();
    }
      break;

    case 2:
      if(valorIndex<valorPags){
        mostrarArticulos(valorIndex+1);
        hacerBotonera();
      }
      break;

    case 3:
    if(valorIndex<valorPags){
      mostrarArticulos(valorPags);
      numIndex = numPags;
      hacerBotonera();
    }
      break;
  }
}

//Hace la botonera del index, que sorpresa jaja
function hacerBotonera(){

  console.log("total: " + totalArticulos);
  numPags = Math.ceil(totalArticulos/6);
  console.log("numPags: "+ numPags);
  valorPags = numPags-1;

  let html = '';
  html+='<button onclick="cambiarPagina(0);">Primera página</button>';
  html+='<button onclick="cambiarPagina(1);">Anterior</button>';
  html+=numIndex+'/'+numPags;
  html+='<button onclick="cambiarPagina(2);">Siguiente</button>';
  html+='<button onclick="cambiarPagina(3);">Última página</button>';
  document.querySelector('#botonera').innerHTML = html;
}
