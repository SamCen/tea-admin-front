<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style>
  body,html{
    height: 100%;
  }
  #app{
    height: 100%;
    background: #f6f7f7;
  }
  *{
    margin: 0;
    padding: 0;
  }
</style>
