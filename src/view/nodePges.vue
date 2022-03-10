<script setup>
import { reactive } from "@vue/reactivity";

const form = reactive({
    classify:'静态'
})
</script>
<template>
  <div class="content">
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="节点分类：">
        <el-radio-group v-model="form.classify" size="large">
          <el-radio-button label="静态"></el-radio-button>
          <el-radio-button label="动态"></el-radio-button>
          <el-radio-button label="全国"></el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.content {
  width: 1230px;
  margin: 0 auto;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 20px;
  grid-template-rows: 160px 1fr 160px;
}
</style>