<template>
  <el-card>
    <div slot="header">
      <el-steps :active="activeStep" simple>
        <el-step
          v-for="(item, index) in steps"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          @click.native="activeStep = index"
        ></el-step>
      </el-steps>
    </div>
    <el-form label-width="120px" :model="form" :rules="rules">
      <div v-show="activeStep === 0">
        <el-form-item label="名称" prop="courseName">
          <el-input v-model="form.courseName" show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="form.brief" show-word-limit maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="form.teacherDTO.teacherName" show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="form.teacherDTO.position" show-word-limit maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="form.teacherDTO.description" show-word-limit maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-row>
            <el-col :span="12" style="padding-right:20px">
              <el-input v-model="form.previewFirstField" show-word-limit maxlength="20"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.previewSecondField" show-word-limit maxlength="20"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="form.sortNum"></el-input-number>
        </el-form-item>
      </div>
      <div v-show="activeStep === 1">
        <el-form-item label="课程封面">
          <!--
              1. 组件需要根据绑定的数据进行图片预览
              2. 组件需要把上传成功的图片地址同步到绑定的数据中
              v-model 的本质还是父子组件通信
                1. 它会给子组件传递一个名叫 value 的数据（Props）
                2. 默认监听 input 事件，修改绑定的数据（自定义事件）
            -->
          <course-image v-model="form.courseListImg" />
        </el-form-item>
        <el-form-item label="解锁封面">
          <course-image v-model="form.courseImgUrl" />
        </el-form-item>
      </div>
      <div v-show="activeStep === 2">
        <el-form-item label="售卖价格" prop="discounts">
          <el-input v-model="form.discounts">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input v-model="form.price">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sales">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-input v-model="form.priceTag" show-word-limit maxlength="4"></el-input>
        </el-form-item>
      </div>
      <div v-show="activeStep === 3">
        <el-form-item label="限时秒杀开关">
          <el-switch v-model="form.activityCourse" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <template v-if="form.activityCourse">
          <el-form-item label="开始时间" prop="activityCourseDTO.beginTime">
            <el-date-picker
              v-model="form.activityCourseDTO.beginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="activityCourseDTO.endTime">
            <el-date-picker
              v-model="form.activityCourseDTO.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀价" prop="activityCourseDTO.amount">
            <el-input v-model="form.activityCourseDTO.amount">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存" prop="activityCourseDTO.stock">
            <el-input v-model="form.activityCourseDTO.stock">
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>
      </div>
      <div v-show="activeStep === 4">
        <el-form-item label="课程详情">
          <text-editor v-model="form.courseDescriptionMarkDown" />
        </el-form-item>
        <el-form-item label="是否发布">
          <el-switch
            v-model="form.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button @click="activeStep++" v-if="activeStep < 4 && activeStep >= 0">下一步</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { getCourseById, saveOrUpdateCourse } from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from '@/components/TextEditor/index.vue'

export default Vue.extend({
  name: 'CreateOrUpdateCourse',
  components: { CourseImage, TextEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      activeStep: 0,
      steps: [
        {
          title: '基本信息',
          icon: 'el-icon-edit'
        },
        {
          title: '课程封面',
          icon: 'el-icon-edit'
        },
        {
          title: '销售信息',
          icon: 'el-icon-edit'
        },
        {
          title: '秒杀活动',
          icon: 'el-icon-edit'
        },
        {
          title: '课程详情',
          icon: 'el-icon-edit'
        }
      ],
      form: {
        courseName: '',
        brief: '',
        teacherDTO: {
          teacherName: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: '',
        discounts: '',
        priceTag: '',
        previewFirstField: '',
        previewSecondField: '',
        status: 1,
        discountsTag: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: '',
        sales: '',
        activityCourse: false,
        activityCourseDTO: {
          beginTime: '',
          endTime: '',
          amount: '',
          stock: ''
        }
      },
      rules: {
        courseName: {
          required: true,
          message: '请输入课程名称',
          trigger: 'change'
        },
        brief: {
          required: true,
          message: '请输入课程简介',
          trigger: 'change'
        },
        discounts: {
          required: true,
          message: '请输入售卖价格',
          trigger: 'change'
        },
        'activityCourseDTO.beginTime': {
          required: true,
          message: '请输入开始时间',
          trigger: 'change'
        },
        'activityCourseDTO.endTime': {
          required: true,
          message: '请输入结束时间',
          trigger: 'change'
        },
        'activityCourseDTO.amount': {
          required: true,
          message: '请输入秒杀价',
          trigger: 'change'
        },
        'activityCourseDTO.stock': {
          required: true,
          message: '请输入秒杀库存',
          trigger: 'change'
        }
      },
      saveLoading: false
    }
  },
  methods: {
    async handleSave() {
      this.saveLoading = true
      const { data } = await saveOrUpdateCourse(this.form)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.$router.push({
          name: 'course'
        })
      } else {
        this.$message.error('提交失败')
      }
      this.saveLoading = false
    },

    async loadCourse() {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        this.form = data.data
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.loadCourse()
    }
  }
})
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
