<template>
    <md-field class="select">
        <label for="methods">Methods</label>
          <md-select name="option" v-model="option" id="option">
            <md-option v-for="option in options" :key="option.id" :value="option.value">
              {{ option.value }}
            </md-option>
        </md-select>
      </md-field>
</template>

<script>

export default {
  name: 'sortingMethods',
  data() {
    return {
      option: 'Selection sort',
      options: this.$store.state.sortMethods,
    };
  },
  methods: {

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .select {
    width: 200px;
    margin-right: 50px;
  }
</style>
