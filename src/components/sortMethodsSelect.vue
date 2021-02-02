<template>
  <div class="md-layout-item">
    <div class="tabbar-layout">
      <SortingMethodsSelect></SortingMethodsSelect>
      <md-button @click="shuffle" class="md-raised md-primary">Randomize Array</md-button>
      <md-button @click="selectionSort" class="md-raised md-primary">Sort</md-button>
    </div>
    <div class="array-vizual-block">
      <div
        class="array-item"
        v-for="value in values"
        :class="{ active: active === value.id, selected: selected === value.id }"
        :key="value.id"
        :style="{ height: value.height + 'px' }">
      </div>
    </div>
  </div>
</template>

<script>
import AsyncQueue from '../services/asyncQueue';
import SortingMethodsSelect from './sortMethods';

const asyncQueue = new AsyncQueue();

export default {
  name: 'SortMethodsVisualization',
  components: {
    SortingMethodsSelect,
  },
  data() {
    return {
      option: 'Selection sort',
      options: [{ value: 'Selection sort' }, { value: 'Merge sort' }, { value: 'Quick sort' }],
      values: [],
      selected: null,
      active: null,
    };
  },
  methods: {
    shuffle() {
      this.stopAnimation();
      let array = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < 100; i++) {
        array.push({ height: (i + 1) * 5, id: i });
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
      asyncQueue.unblockJobs();
      const array = Array.from(this.values);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < array.length; i++) {
        asyncQueue.addJobToQueue(this.timedOutSort.bind(this, i));
      }
      asyncQueue.addJobToQueue(this.stopAnimation.bind(this));
    },
    stopAnimation() {
      asyncQueue.stopJobs();
      this.selected = null;
      this.active = null;
    },
    timedOutSort(i) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const array = this.values;
          const smallestIndex = this.findSmallest(array, i);
          const smallest = array[smallestIndex];
          const current = array[i];

          this.selected = current.id;
          if (current.id !== smallest.id) this.active = smallest.id;
          array[smallestIndex] = current;
          array[i] = smallest;
          resolve();
        }, 100);
      });
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
  .tabbar-layout {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .select {
    width: 200px;
    margin-right: 50px;
  }

  .array-vizual-block {
    height: 600px;
    margin: 5px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }

  .array-item {
    background-color: #1976d2;
    margin-right: 5px;
    width: 10px;
    flex: 1 1 10px;
    transition: all .3s ease-in;
  }

  .array-item.active {
    position: relative;
    background-color: #673ab7;
  }

  .array-item.selected {
    position: relative;
    background-color: #9a67ea;
  }
  .array-item::after {
    content: "";
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    bottom: -5px;
    left: 2px;
    opacity: 0;
    transition: opacity .4s ease-in;
  }
  .array-item.selected:after {
    border-bottom: 5px solid red;
    opacity: 1;
  }
  /* .array-item.active:after {
    border-bottom: 5px solid black;
    opacity: 1;
  } */
</style>
