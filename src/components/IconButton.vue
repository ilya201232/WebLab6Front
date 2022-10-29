<template>
  <button class="btn" @click="$emit('click')">
  <span class="material-symbols-outlined icon">
    <slot>{{ icon_name }}</slot>
  </span>
  </button>
</template>

<script>
export default {
  name: "IconButton",
  props: {
    icon_name: String,
    clickHandler: Function
  }
}
</script>

<style scoped lang="less">
.btn {
  cursor: pointer;

  background: #FFFFFF;

  border: none;
  border-radius: 10px;


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
    border-color: #8e8e93 !important;
  }

  &:disabled &:hover, &:active {
    background: #d2d2d2;
  }
}
</style>
