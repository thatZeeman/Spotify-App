<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button ><router-link to="/login">
          {{buttonMsg}}
      </router-link>
    </button>
    <div class="mult" v-if="my_bearer_token != null">
      <button v-on:click="currentlyPlaying">{{getCurrent}}</button>
      
      <multiselect
      v-model = "song_picked"
      placeholder ="Search for a song"
      :options="songs"
      :close-on-select="true"
      :searchable="true"
      :internalSearch = "false"
      :custom-label="customLabel"
      :show-labels="false"
      @search-change="searchQuery"
      @select="select">

        <template slot="singleLabel" slot-scope="props"><img class="option__image" :src="props.option.albumCover" alt="No Images Available"><span class="option__desc"><span class="option__title">{{ props.option.songName }}</span></span></template>
        <template slot="option" slot-scope="props"><img class="option__image" :src="props.option.albumCover" alt="No Images Available">
          <span class="option__desc"><span class="option__title">{{ props.option.songName }}</span><span> by </span><span class="option__small">{{ props.option.artist }}</span></span>
        </template>
     
      </multiselect>
      <br>
      
      
    </div>
    <div v-if="song_picked != null">
        <span ><font size="5">{{Math.round(song_data.tempo)}} Beats per Minute at {{song_data.time_signature}}/4 time: </font></span>
        <span id='metronome' font-size = "30px" v-for="n in numberArray" :key="n.id" v-bind:class="{current: current == n}">
          <font size="7">{{n}}</font>
        </span></div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import axios from 'axios'
export default {
  
  name: 'SpotifySearch',
  components: { Multiselect },
  data () {
    return {
      msg: 'Welcome to my Song Search app using Spotify!',
      song: [{songName:'',artist:'',albumCover:''}],
      songs:[],
      song_picked: null,
      my_bearer_token : window.hostname,
      button_msg : '',
      song_data : null,
      activeColor : 'black',
      activeWeight : '1',
      colorArray : ["red","black"],
      numberArray : [],
      current : " 1 ",
      theMetrnome : null,
      getCurrent : "Would you like to use your current song?",
      theRepeater : null,
      repeatData : null
    }
  },
  computed: {
    buttonMsg: function(){
      
      if(this.my_bearer_token!=null){
        return this.button_msg = 'View User Profile'
      }
      
      return this.button_msg = 'Please Login before Searching!'
      
    }
    
  },
  created(){
    this.searchQuery('')
  },
  methods: {
    customLabel ({ songName, artist }) {
      return `${songName} – ${artist}`
    },
    currentlyPlaying(){
      let vm = this
      var time_left = 100
      vm.theRepeater = setInterval(function(){
       axios.get("https://api.spotify.com/v1/me/player/currently-playing?access_token="+vm.my_bearer_token)
      .then(function(response){
          
          vm.repeatData = response.data
          time_left = vm.repeatData.item.duration_ms - vm.repeatData.progress_ms
          //MAKE THIS song_picked
          vm.song_picked = 
          {
            songID: response.data.item.id
          }
          
          
          
          vm.select(vm.song_picked)
        
      })
      

      }, time_left)
    },
    myTimer(){
      let vm = this
      
      var beats = 60000/vm.song_data.tempo
      var colorIndex = 0
      clearInterval(vm.theMetrnome)
      vm.theMetrnome = setInterval(function(){
          vm.current = vm.numberArray[colorIndex]
         colorIndex = (colorIndex + 1) % vm.numberArray.length
         
      },beats)
      
    },
    select(selectedOption){
      
      let vm = this
      var id = selectedOption.songID
      vm.numberArray = []
      axios.get("https://api.spotify.com/v1/audio-features/"+id+"?access_token="+vm.my_bearer_token)
      .then(function(response){
        debugger
        vm.song_data = response.data
        for(var i = 0; i<vm.song_data.time_signature;i++){
          vm.numberArray[i] = " "+(i+1)+" "
        }
        
        vm.myTimer()
      })
      
      
    },
    searchQuery(value){
      let vm = this
      vm.songs = []
      if(value.length > 2){
        
        
        axios.get('https://api.spotify.com/v1/search?access_token='+vm.my_bearer_token+"&q="+value+"&type=track"
          ).then(function(response){
            var query = value
            var songs = response.data.tracks.items.map(function(song,index){
              
              var songObj = {
                songName: song.name,
                artist: song.artists[0].name,
                albumCover: song.album.images[2].url,
                songID: song.id             
              }
              
              
              return songObj

            })
            vm.songs = songs

            
            
            /*
            
            for(var i = 0; i<response.data.tracks.items.length;i++){
              debugger
              vm.song.songName = response.data.tracks.items[i].name
              debugger
              vm.song.artist = response.data.tracks.items[i].artists[0].name
              debugger
              vm.song.albumCover=response.data.tracks.items[i].album.images[2].url 
              debugger
              vm.songs[i] = vm.song
            }
            */
            
        })
      }
    }

  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
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
.option__image{
  vertical-align: middle;
  margin-right: 10px;
  display: inline-block;
}
.multiselect{
      box-sizing: content-box;
    display: block;
    position: relative;
    width: 500px;
    min-height: 40px;
    text-align: left;
    color: #35495e;
    
}
.mult{
  align-content: center;
  padding-top: 15px;
  display: flex;
  justify-content: center;  

}

.current{
  
font-weight:bold;
color:red;

}
  

</style>
