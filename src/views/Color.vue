<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue'
import { generateColorList, colorTypeList, type ColorType } from './utils'
const colorLen = ref<number>(10)

const generateColorType = ref<ColorType>('RGBA')
const getColorOptions = computed(() => {
  let options = null;
  switch (generateColorType.value) {
    case "RGBA":
      options = formRGBAData.value;
      break;
    case "HSVV":
      options = formHSVVData.value;
      break;
    case "HSVS":
      options = formHSVSData.value;
      break;
    case "HSVSV":
      options = formHSVSVData.value;
      break;
    default:
      options = formRGBAData.value;
      break;
  }
  return options;
})
const showColorList = ref<{ name: string; color: string }[]>()
const formRGBAData = ref<{ r: number, g: number; b: number }>({ r: 0, g: 0, b: 0 })
const formHSVVData = ref<{ h: number, minV: number; maxV: number }>({ h: 0, minV: 0, maxV: 0 })
const formHSVSData = ref<{ h: number, minS: number; maxS: number }>({ h: 0, minS: 0, maxS: 0 })
const formHSVSVData = ref<{ h: number, minV: number; maxV: number, minS: number; maxS: number }>({ h: 0, minV: 0, maxV: 0, minS: 0, maxS: 0 })
watch(() => [colorLen.value, generateColorType.value, formRGBAData.value, formHSVSData.value, formHSVVData.value, formHSVSVData.value], () => {
  renderColorLevel()
  console.log('watch')
}, { deep: true })
const renderColorLevel = () => {
  const colorList = generateColorList(generateColorType.value, getColorOptions.value, (new Array(Number(colorLen.value))).fill(0).map((item, index) => index))
  console.log(12312, colorList);
  showColorList.value = (new Array(Number(colorLen.value)).fill(0)).map((item, index) => ({ name: String(index), color: `${colorList[index]}` }))
}
onMounted(() => {
  renderColorLevel()
})
</script>

<template>
  <div class="container">
    <div class="select">
      <el-form label-width="auto" style="width: 300px">
        <el-form-item label="色阶的长度">
          <el-input v-model="colorLen" type="number"></el-input>
        </el-form-item>
      </el-form>
      <el-select v-model="generateColorType" style="width: 300px">
        <el-option v-for="item in colorTypeList" :key="item" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-form v-if="generateColorType === 'RGBA'" label-width="auto" style="width: 300px">
        <el-form-item label="R">
          <el-input v-model="formRGBAData.r" type="number" :min="0" :max="255" :step="1" />
        </el-form-item>
        <el-form-item label="G">
          <el-input v-model="formRGBAData.g" type="number" :min="0" :max="255" :step="1" />
        </el-form-item>
        <el-form-item label="B">
          <el-input v-model="formRGBAData.b" type="number" :min="0" :max="255" :step="1" />
        </el-form-item>
        <el-form-item label="预览基色">
          <div class="preview"
            :style="{ backgroundColor: `rgb(${formRGBAData.r}, ${formRGBAData.g}, ${formRGBAData.b})` }"></div>
        </el-form-item>
      </el-form>
      <el-form v-if="generateColorType === 'HSVS'" label-width="auto" style="width: 300px">
        <el-form-item label="H">
          <el-input v-model="formHSVSData.h" type="number" :min="0" :max="360" :step="1"></el-input>
        </el-form-item>
        <el-form-item label="minS">
          <el-input v-model="formHSVSData.minS" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
        <el-form-item label="maxS">
          <el-input v-model="formHSVSData.maxS" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="generateColorType === 'HSVV'" label-width="auto" style="width: 300px">
        <el-form-item label="H">
          <el-input v-model="formHSVVData.h" type="number" :min="0" :max="360" :step="1"></el-input>
        </el-form-item>
        <el-form-item label="minV">
          <el-input v-model="formHSVVData.minV" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
        <el-form-item label="maxV">
          <el-input v-model="formHSVVData.maxV" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="generateColorType === 'HSVSV'" label-width="auto" style="width: 300px">
        <el-form-item label="H">
          <el-input v-model="formHSVSVData.h" type="number" :min="0" :max="360" :step="1"></el-input>
        </el-form-item>
        <el-form-item label="minS">
          <el-input v-model="formHSVSVData.minS" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
        <el-form-item label="maxS">
          <el-input v-model="formHSVSVData.maxS" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
        <el-form-item label="minV">
          <el-input v-model="formHSVSVData.minV" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
        <el-form-item label="maxV">
          <el-input v-model="formHSVSVData.maxV" type="number" :min="0" :max="1" :step="0.1"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="boxs">
      <div class="box" v-for="item in showColorList" :key="item.name" :style="{ 'background-color': item.color }">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.container {
  display: flex;

  .select {
    display: flex;
  }

  .boxs {
    margin-left: 20px;
    display: flex;
    flex-direction: column;

    .box {
      text-align: center;
      line-height: 50px;
      width: 200px;
      height: 50px;
    }
  }

}

.preview {
  border: 1px solid black;
  width: 100px;
  height: 20px;
}
</style>
