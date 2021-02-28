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
        min: 0,
        interval: 50,
        marks(val) {
          if (val % 50 === 0) {
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
      label: 'Timeout (ms)',
      value: 'timeoutMS',
    };
  },
};
</script>

