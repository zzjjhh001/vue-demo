<script setup lang='ts'>
import Quill from 'quill'
import { type QuillOptions } from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted } from 'vue';
import { editorOptions } from '@/utils/editorConfig'
// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],        // 切换按钮
//   ['blockquote', 'code-block'],

//   [{ 'header': 1 }, { 'header': 2 }],               // 用户自定义按钮值
//   [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//   [{ 'script': 'sub' }, { 'script': 'super' }],      // 上标/下标
//   [{ 'indent': '-1' }, { 'indent': '+1' }],          // 减少缩进/缩进
//   [{ 'direction': 'rtl' }],                         // 文本下划线

//   [{ 'size': ['small', false, 'large', 'huge'] }],  // 用户自定义下拉
//   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//   [{ 'color': [] }, { 'background': [] }],          // 主题默认下拉，使用主题提供的值
//   [{ 'font': [] }],
//   [{ 'align': [] }],

//   ['clean']                                         // 清除格式
// ];
onMounted(() => {
  const editor = new Quill('#editor', editorOptions as QuillOptions);
  window.editor = editor
})
</script>

<template>
  <div class="box">
    <div id="main">
      <div id="editor"></div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.box {
  width: 1000px;
}

.main {
  width: 1000px;
  height: 800px;
}

#editor {
  height: 600px;
}
</style>
