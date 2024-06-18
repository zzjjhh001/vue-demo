import Link from 'quill/formats/link'
import { BlockEmbed } from 'quill/blots/block'

const ATTRIBUTES = ['height', 'width']

class Video extends BlockEmbed {
  static blotName = 'video'
  // static className = 'ql-video'
  // TODO: 暂时使用quill原本的iframe，后续确认是否要更换为video，去重写create
  static tagName = 'IFRAME'

  static create(value: string) {
    const node = super.create(value) as Element
    node.setAttribute('frameborder', '0')
    node.setAttribute('allowfullscreen', 'true')
    node.setAttribute('src', this.sanitize(value))
    return node
  }

  static formats(domNode: Element) {
    return ATTRIBUTES.reduce((formats: Record<string, string | null>, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }

  static sanitize(url: string) {
    return Link.sanitize(url)
  }

  static value(domNode: Element) {
    return domNode.getAttribute('src')
  }

  declare domNode: HTMLVideoElement

  format(name: string, value: string) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }

  // html() {
  //   const { video } = this.value()
  //   return `<a href="${video}">${video}</a>`
  // }
}

export default Video
