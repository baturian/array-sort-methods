<template>
  <CustomSlider
    :propsOptions=options
    :label=label
    :value=value
  />
</template>

<script>
import CustomSlider from './slider';

export default {
  components: {
    CustomSlider,
  },
  data() {
    return {
      options: {
        max: 500,
        min: 2,
        marks(val) {
          if (val % 20 === 0 || val === this.min) {
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
      label: 'Count',
      value: 'arrayLength',
    };
  },
};
</script>
