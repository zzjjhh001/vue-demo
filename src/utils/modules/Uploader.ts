import Delta from 'quill-delta'
import type Quill from 'quill'
import Emitter from 'quill/core/emitter'
import Module from 'quill/core/module'
import type { Range } from 'quill/core/selection'

interface UploaderOptions {
  mimetypes: {
    image: string[]
    video: string[]
  }
  handler: (
    this: { quill: Quill },
    range: Range,
    files: { file: File; type: 'image' | 'video' }[]
  ) => void
}

class Uploader extends Module<UploaderOptions> {
  static DEFAULTS: UploaderOptions

  constructor(quill: Quill, options: Partial<UploaderOptions>) {
    super(quill, options)
    quill.root.addEventListener('drop', (e) => {
      e.preventDefault()
      let native: ReturnType<typeof document.createRange> | null = null
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY)
        // @ts-expect-error
      } else if (document.caretPositionFromPoint) {
        // @ts-expect-error
        const position = document.caretPositionFromPoint(e.clientX, e.clientY)
        native = document.createRange()
        native.setStart(position.offsetNode, position.offset)
        native.setEnd(position.offsetNode, position.offset)
      }

      const normalized = native && quill.selection.normalizeNative(native)
      if (normalized) {
        const range = quill.selection.normalizedToRange(normalized)
        if (e.dataTransfer?.files) {
          this.upload(range, e.dataTransfer.files)
        }
      }
    })
  }

  upload(range: Range, files: FileList | File[]) {
    // TODO类型提取 image | video 或者改为动态推算类型
    const uploads: { file: File; type: 'image' | 'video' }[] = []
    Array.from(files).forEach((file) => {
      if (!file) {
        return
      }
      const type = (Object.keys(this.options.mimetypes!) as ('image' | 'video')[]).find((item) => {
        return this.options.mimetypes![item].includes(file.type)
      })
      if (!type) {
        return
      }
      uploads.push({ file, type })
    })
    if (uploads.length > 0) {
      // @ts-expect-error Fix me later
      this.options.handler.call(this, range, uploads)
    }
  }
}
Uploader.DEFAULTS = {
  mimetypes: {
    image: ['image/png', 'image/jpeg'],
    video: ['video/mp4']
  },
  handler(range: Range, files: { file: File; type: 'image' | 'video' }[]) {
    // TODO: 加上video
    if (!this.quill.scroll.query('image')) {
      return
    }
    const promises = files.map<Promise<{ url: string; type: 'image' | 'video' }>>((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          // resolve(reader.result as string);
          // Mock 上传图片
          setTimeout(() => {
            if (file.type === 'image') {
              resolve({
                url: 'https://ua-cdn.learnings.ai/imageView/200/200/asset/prod/video_cover/d00c4aa0a2a2b22f4d04209286e856e9.jpeg',
                type: file.type
              })
            } else if (file.type === 'video') {
              resolve({
                url: 'https://ua-cdn.learnings.ai/asset/prod/video/2e193c353134ad593466e874597f2671.mp4',
                type: file.type
              })
            }
          }, 100)
        }
        reader.readAsDataURL(file.file)
      })
    })
    Promise.all(promises).then((uploadFiles) => {
      const update = uploadFiles.reduce((delta: Delta, uploadFile) => {
        if (uploadFile.type === 'image') {
          return delta.insert({ image: uploadFile.url }, { width: '120px', height: '200px' })
        } else if (uploadFile.type === 'video') {
          return delta.insert({ video: uploadFile.url }, { width: '120px', height: '200px' })
        } else {
          return delta
        }
      }, new Delta().retain(range.index).delete(range.length)) as Delta
      this.quill.updateContents(update, Emitter.sources.USER)
      this.quill.setSelection(range.index + uploadFiles.length, Emitter.sources.SILENT)
    })
  }
}

export default Uploader
