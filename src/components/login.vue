<template>
  <div class="login_container">
    <div class="login_box">
      <!----------- 头像区域 ----------->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!----------- 登录from表单区域 ------------>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormrules"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单进行验证
      loginFormrules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 重置表单  把填写的内容进行删除
    resetloginForm() {
      //   ref="loginFormRef"  "loginFormRef"是组件的实例对象 是表单的引用对象
      //   resetFields()对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      // validate()对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
      // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      this.$refs.loginFormRef.validate(async (value) => {
        // console.log(value);
        // 如果value是false  说明验证是失败的    取反是为了让value为false
        if (!value) return

        // -----------------------------------------------

        // const res = await this.$http.post("login", this.loginForm);
        // // 这个是一个promice对象  await async是更好地解析promice  从而拿到具体的相应对象
        // console.log(res);

        // ------------------------------------------------

        // 因为在min.js引入axios时， 配置了请求的根路径，所以 post中 请求地址可以直接写login
        // 而请求的同时需要携带username和password 所以第二个参数就是loginForm    上边定义了
        // data是我们想要的数据  所以 data进行结构赋值  data: res所以会这样写
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        // 判断res中的状态码
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        // 这是第二种写法
        // this.$message({
        //   message: "恭喜你，登录成功",
        //   type: "success",
        // });
        this.$message.success('登录成功!')

        // 1、将登录成功之后的token，保存到客户端的sessionStorage中
        // 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        // 1.2 token只应在当前网站打开期间生效，所以将token 保存在sessionStorage中
        window.sessionStorage.setItem('token', res.data.token) //setItem('键'，值) 是把token保存到sessionStorage的方法
        // 2、通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    },
  },
  components: {},
}
</script>

<style>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>
