<template>
  <vue-slider v-model="arrayLength" v-bind="options" />
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

export default {
  components: {
    VueSlider,
  },
  data() {
    return {
      options: {
        min: 2,
        max: 500,
        width: 'auto',
        marks(val) {
          if (val % 20 === 0) {
            return {
              label: `${val}`,
              labelActiveStyle: {
                color: '#3498db',
              },
            };
          }
          return false;
        },
      },
    };
  },
  computed: {
    arrayLength: {
      get() {
        return this.$store.state.arrayLength;
      },
      set(val) {
        this.$store.state.arrayLength = val;
      },
    },
  },
};
</script>
