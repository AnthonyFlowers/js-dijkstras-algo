<script setup lang="ts">
import GraphDisplay from "./components/GraphDisplay.vue";
// const graphRenderer = new GraphCanvas();
</script>
<template>
  <div><GraphDisplay></GraphDisplay></div>
</template>
<script lang="ts">
export default {
  name: "App",
  components: { Graph: GraphDisplay },
};
</script>

<style scoped></style>
