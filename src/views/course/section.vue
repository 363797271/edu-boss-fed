<template>
  <div class="course-section">
    <el-card>
      <div slot="header">
        <el-button size="small" type="primary" @click="addSection">添加章节</el-button>
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :expand-on-click-node="false"
        :allow-drop="handleAllowDrop"
        @node-drop="handleSort"
      >
        <div class="inner" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <!-- section -->
          <span class="actions" v-if="data.sectionName">
            <el-button size="small" @click="editSection(data)">编辑</el-button>
            <el-button size="small" type="primary" @click="addLesson(data)">添加课时</el-button>
            <el-select
              size="small"
              v-model="data.status"
              @change="() => changeSectionStatus(data)"
              style="width: 100px;margin-left:10px"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
          <!-- lesson -->
          <span class="actions" v-else>
            <el-button size="small" @click="editLesson(data, node.parent.data)">编辑</el-button>
            <el-button
              size="small"
              type="success"
              @click="
                $router.push({
                  name: 'course-video',
                  params: {
                    courseId,
                    sectionId: node.parent.data.id,
                    lessonId: data.id
                  }
                })
              "
              >上传视频</el-button
            >
            <el-select
              size="small"
              v-model="data.status"
              @change="() => changeLessonStatus(data)"
              style="width: 100px;margin-left:10px"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </span>
        </div>
      </el-tree>
    </el-card>

    <!-- 章节 -->
    <el-dialog title="章节信息" :visible.sync="sectionDialog.visible" width="60%" @close="closeSection">
      <el-form
        ref="sectionForm"
        :model="sectionDialog.data"
        :rules="sectionDialog.rules"
        label-width="150px"
        style="margin-right:120px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="sectionDialog.data.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="sectionDialog.data.sectionName"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            v-model="sectionDialog.data.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input-number v-model="sectionDialog.data.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sectionDialog.visible = false">取 消</el-button>
        <el-button type="primary" :loading="sectionDialog.saveLoading" @click="handleSection">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 课时 -->
    <el-dialog title="课时基本信息" :visible.sync="lessonDialog.visible" width="60%" @close="closeLesson">
      <el-form
        ref="lessonForm"
        :model="lessonDialog.data"
        :rules="lessonDialog.rules"
        label-width="150px"
        style="margin-right:120px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="lessonDialog.data.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="lessonDialog.data.sectionName" disabled></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="lessonDialog.data.theme"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model="lessonDialog.data.duration">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="isFree">
          <el-switch v-model="lessonDialog.data.isFree" active-color="#40586f" inactive-color="#dcdfe6"></el-switch>
        </el-form-item>
        <el-form-item label="课时排序" prop="orderNum">
          <el-input-number v-model="lessonDialog.data.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lessonDialog.visible = false">取 消</el-button>
        <el-button type="primary" :loading="lessonDialog.saveLoading" @click="handleLesson">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getSectionAndLesson, saveOrUpdateLesson, saveOrUpdateSection } from '@/services/course-section'
import { getCourseById, saveOrUpdateCourse } from '@/services/course'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      courseName: '',
      sections: [],
      statusList: [
        {
          label: '已隐藏',
          value: 0
        },
        {
          label: '待更新',
          value: 1
        },
        {
          label: '已更新',
          value: 2
        }
      ],
      defaultProps: {
        children: 'lessonDTOS',
        label(data: any) {
          return data.sectionName || data.theme
        }
      },
      sectionDialog: {
        visible: false,
        data: {},
        rules: {
          courseName: {
            required: true
          },
          sectionName: {
            required: true,
            trigger: 'change',
            message: '请输入章节名称'
          }
        },
        saveLoading: false
      },
      lessonDialog: {
        visible: false,
        data: {},
        rules: {
          courseName: {
            required: true
          },
          sectionName: {
            required: true
          },
          theme: {
            required: true,
            trigger: 'change',
            message: '请输入课时名称'
          },
          duration: {
            required: true,
            trigger: 'change',
            message: '请输入课时时长'
          },
          isFree: {
            required: true
          }
        },
        saveLoading: false
      }
    }
  },
  methods: {
    // 添加章节
    addSection() {
      this.sectionDialog.data = {
        courseId: this.courseId,
        courseName: this.courseName,
        sectionName: '',
        description: '',
        orderNum: '',
        status: 0
      }
      this.sectionDialog.visible = true
    },
    // 添加章节
    editSection(section: any) {
      this.sectionDialog.data = {
        ...section,
        courseId: this.courseId,
        courseName: this.courseName
      }
      this.sectionDialog.visible = true
    },
    closeSection() {
      ;(this.$refs.sectionForm as Form).resetFields()
      this.sectionDialog.visible = false
    },
    async handleSection() {
      this.sectionDialog.saveLoading = true
      const { data } = await saveOrUpdateSection(this.sectionDialog.data)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.closeSection()
        this.loadSection()
      } else {
        this.$message.error('提交失败')
      }
      this.sectionDialog.saveLoading = false
    },
    // 添加课时
    addLesson(section: any) {
      this.lessonDialog.data = {
        courseId: this.courseId,
        courseName: this.courseName,
        sectionId: section.id,
        sectionName: section.sectionName,
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      }
      this.lessonDialog.visible = true
    },
    // 添加课时
    editLesson(lesson: any, section: any) {
      this.lessonDialog.data = {
        ...lesson,
        courseId: this.courseId,
        courseName: this.courseName,
        sectionId: section.id,
        sectionName: section.sectionName
      }
      this.lessonDialog.visible = true
    },
    closeLesson() {
      ;(this.$refs.lessonForm as Form).resetFields()
      this.lessonDialog.visible = false
    },
    async handleLesson() {
      this.lessonDialog.saveLoading = true
      const { data } = await saveOrUpdateLesson(this.lessonDialog.data)
      if (data.code === '000000') {
        this.$message.success('提交成功')
        this.closeLesson()
        this.loadSection()
      } else {
        this.$message.error('提交失败')
      }
      this.lessonDialog.saveLoading = false
    },

    async changeSectionStatus(section: any) {
      const { data } = await saveOrUpdateSection({
        id: section.id,
        status: section.status
      })
      if (data.code === '000000') {
        this.$message.success('提交成功')
      } else {
        this.$message.error('提交失败')
        this.loadSection()
      }
    },
    async changeLessonStatus(lesson: any) {
      const { data } = await saveOrUpdateLesson({
        id: lesson.id,
        status: lesson.status
      })
      if (data.code === '000000') {
        this.$message.success('提交成功')
      } else {
        this.$message.error('提交失败')
        this.loadSection()
      }
    },

    async loadSection() {
      const { data } = await getSectionAndLesson(this.courseId)
      this.sections = data.data
    },

    async loadCourse() {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        this.courseName = data.data.courseName
      }
    },

    // 拖拽
    handleAllowDrop(draggingNode: any, dropNode: any, type: any) {
      // draggingNode 拖拽的节点
      // dropNode 放置的目标节点
      // type 'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后

      return draggingNode.data.sectionId === dropNode.data.sectionId && type !== 'inner'
    },

    async handleSort(dragNode: any, dropNode: any, type: any, event: any) {
      try {
        await Promise.all(
          dropNode.parent.childNodes.map((item: any, index: number) => {
            if (dragNode.data.sectionName) {
              // 章节
              return saveOrUpdateSection({
                courseId: this.courseId,
                id: item.data.id,
                orderNum: index + 1
              })
            } else {
              // 课时
              return saveOrUpdateLesson({
                id: item.data.id,
                orderNum: index + 1
              })
            }
          })
        )
        this.$message.success('排序成功')
      } catch (err) {
        this.$message.error('排序失败')
      }
    }
  },
  created() {
    this.loadCourse()
    this.loadSection()
  }
})
</script>

<style lang="scss" scoped>
::v-deep .el-tree-node__content {
  height: auto;
}
.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}
</style>
