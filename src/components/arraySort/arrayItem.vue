<template>
  <div
    class="array-item"
    :class="{
      active: active,
      selected: selected,
      sorted: sorted,
      current: current
    }"
    style="height: 100%">
    <div
      class="array-item__main-block main-block"
      :style="{ height: height + '%' }">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArrayItem',
  props: {
    active: Boolean,
    selected: Boolean,
    sorted: Boolean,
    height: Number,
    current: Boolean,
  },
};
</script>

<style scoped>
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
  }

  .array-item__main-block {
    background-color: #ef5350;
    /* transition: background-color .1s ease-out; */
    width: 100%;
  }

  .array-item.active .array-item__main-block {
    position: relative;
    opacity: .7;
    /* background-color: #7ccc8a; */
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
    /* transition: opacity .1s ease-in; */
  }
  .array-item.sorted .array-item__main-block {
    background-color: #2196f3;
  }

  .array-item.selected .array-item__main-block::after {
    opacity: 1;
  }

  .array-item.current .array-item__main-block {
    background: #ebeb52;
  }
  .array-item.current .array-item__main-block::after {
    opacity: 1;
  }
</style>
