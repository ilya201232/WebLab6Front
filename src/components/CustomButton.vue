<template>
<button class="btn" @click="$emit('click1')">
  <span class="btn-text">
    <slot></slot>
  </span>
</button>
</template>

<script>
export default {
  name: "CustomButton",
  props: {
    onClickAction: Function
  },
  emits: ["click1"]
}
</script>

<style scoped lang="less">
.btn {
  cursor: pointer;

  background: #FFFFFF;

  width: 163px;
  height: 61px;

  border-radius: 10px;
  border-color: #05336E;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background: #ececec;
  }

  &:active {
    background: #d3d3d3;
  }

  &:disabled {
    cursor: default;
    background: #d2d2d2;
    border-color: #04254f;
  }

  &:disabled &:hover, &:active {
    background: #d2d2d2;
  }

  .btn-text {
    font-family: 'Comfortaa', serif;

    font-size: 24px;
    line-height: 27px;

    color: #021630;
  }
}
</style>
