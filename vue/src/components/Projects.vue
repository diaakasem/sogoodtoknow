<template>
  <div class="projects">
    <h1 v-for="project in projects" :key="project.title">
      {{project.title}}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  props: {
    projects: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
