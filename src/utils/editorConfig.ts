import type Toolbar from 'quill/modules/toolbar'

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ header: 1 }, { header: 2 }, { header: 3 }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ size: ['small', false, 'large', 'huge'] }], // 用户自定义下拉
  [{ color: [] }, { background: [] }], // 主题默认下拉，使用主题提供的值
  [{ align: [] }],
  [{ image: true }, { video: true }, { link: true }],
  [{ clean: true }] // 清除格式
]
export const editorOptions = {
  debug: 'log',
  modules: {
    toolbar: {
      container: toolbar,
      handlers: {
        // 注入vidoe的handler覆盖base theme中默认的
        video(this: Toolbar) {
          let fileInput: HTMLInputElement = this.container!.querySelector(
            'input.ql-video[type=file]'
          )!
          if (fileInput == null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            fileInput.setAttribute(
              'accept',
              this.quill.uploader.options.mimetypes!.video!.join(', ')
            )
            fileInput.classList.add('ql-video')
            fileInput.addEventListener('change', () => {
              const range = this.quill.getSelection(true)
              this.quill.uploader.upload(range, fileInput.files!)
              fileInput.value = ''
            })
            this.container!.appendChild(fileInput)
          }
          fileInput.click()
        },
        image(this: Toolbar) {
          let fileInput: HTMLInputElement = this.container!.querySelector(
            'input.ql-image[type=file]'
          )!
          if (fileInput == null) {
            fileInput = document.createElement('input')
            fileInput.setAttribute('type', 'file')
            fileInput.setAttribute(
              'accept',
              this.quill.uploader.options.mimetypes!.image!.join(', ')
            )
            fileInput.classList.add('ql-image')
            fileInput.addEventListener('change', () => {
              const range = this.quill.getSelection(true)
              this.quill.uploader.upload(range, fileInput.files!)
              fileInput.value = ''
            })
            this.container!.appendChild(fileInput)
          }
          fileInput.click()
        }
      }
    }
  },
  // readOnly: true,
  placeholder: '请输入...',
  theme: 'snow'
}
