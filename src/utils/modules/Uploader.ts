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
const defaultWidth = 300
const defaultHeight = 300
const uploadFile: (fileObj: { file: File; type: 'image' | 'video' }) => Promise<string> = (
  fileObj
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fileObj.type === 'image') {
        resolve(
          'https://ua-cdn.learnings.ai/imageView/200/200/asset/prod/video_cover/d00c4aa0a2a2b22f4d04209286e856e9.jpeg'
        )
      } else if (fileObj.type === 'video') {
        resolve('https://ua-cdn.learnings.ai/asset/prod/video/2e193c353134ad593466e874597f2671.mp4')
      }
    }, 1000)
  })
}

const getSize: (
  fileObj: { file: File; type: 'image' | 'video' },
  result: string
) => Promise<{ width: number; height: number }> = (fileObj, result) => {
  return new Promise((resolve, reject) => {
    if (fileObj.type === 'image') {
      const img = new Image()
      let imgWidth = defaultHeight
      let imgHeight = defaultWidth
      img.onload = function () {
        const width = img.width
        const height = img.height
        // 使用获取到的宽高进行操作
        if (width && height) {
          if (width / height > defaultWidth / defaultHeight) {
            imgHeight = (height * defaultWidth) / width
          } else {
            imgWidth = (width * defaultHeight) / height
          }
        }
        resolve({ width: imgWidth, height: imgHeight })
      }
      img.src = result
    } else if (fileObj.type === 'video') {
      let imgWidth = defaultHeight
      let imgHeight = defaultWidth
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = function () {
        const width = video.videoWidth
        const height = video.videoHeight
        // 使用获取到的宽高进行操作
        if (width && height) {
          if (width / height > defaultWidth / defaultHeight) {
            imgHeight = (height * defaultWidth) / width
          } else {
            imgWidth = (width * defaultHeight) / height
          }
        }
        resolve({ width: imgWidth, height: imgHeight })
      }
      video.src = URL.createObjectURL(fileObj.file)
    }
  })
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
  handler(range: Range, fileObjs: { file: File; type: 'image' | 'video' }[]) {
    if (!this.quill.scroll.query('image') || !this.quill.scroll.query('video')) {
      return
    }
    // TODO: 需要一个loading效果
    const promises = fileObjs.map<
      Promise<{ url: string; type: 'image' | 'video'; width: number; height: number }>
    >((fileObj) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = async () => {
          const { width, height } = await getSize(fileObj, reader.result as string)
          const data = await uploadFile(fileObj)
          resolve({ url: data, type: fileObj.type, width, height })
        }
        reader.readAsDataURL(fileObj.file)
      })
    })
    Promise.all(promises).then((uploadFiles) => {
      const update = uploadFiles.reduce((delta: Delta, uploadFile) => {
        if (uploadFile.type === 'image') {
          return delta.insert(
            { image: uploadFile.url },
            { width: uploadFile.width, height: uploadFile.height }
          )
        } else if (uploadFile.type === 'video') {
          return delta.insert(
            { video: uploadFile.url },
            { width: uploadFile.width, height: uploadFile.height }
          )
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
