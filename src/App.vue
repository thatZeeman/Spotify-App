<template>
  <article id="spotifyApp">
  <div id="app">
    <img width="200px" height="200px" src="./assets/logo.png">
    <router-view/>
  </div>
  <footer></footer>
  </article>

</template>

<script>

export default {
  name: 'App',
  created(){
    
    if(window.location.href.indexOf("access_token") > -1){   
      var final_val = new URL(window.location.href).hash.split('&').filter(function(el) { if(el.match('access_token') !== null) return true; })[0].split('=')[1];
      window.hostname = final_val
      this.$router.push("/login")
    }
  }
}
</script>


<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#spotifyApp {
  box-shadow: 0 0 5px rgba(0,0,0,.5);
    overflow: hidden;
    margin: 30px auto 150px;
    min-width: 728px;
    max-width: 960px;
    width: 80%;
    background-color: #fff;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px;
}
footer{
    padding-top: 10px;
    padding-bottom: 116px;
}
body{
  background-color: lightgrey;
}
</style>
