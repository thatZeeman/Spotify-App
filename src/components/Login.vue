<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <h2>
        <router-link to="/">
          Go Back to Music Search
        </router-link>
      </h2>  
          <br>
          <button v-if="my_bearer_token == null" v-on:click="spotifyAuthorize">Login into Spotify?</button>
          <br>
          <br>
          <button v-if="hideButton"  v-on:click = "getUserData">Get Profile Data</button>
          
          <img  :src = user_picture_url>
          
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    return {
      msg: 'Login Page',
      msg_new: [],
      my_client_id : '84806cbaa7b74324b243a99572d51b8c',
      my_bearer_token : window.hostname,
      user_picture_url : ''
    }
  },
  computed: {
      hideButton: function(){
        return this.my_bearer_token!=null && this.msg == 'Login Page'
      }
  },
  methods: {
      spotifyAuthorize: function(event){
          var scopes = 'user-read-private user-read-email user-read-birthdate'
          var redirect_uri = 'http://localhost:8080'
          location = ('https://accounts.spotify.com/authorize' +
            '?response_type=token' +
            '&client_id=' + this.my_client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(redirect_uri))
      },
      getUserData: function(){
        let vm = this
        
        axios.get('https://api.spotify.com/v1/me?access_token='+vm.my_bearer_token).then(function(response){
          vm.msg ="Welcome back, " + response.data.display_name; 
          vm.user_picture_url = response.data.images[0].url;
          
        })
      }

  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}