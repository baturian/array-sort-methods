<template>
  <div class="component-root">
    <span class="label">{{ label }}</span>
    <div class="slider">
      <vue-slider v-model="sliderValue" v-bind="options" />
    </div>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/antd.css';

export default {
  components: {
    VueSlider,
  },
  data() {
    const defaultOptions = {
      min: 0,
      max: 10,
      width: '100%',
      marks(val) {
        if (val % 10 === 0) {
          return {
            label: `${val}`,
            labelActiveStyle: {
              color: '#3498db',
            },
          };
        }
        return false;
      },
    };
    const propsOptions = this.propsOptions;
    const options = Object
      .assign(defaultOptions, propsOptions);
    return { options };
  },
  props: {
    propsOptions: Object,
    label: String,
    value: String,
  },
  computed: {
    sliderValue: {
      set(val) {
        this.$store.state[this.value] = val;
      },
      get() {
        return this.$store.state[this.value];
      },
    },
  },
};
</script>

<style scoped>
  .component-root {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 100%;
    height: 30px;
  }

  .label {
    flex: 0 0 100px;
    text-align: left;
  }

  .slider {
    flex: 1 1 auto;
  }
</style>
