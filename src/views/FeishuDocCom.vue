<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import CryptoJS from 'crypto-js'
const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const sha1 = async (message: string) => {
  // 将字符串转换为ArrayBuffer
  // const encoder = new TextEncoder();
  // const data = encoder.encode(message);

  // // 使用SubtleCrypto接口进行SHA-1加密
  // const hashBuffer = await crypto.subtle.digest("SHA-1", data)
  // // 将ArrayBuffer转换为十六进制字符串
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return CryptoJS.SHA1(message).toString(CryptoJS.enc.Hex);

}
const login = async () => {
  try {
    const timestamp = (new Date()).getTime()
    const nonceStr = generateRandomString(10)
    const user_access_token = 't-g1046jgn6Y5NN3U7JVI67YUV54WIDQIOHAXJVZJ2'
    const ticket = 'g1046jgGMA3G44EUHAPL23IFVG6VV7N5N4ZUKZDV';
    const appId = 'cli_a6f8c4c8ccfe100b'
    const url = window.location.href.split('?')[0]
    const message = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`
    const signature = await sha1(message)
    const openId = 'ou_7dbb89169a7a17bc8aa1142a69781bd5'
    const data = await window.webComponent.config({
      openId,    // 当前登录用户的open id，要确保与生成 signature 使用的 user_access_token 相对应，使用 app_access_token 时此项不填。
      signature, // 签名
      appId,     // 应用 appId
      timestamp, // 时间戳（毫秒）
      nonceStr,  // 随机字符串
      url,       // 参与签名加密计算的url
      jsApiList: ['DocsComponent'], // 指定要使用的组件，请根据对应组件的开发文档填写。如云文档组件，填写['DocsComponent']
      lang: 'zh',      // 指定组件的国际化语言：en-英文、zh-中文、ja-日文
    })
    console.log(111, data);
  } catch (e) {
    console.log(123123123, e);
  }
}
const DomRef = ref<HTMLElement | null>(null)
const DomRef1 = ref<HTMLElement | null>(null)
let myComponent;
const render = () => {
  myComponent = window.webComponent.render(
    'DocsComponent',
    { //组件参数
      src: 'https://test-d23rz22rzaxy.feishu.cn/docx/OTqjdSbz2oxgAvx5tOrcJdS9n3e',
      height: '800px',
      width: '100%',
    },
    DomRef.value
    // document.querySelector('#your-mount-point'), // 将组件挂在到哪个元素上
  )
  window.doc = myComponent
  myComponent.config.setFeatureConfig({
    // 详细参数请参考 FEATURE & Options
    HEADER: {
      enable: false, // 隐藏头部
    },
    FOOTER: {
      enable: false
    },
    LIKE: {
      enable: false
    },
    COMMENT: {
      partial: {
        enable: false
      },
      global: {
        enable: false
      }
    }
  });
}

const jietu = () => {
  try {
    html2canvas(DomRef1.value).then(canvas => {
      // 将Canvas转换为图片URL
      var imgData = canvas.toDataURL('image/png');
      console.log(123123, imgData);
      // 显示图片
      document.getElementById('screenshotImage').src = imgData;
    });
  } catch (e) {
    console.log(111, e);
  }
}
onMounted(async () => {
  await login()
  console.log(123123);
  render()
})
</script>

<template>
  <div class="box">
    <div ref="DomRef" id="your-mount-point"></div>
  </div>
  <!-- <div ref="DomRef1">tqeqwewqewq</div> -->
  <!-- <button @click="jietu">test</button> -->
  <!-- <img id="screenshotImage" src="" /> -->
</template>
<style>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}

#your-mount-point {
  width: 800px;
  height: 800px;
  border: 1px solid red;
  overflow: scroll;
}
</style>