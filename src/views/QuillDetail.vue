<script setup lang='ts'>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { onMounted } from 'vue';
const defaultDeltas = '{"ops":[{"insert":"这是标题1"},{"attributes":{"header":1},"insert":"\\n"},{"insert":"这是标题2"},{"attributes":{"header":2},"insert":"\\n"},{"insert":"这是标题3"},{"attributes":{"header":3},"insert":"\\n"},{"insert":"这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文这是正文\\n"},{"attributes":{"size":"small"},"insert":"这是小字体"},{"insert":" "},{"attributes":{"size":"large"},"insert":"这是大字体"},{"insert":" 这是正常字体\\n"},{"attributes":{"bold":true},"insert":"加粗"},{"insert":" "},{"attributes":{"italic":true},"insert":"斜体"},{"insert":" "},{"attributes":{"underline":true},"insert":"下划线"},{"insert":" "},{"attributes":{"strike":true},"insert":"删除线"},{"insert":"\\n"},{"attributes":{"color":"#66b966"},"insert":"文本颜色"},{"insert":" 和 "},{"attributes":{"background":"#b26b00"},"insert":"背景色"},{"insert":"\\n图片如下\\n"},{"attributes":{"height":"300","width":"215.84948688711518"},"insert":{"image":"https://ua-cdn.learnings.ai/imageView/200/200/asset/prod/video_cover/d00c4aa0a2a2b22f4d04209286e856e9.jpeg"}},{"insert":"\\n视频如下\\n"},{"attributes":{"height":"300","width":"168.75"},"insert":{"video":"https://ua-cdn.learnings.ai/asset/prod/video/2e193c353134ad593466e874597f2671.mp4"}},{"insert":"\\n"},{"attributes":{"link":"http://baidu.com"},"insert":"超链接"},{"insert":"\\n无序列表"},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"无序列表"},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"无序列表"},{"attributes":{"list":"bullet"},"insert":"\\n"},{"insert":"qweq\\n有序列表"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"有序列表"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"有序列表"},{"attributes":{"list":"ordered"},"insert":"\\n"},{"insert":"\\n"}]}'
const setContents = () => {
  const deltas = JSON.parse(defaultDeltas)
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

.editor-box {
  width: 700px;
}

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
