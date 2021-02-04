<template>
  <div class="md-layout-item">
    <div class="tabbar-layout">
      <div class="tabbar-layout__top-controls top-controls">
        <SortingMethodsSelect></SortingMethodsSelect>
        <md-button @click="shuffle" class="md-raised md-primary">Randomize Array</md-button>
        <md-button @click="startSorting" class="md-raised md-primary">Sort</md-button>
      </div>
      <div class="tabbar-layout__bottom-controls bottom-controls">
        <CustomSlider></CustomSlider>
      </div>
    </div>
    <div class="array-vizual-block">
      <div
        class="array-item"
        v-for="value in values"
        :class="{
          active: active === value.id || activeGroup.find(id => value.id === id),
          selected: selected === value.id,
          sorted: value.isSorted || sorted
        }"
        :key="value.id"
        style="height: 100%">
        <div
          class="array-item__main-block main-block"
          :style="{ height: value.height + '%' }">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimedOutBehaivor from '../services/timedOutBehaivor';
import AnimationFrames from '../services/animationFrames';
import SortingMethodsSelect from './sortMethodsSelect';
import CustomSlider from './slider';

const timedOutBehaivor = new TimedOutBehaivor(50);
const animationFrames = new AnimationFrames();

export default {
  name: 'SortMethodsVisualization',
  components: {
    SortingMethodsSelect,
    CustomSlider,
  },
  data() {
    return {
      values: [],
      activeGroup: [],
      selected: null,
      active: null,
      sorted: false,
    };
  },
  computed: {
    arrayLength() {
      return this.$store.state.arrayLength;
    },
  },
  watch: {
    arrayLength() {
      timedOutBehaivor.comlpete(this.shuffle, this);
    },
  },
  methods: {
    startSorting() {
      let fn;
      switch (this.$store.state.sortMethod) {
        case 'quick': {
          fn = this.quickSort;
          break;
        }
        default: {
          fn = this.selectionSort;
        }
      }
      fn();
    },
    shuffle() {
      this.stopAnimation();
      let array = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.arrayLength; i++) {
        const maxHeightPoints = this.arrayLength;
        const height = ((i + 1) * 100) / maxHeightPoints;
        array.push({ height, id: i });
      }
      array = array.sort(() => 0.5 - Math.random());
      this.values = array;
    },
    findSmallest(array, i) {
      let index = i;
      let smallestIndex = i;
      let smallest = array[smallestIndex];
      // eslint-disable-next-line no-plusplus
      for (index; index < array.length; index++) {
        if (array[index].height < smallest.height) {
          smallest = array[index];
          smallestIndex = index;
        }
      }
      return smallestIndex;
    },
    selectionSort() {
      this.stopAnimation();
      const copyArray = Array.from(this.values);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < copyArray.length; i++) {
        animationFrames.addStep(this.selectionSortStep.bind(this, i));
      }
      animationFrames.addStep(this.sortEnd.bind(this));
      animationFrames.startAnimation();
    },
    selectionSortStep(i) {
      const array = this.values;
      const smallestIndex = this.findSmallest(array, i);
      const smallest = array[smallestIndex];
      const current = array[i];

      this.selected = current.id;
      if (current.id !== smallest.id) this.active = smallest.id;
      if (i === array.length - 1) {
        this.selected = null;
        this.active = null;
      }
      smallest.isSorted = true;
      [this.values[smallestIndex], this.values[i]] = [current, smallest];
    },
    quickSort() {
      animationFrames.stopAnimation();
      this.qSortStep(this.values);
      animationFrames.addStep(this.sortEnd.bind(this));
      animationFrames.startAnimation();
    },
    qSortStep(array, start = 0, end = array.length) {
      if (array.length < 2) {
        return array;
      }
      const pivot = array[0]; // base element
      const less = [];
      const greater = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < array.length; i++) {
        if (pivot.height > array[i].height) {
          less.push(array[i]);
        } else if (i > 0) {
          greater.push(array[i]);
        }
      }
      const lessStart = start;
      const lessEnd = lessStart + less.length;
      const greaterStart = lessEnd + 1;
      const greaterEnd = greaterStart + greater.length;

      animationFrames.addStep(
        this.qSortAnimated.bind(this, [...less, pivot, ...greater], start, end, pivot),
      );
      return [
        ...this.qSortStep(less, lessStart, lessEnd),
        pivot,
        ...this.qSortStep(greater, greaterStart, greaterEnd),
      ];
    },
    qSortAnimated(array, start, end, pivot) {
      this.activeGroup = array.map(item => item.id);
      this.selected = pivot.id;
      this.values.splice(start, end - start, ...array);
    },
    sortEnd() {
      this.activeGroup = [];
      // this.sorted = true;
      this.selected = null;
      this.active = null;
    },
    stopAnimation() {
      this.activeGroup = [];
      this.sorted = false;
      this.selected = null;
      this.active = null;
      animationFrames.stopAnimation();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.shuffle();
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .md-layout-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .tabbar-layout {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }

  .bottom-controls {
    width: 90%;
  }

  .tabbar-layout__top-controls {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .select {
    width: 200px;
    margin-right: 50px;
  }

  .array-vizual-block {
    flex-grow: 3;
    flex-shrink: 1;
    /* width: 98%; */
    /* height: 600px; */
    margin: 5px;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }

  .array-item {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: #eeeeee73;
    margin-right: 2px;
    width: 10px;
    min-width: 1px;
    flex: 1 1 10px;
    /* transition: background-color .3s ease-in; */
  }

  .array-item__main-block {
    background-color: #ef5350;
    transition: background-color .3s ease-in;
    width: 100%;
  }

  .array-item.active .array-item__main-block {
    position: relative;
    background-color: #673ab7;
  }

  .array-item.selected .array-item__main-block {
    position: relative;
    background-color: #9a67ea;
  }
  .array-item .array-item__main-block::after {
    content: "";
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid red;
    position: absolute;
    bottom: -10px;
    left: 50%;
    margin-left: -10px;
    width: 0;
    height: 0;
    opacity: 0;
    transition: opacity .1s ease-in;
  }
  .array-item.sorted .array-item__main-block {
    background-color: #2196f3;
  }

  .array-item.selected .array-item__main-block::after {
    opacity: 1;
  }
  /* .array-item.active:after {
    border-bottom: 5px solid black;
    opacity: 1;
  } */
</style>
