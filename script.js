var pagActual = '';

//Borra sessionStorage y te lleva a Index, ez gg
function hacerLogout(){
  sessionStorage.removeItem('usuario');
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
      html+='      <li><a href="nuevo.html"><span class="icon-doc-add"></span><span class="textop">Nuevo artículo</span></a></li>';
    }
    html+='<li><a onclick="hacerLogout();" href="index.html"><span class="icon-logout"></span><span class="textop">';
    html+='Logout ('+sessionStorage['usuario']+")";
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

function mostrarArticulos(){
  let xhr = new XMLHttpRequest(),
      url = 'api/articulos';

  xhr.open('GET', url, true);


  /*fetch(url).then(function(respuesta){
    console.log(respuesta);
    if(respuesta.ok){

    }else{
      console.log("Error en la peticion fetch");
    }
  });*/
}

function hacerLogin(frm){
  let url = 'api/usuarios/login',
  fd = new FormData(frm);
  //console.log("frm: "+frm);
  fetch(url,{method:'POST',body:fd}).then(function(respuesta){
    if (respuesta.ok) {
      respuesta.json().then(function(datos){
        console.log(datos);
        console.log(JSON.stringify(datos));
        sessionStorage['usuario'] = JSON.stringify(datos);
      });
    }else {
      console.log('Error en la peticion fetch');
    }
  });
  return false;
}
