<script setup lang='ts'>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted } from 'vue';
const setContents = () => {
  const deltas = {
    ops: [
      { insert: '12312' },
      {
        insert: {
          image: 'http://baidu.com.png'
        },
        attributes: {
          width: '200px',
          height: '200px'
        },
      },
    ]
  }
  window.editor.setContents(deltas)
}
onMounted(() => {
  const editor = new Quill('#editor', { readOnly: true });
  window.editor = editor
  setContents()
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
