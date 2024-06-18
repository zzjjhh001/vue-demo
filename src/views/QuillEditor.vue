<script setup lang='ts'>
// import Quill from '../../../quill/packages/quill/src/quill.ts'
import Quill from 'quill'
import { type QuillOptions } from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted } from 'vue';
import { editorOptions } from '@/utils/editorConfig'
// import Video from '@/utils/formats/Video'
// Quill.register('blots/video', Video)
import Uploader from '@/utils/modules/Uploader'
Quill.register('modules/uploader', Uploader)
onMounted(() => {
  const editor = new Quill('#editor', editorOptions as QuillOptions);
  window.editor = editor
})
</script>

<template>
  <div class="box">
    <div class="editor-box">
      <div id="editor"></div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-box {}

#editor {
  height: 600px;
  font-size: 18px;
}
</style>
<style>
.ql-video {
  display: none;
}
</style>
