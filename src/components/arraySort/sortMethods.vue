<template>
  <div class="md-layout-item">
    <div class="tabbar-layout">
      <div class="tabbar-layout__top-controls top-controls">
        <SortingMethodsSelect></SortingMethodsSelect>
        <md-button @click="shuffle" class="md-raised md-primary">Randomize Array</md-button>
        <md-button @click="startSorting" class="md-raised md-primary">Sort</md-button>
      </div>
      <div class="tabbar-layout__bottom-controls bottom-controls">
        <ArrayLengthSlider />
        <TimeoutSlider />
      </div>
    </div>
    <div class="array-vizual-block">
      <ArrayItem
        v-for="value in values"
        :key="value.id"
        :active="active === value.id || activeGroup.some(id => value.id === id)"
        :selected="selected === value.id"
        :sorted="sortedGroup.some(id => value.id === id) || sorted"
        :current="current === value.id"
        :height="value.height"
        style="height: 100%"
      >
      </ArrayItem>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-plusplus */
import TimedOutBehaivor from '../../services/timedOutBehaivor';
import PlaceHolderArray from '../../services/placeHolderArray';
import AnimationFrames from '../../services/animationFrames';
import SortingMethodsSelect from './sortMethodsSelect';
import ArrayLengthSlider from './arrayLengthSlider';
import TimeoutSlider from './timeoutSlider';
import ArrayItem from './arrayItem';

const timedOutBehaivor = new TimedOutBehaivor(100);
const animationFrames = new AnimationFrames();
const placeHolderArrayService = new PlaceHolderArray();

export default {
  name: 'SortMethodsVisualization',
  components: {
    SortingMethodsSelect,
    ArrayLengthSlider,
    ArrayItem,
    TimeoutSlider,
  },
  data() {
    return {
      values: [],
      activeGroup: [],
      selected: null,
      active: null,
      sortedGroup: [],
      sorted: false,
      current: null,
    };
  },
  computed: {
    arrayLength() {
      return this.$store.state.arrayLength;
    },
    timeoutMS() {
      return this.$store.state.timeoutMS;
    },
  },
  watch: {
    arrayLength() {
      timedOutBehaivor.comlpete(this.shuffle, this);
    },
    timeoutMS(value) {
      animationFrames.setDefaultTimeout(value);
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
        case 'bubble': {
          fn = this.bubbleSort;
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
      for (let i = 0; i < this.arrayLength; i++) {
        const maxHeightPoints = this.arrayLength;
        const height = ((i + 1) * 100) / maxHeightPoints;
        array.push({ height, id: i });
      }
      array = array.sort(() => 0.5 - Math.random());
      this.values = array;
    },
    // SELECTION SORT
    findSmallest(array, i) {
      let index = i;
      let smallestIndex = i;
      let smallest = array[smallestIndex];
      for (index; index < array.length; index++) {
        if (array[index].height < smallest.height) {
          smallest = array[index];
          smallestIndex = index;
        }
        animationFrames
          .addStep(this.selectionSortAnimatedIteration, this, [array[index], smallest]);
      }
      return smallestIndex;
    },
    selectionSort() {
      this.stopAnimation();
      placeHolderArrayService.array = Array.from(this.values);
      const array = placeHolderArrayService.array;
      for (let i = 0; i < array.length; i++) {
        const smallestIndex = this.findSmallest(array, i);
        const smallest = array[smallestIndex];
        const current = array[i];

        [array[smallestIndex], array[i]] = [current, smallest];
        animationFrames
          .addStep(this.selectionSortAnimatedStep, this, [Array.from(array), smallest]);
      }
      animationFrames.addStep(this.sortEnd, this);
      animationFrames.startAnimation();
    },
    selectionSortAnimatedIteration(current, smallest) {
      this.selected = smallest.id;
      this.showCurrentItem(current);
    },
    selectionSortAnimatedStep(array, smallest) {
      this.sortedGroup.push(smallest.id);
      this.values = array;
    },
    // QUICK SORT
    quickSort() {
      this.stopAnimation();
      this.qSortStep(this.values);
      animationFrames.addStep(this.sortEnd, this);
      animationFrames.startAnimation();
    },
    qSortStep(array, start = 0, end = array.length) {
      if (array.length < 2) {
        return array;
      }
      const pivot = array[Math.floor(array.length / 2)]; // base element
      const less = [];
      const greater = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < array.length; i++) {
        animationFrames.addStep(this.qSortOneIteration, this, [array, array[i], pivot], 50);
        if (pivot.height > array[i].height) {
          less.push(array[i]);
        } else if (array[i] !== pivot) {
          greater.push(array[i]);
        }
      }
      const lessStart = start;
      const lessEnd = lessStart + less.length;
      const greaterStart = lessEnd + 1;
      const greaterEnd = greaterStart + greater.length;

      animationFrames.addStep(
        this.qSortAnimatedStep,
        this,
        [[...less, pivot, ...greater],
          start,
          end,
        ],
      );
      return [
        ...this.qSortStep(less, lessStart, lessEnd),
        pivot,
        ...this.qSortStep(greater, greaterStart, greaterEnd),
      ];
    },
    qSortOneIteration(activeGroup, currentItem, pivotItem) {
      this.activeGroup = activeGroup.map(item => item.id);
      this.selected = pivotItem.id;
      this.showCurrentItem(currentItem);
    },
    qSortAnimatedStep(array, start, end) {
      this.values.splice(start, end - start, ...array);
    },
    showCurrentItem(item) {
      this.current = item.id || this.current;
    },
    bubbleSort() {
      this.stopAnimation();
      const array = Array.from(this.values);
      let swapped = true;
      let len = array.length;
      for (let j = 0; j < array.length; j++) {
        if (!swapped) break;
        swapped = false;
        len -= 1;
        for (let i = 0; i < len; i++) {
          const selected = array[i].id;
          if (array[i + 1]) {
            if (array[i].height > array[i + 1].height) {
              [array[i], array[i + 1]] = [array[i + 1], array[i]];
              swapped = true;
            }
          }
          animationFrames.addStep(
            this.bubbleSortAnimatedStep,
            this,
            [Array.from(array), selected],
          );
        }
      }

      animationFrames.addStep(this.sortEnd, this, [], 1);
      animationFrames.startAnimation();
    },
    bubbleSortAnimatedStep(array, selected) {
      this.selected = selected || this.selected;
      this.values = array;
    },
    quickSort2() {

    },
    sortEnd() {
      this.activeGroup = [];
      this.sorted = true;
      this.selected = null;
      this.active = null;
      this.current = null;
    },
    stopAnimation() {
      this.activeGroup = [];
      this.current = null;
      this.sorted = false;
      this.selected = null;
      this.active = null;
      this.sortedGroup = [];
      animationFrames.stopAnimation();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.shuffle();
      animationFrames.setDefaultTimeout(this.timeoutMS);
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
    display: flex;
    flex-direction: column;
    height: 80px;
    justify-content: space-between;
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
    margin: 5px;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
</style>
