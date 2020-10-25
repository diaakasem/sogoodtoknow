<template>
  <img alt="Vue logo"
       src="./assets/logo-icon.png"
       width="200"
       height="200">
  <Projects :projects="projects"/>
</template>

<script>
import Projects from './components/Projects.vue'

export default {
  name: 'App',
  components: {
    Projects
  },
  data: () => {
    return {
      projects: [{
        title: 'Hello'
      }, {
        title: 'World'
      }]
    };
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
