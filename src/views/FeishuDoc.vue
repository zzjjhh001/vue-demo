<script setup lang='ts'>
import FeishuDocCom from './FeishuDocCom.vue'
const list = [1]
</script>

<template>
  <FeishuDocCom v-for="item in list" :key="item"></FeishuDocCom>
</template>

<style lang='scss' scoped></style>
