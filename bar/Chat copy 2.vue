<template>
  <div v-on:blur="handleBlur"></div>
  <input v-on:blur="handleBlur" />
</template>

<script>
export default {
  methods: {
    handleBlur() {
      console.log("focus out");
    },
  },
};
</script>

<style scoped>
div{
  width: 300px;
  height: 300px;
  background-color: black;
}

</style>
