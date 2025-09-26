<template>
  <Layout />
</template>

<script setup lang="ts">
import Layout from "@presentation/components/Layout.vue";
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fafafa;
  color: #333;
}

#app {
  min-height: 100vh;
}

/* Reset default margins and paddings for common elements */
h1,
h2,
h3,
h4,
h5,
h6,
p,
ul,
ol,
li {
  margin: 0;
  padding: 0;
}

/* Make links inherit color by default */
a {
  color: inherit;
}

/* Button reset */
button {
  font-family: inherit;
}

/* Form element consistency */
input,
textarea,
select {
  font-family: inherit;
}
</style>
