<template>
    <md-field class="select">
        <label for="methods">Methods</label>
          <md-select name="option" v-model="option" id="option">
            <md-option v-for="option in options" :key="option.id" :value="option.id">
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
    };
  },
  computed: {
    option: {
      get() {
        return this.$store.state.sortMethod;
      },
      set(val) {
        this.$store.state.sortMethod = val;
      },
    },
    options: {
      get() {
        return this.$store.state.sortMethods;
      },
      set(val) {
        this.$store.state.sortMethods = val;
      },
    },
  },
  watch: {
    option(val) {
      this.$store.state.sortMethod = val;
    },
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
