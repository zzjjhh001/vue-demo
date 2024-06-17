import { cloneDeep } from 'lodash'
export const colorTypeList = [
  {
    value: 'RGBA',
    label: 'rgba方式'
  },
  {
    value: 'HSVS',
    label: 'hsv改变s'
  },
  {
    value: 'HSVV',
    label: 'hsv改变v'
  },
  {
    value: 'HSVSV',
    label: 'hsv改变sv'
  }
] as const
export type ColorType = (typeof colorTypeList)[number]['value']
// handleList
const handleSortList = (values: number[]) => {
  const sortList = cloneDeep(values).sort((a, b) => a - b)
  const min = sortList[0]
  const max = sortList[sortList.length - 1]
  const len = max - min
  return {
    min,
    max,
    len
  }
}

// 通过颜色，修改透明度方案
const rgbHandleByA = (r: number, g: number, b: number, min: number, len: number, item: number) => {
  return `rgba( ${r}, ${g}, ${b}, ${len !== 0 ? (item - min) / len : 1})`
}
// 根据颜色，修改HSV的饱和度方案 hsl(20, 100%, 50%), h：基本颜色，s：饱和度 v：亮度
const hsvHandleByS = (
  h: number,
  s: number,
  v: number,
  min: number,
  len: number,
  item: number,
  minS: number,
  maxS: number
) => {
  const sLen = maxS - minS
  const newS = ((item - min) / len) * sLen + minS
  return `hsl( ${h}, ${newS * 100}%, ${v * 100}%)`
}
// 根据颜色，修改HSV的亮度
const hsvHandleByV = (
  h: number,
  s: number,
  v: number,
  min: number,
  len: number,
  item: number,
  minV: number,
  maxV: number
) => {
  // v的合理范围固定为 0.2 - 0.5
  const vLen = maxV - minV
  const newV = ((item - min) / len) * vLen + minV
  return `hsl( ${h}, ${s * 100}%, ${newV * 100}%)`
}
// 根据颜色，修改HSV的亮度和饱和度
const hsvHandleBySV = (
  h: number,
  s: number,
  v: number,
  min: number,
  len: number,
  item: number,
  minV: number,
  maxV: number,
  minS: number,
  maxS: number
) => {
  // v的合理范围固定为 0.4 - 0.8
  // s的合理范围固定是 0.2 - 1.0
  const vLen = maxV - minV
  const sLen = maxS - minS
  const newV = ((len - item + min) / len) * vLen + minV
  const newS = ((item - min) / len) * sLen + minS
  return `hsl( ${h}, ${newS * 100}%, ${newV * 100}%)`
}

export const generateColorList = (type: ColorType, options: any, values: number[]) => {
  let list = []
  const { len, min, max } = handleSortList(values)
  console.log(len, values)
  switch (type) {
    case 'RGBA': {
      const { r = 0, g = 0, b = 0 } = options
      list = values.map((item) => rgbHandleByA(r, g, b, min, len, item))
      break
    }
    case 'HSVS': {
      const { h, s = 1, v = 0.5, minS = 0, maxS = 1 } = options
      list = values.map((item) =>
        hsvHandleByS(Number(h), Number(s), Number(v), min, len, item, Number(minS), Number(maxS))
      )
      break
    }
    case 'HSVV': {
      const { h, s = 1, v = 0.5, minV = 0, maxV = 1 } = options
      list = values.map((item) =>
        hsvHandleByV(Number(h), Number(s), Number(v), min, len, item, Number(minV), Number(maxV))
      )
      break
    }
    case 'HSVSV': {
      const { h, s = 1, v = 0.5, minV, maxV, minS, maxS } = options
      list = values.map((item) =>
        hsvHandleBySV(
          h,
          s,
          v,
          min,
          len,
          item,
          Number(minV),
          Number(maxV),
          Number(minS),
          Number(maxS)
        )
      )
      break
    }
    default: {
      const { r, g, b } = options
      list = values.map((item) => rgbHandleByA(r, g, b, min, len, item))
      break
    }
  }
  return list
}
