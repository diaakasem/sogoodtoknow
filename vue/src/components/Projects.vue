<template>
  <div class="hero-unit container">
    <h1>So Good To Know</h1>
    <tabnav selected='created' filter="by_name"></tabnav>
    <ul class="projects" v-if="projects && projects.length">
      <li v-for="project in projects" :key="project._id">
        <a href="#/project/{{project._id}}">
          {{project.title || project.name || project._id || project.description.substring(0, 100)}}
        </a>
      </li>
    </ul>
    <div class="pull-right">
      <p>You now have {{projects.length}} project</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Projects',
  props: {
    projects: Array
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
