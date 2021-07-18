<template>
  <div>
    <!-------------------- 面包屑导航区 -------------------->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-------------------- 卡片视图区域 -------------------->
    <el-card>
      <!-- 添加分类按钮区域 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddCateDialogVisible"
            >添加分类</el-button
          ></el-col
        >
      </el-row>

      <!-- 分类列表区域 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showCateEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 主体部分 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" prop="cat_name">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!---------------- 编辑分类的对画框 ---------------->
    <el-dialog
      title="修改分类"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体内容 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  created() {
    this.getCateList()
  },
  props: {},
  // ------------------ 数据 ---------------------
  data() {
    return {
      //   查询条件
      querInfo: {
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页显示几条数据
        pagesize: 5,
      },
      // 获取所有的商品分类列表
      cateList: [],
      // 总数据条数
      total: 0,
      //   为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示当前列定义为模板列
          type: 'template',
          // 当前这一列使用模板名称
          template: 'opt',
        },
      ],
      // 添加分类的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 父级分类的id
        cat_pid: 0,
        // 将要添加的分类的名称
        cat_name: '',
        // 分类的等级 默认是添加1级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' },
        ],
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        // 具体选中的选项
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 父子嵌套的属性
        children: 'children',
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // ---------- 编辑按钮 -----------
      editDialogVisible: false,
      editForm: { cat_name: '', cat_id: '' },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' },
        ],
      },
    }
  },
  // ------------------ 方法 ---------------------
  methods: {
    // ---------- 表格区域 -----------
    //   获取所有的商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      //   console.log(res.data.result)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // ----------- 分页区域 ------------
    // 监听 pagesize 的改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage
      this.getCateList()
    },
    // ----------- 添加分类按钮 ------------
    // 点击按钮，添加分类对话框的展示
    showAddCateDialogVisible() {
      this.addCateDialogVisible = true
      // 获取父级分类的数据列表
      this.getParentCateList()
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取获取父级分类数据失败！')
      }

      this.parentCateList = res.data
      // this.total = res.data.total
      console.log(res.data)
    },
    parentCateChanged() {
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
      console.log(this.selectedKeys)
    },
    addCate() {
      this.$refs.addCateFormRef.validate(async (value) => {
        if (!value) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) return this.$message.error('添加分类失败!')
        this.$message.success('添加分类成功!')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },

    // ----------- 编辑分类按钮 ------------
    async showCateEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询分类信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.editDialogVisible = false
    },
    // 修改分类信息并提交
    editUserinfo() {
      this.$refs.editFormRef.validate(async (value) => {
        if (!value) return
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id
        )
        if (res.meta.status !== 200)
          return this.$message.error('更新用户信息失败!')
        this.$message.success('更新用户信息成功!')
        //关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getCateList()
      })
    },
    // ----------- 删除分类按钮 ------------
    async removeCateById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 如果用户确认删除，返回值是字符串 confirm
      // 如果用户取消删除，返回值是字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户信息失败!')
      }
      this.$message.success('删除用户信息成功!')
      this.getCateList()
    },
  },
  components: {},
}
</script>

<style>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
