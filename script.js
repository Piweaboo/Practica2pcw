var pagActual = '';

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
    window.location.href="index.html"
  }
}

//Borra sessionStorage y te lleva a Index, ez gg
function hacerLogout(){
  sessionStorage.removeItem('usuario');
  window.location.href="index.html"
}
//Metodo para saber la pagina en la que estas actualmente
function paginaActual(){
  let url = document.URL
  //console.log("La URL es " + url);
  let trozos = url.split("/");
  pagActual = '';
  for(var i = 0;i<trozos.length;i++){
    if(trozos[i] == "acerca.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "articulo.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "buscar.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "index.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "login.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "nuevo.html"){
      pagActual = trozos[i];
      break;
    }else if(trozos[i] == "registro.html"){
      pagActual = trozos[i];
      break;
    }
  }
}
//Esta funcion comprueba si hay algun usuario logueado y muestra el avegador en funcion de ello
function MenuLogin(){
  paginaActual();
  if(sessionStorage['usuario']){
    console.log("Hay usuario registrado");
    console.log("Esta en la página " + pagActual);
    console.log("El usuario es "+sessionStorage['usuario']);
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
  let url = 'api/articulos?pag={pagina}&lpag={6}';

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
        html += '<footer><button onclick = "cerrarMensajeModal(1);">Acceder</button>';
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
