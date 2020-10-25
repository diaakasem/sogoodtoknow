<template>
  <div class="home">
    <img alt="logo" src="../assets/logo-icon.png">
    <Projects :projects="projects"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Projects from '@/components/Projects.vue'
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    Projects
  },
  mounted() {
      axios.post('http://localhost:4000/project/', {
        status: 'created'
      }).then((result) => {
        console.log(result.data);
        return this.projects = result.data;
      }).catch(function (e){
          console.error(e);
      });
  }


}
</script>
