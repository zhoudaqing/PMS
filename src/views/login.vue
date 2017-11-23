<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import base from '@/libs/base';
export default {
    data () {
        return {
            form: {
                userName: 'datist',
                password: 'datist2016'
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            let _self = this;
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    $.ajax({
                        url: 'http://61.185.0.135:6988/Auth/datis',
                        data: {
                            provider: 'credentials',
                            UserName: this.form.userName,
                            Password: this.form.password,
                            RememberMe: true
                        },
                        type: "POST",
                        dataType: 'JSON',
                        success: function (response, status, xhr) {
                            Cookies.set('user', _self.form.userName);
                            Cookies.set('pms-ss-id', response.sessionId);
                            Cookies.set('pms-X-UAId', response.userId);
                            _self.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            if (_self.form.userName === 'datist') {
                                Cookies.set('access', 0);
                            } else {
                                Cookies.set('access', 1);
                            }
                            _self.$router.push({
                                name: 'home_index'
                            });
                        },
                        error: function (er) {
                            console.log(er);
                            alert('请确认用户名密码是否正确!');
                        }
                    });
                }
            });
        }
    }
};
</script>

<style>

</style>
