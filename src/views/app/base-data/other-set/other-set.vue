<style lang="less" scoped>
  @import '../deptm-set/deptm-set.less';
</style>

<template>
    <div>
        <card class="margin-bottom-10">
            <Input v-model="value" placeholder="拼音检索" style="width: 175px" @on-change="check()" ></Input>
            <span style="color:#ccc;font-size:12px;"> * 只允许输入拼音首字母，如:gs 公司</span>
            <i-button class="pull-right" type="primary" @click="modal1 = true" icon="plus">新增</i-button>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small"  border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 新增模态框 -->
        <Modal  v-model="modal1" icon="clipboard" :mask-closable="false" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增部分单位信息</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <FormItem label="分类" prop="Class_ID">
                    <Select  v-model="formValidate.Class_ID" class="select" style="width: 300px">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select> {{formValidate.class_ID}}
                </FormItem>
                <FormItem label="变量名称" prop="cmp_FName">
                    <Input   v-model="formValidate.cmp_FName" placeholder="请输入公司全称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="变量值" prop="subClass_Value">
                    <Input   v-model="formValidate.subClass_Value" placeholder="请输入公司简称" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
        <!-- 修改模态框 -->
        <Modal  v-model="modalModify" :mask-closable="false">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改部门单位信息</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <FormItem label="分类" prop="Class_ID">
                    <Select  v-model="formValidate.Class_ID" class="select" style="width: 300px">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select> {{formValidate.class_ID}}
                </FormItem>
                <FormItem label="变量名称" prop="cmp_FName">
                    <Input   :value="this.indexData.cmp_FName" placeholder="请输入公司全称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="变量值" prop="subClass_Value">
                    <Input   :value="this.indexData.subClass_Value" placeholder="请输入公司简称" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    data () {
        return {
            modal1: false,               // 新增按钮--模态框
            modal2: false,               // 修改按钮--模态框
            options: '',                 // 用来存储查询函数的帅选字段
            data: [],                    // 第一个select下拉列表数据
            data1: [],                   // 表格数据
            skip: 0,                     // 数据起始值
            take: 10 ,                   // 一次获取的条数--一页显示的条数
            total: 100,                  // 数据总数
            pageCurrent: 1,              // 当前页
            value: '',                   // 拼音检索input的值    
            pageSize: 10,                // 每页的数据
            indexData: [],               // 删除模态框所用的表格行数据
            modalModify: false,          // 修改按钮--模态框
            columns: [                   // 表格表头/列信息
                {type: 'selection', width: 60,align: 'center',width: 60},
                {key: "id", title: "ID",align: 'center',width: 60},
                {key: "cmp_FName", title: "变量名称",align: 'center',width:120},
                {key: "subClass_Value", title: "变量值",align: 'center',},
                {key: "pinyin", title: "拼音",align: 'center',width: 100 },
                {key: "isEnable", title: "启用状态",align: 'center',width: 100,},
                {title: '操作',align: 'center',width: 200,key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => { this.lock(params.index)}
                                    }}, '锁定'),
                                h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => { this.modify(params.index)}
                                    }}, '编辑'),
                                h('Button', {props: {
                                    type: 'warning',size: 'small'},
                                    on: {click: () => { this.remove(params.index) }}}, '删除')
                                     ]);}
                    }
               ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate:{
                    "ID": "",
                    "Class_ID": "",
                    "subClass_ID": "",
                    "subClass_Value": "",
                    "cmp_FName": "",
                    "cmp_Contact": "",
                    "cmp_Phone": "",
                    "cmp_Adress": "",
                    "cmp_DepositBank": "",
                    "cmp_Account": "",
                    "cmp_Tax": "",
                    "zip_Code": "",
                    "isEnable": true,
                    "pinYin": "",
                    "remarks": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    Class_ID: [
                        { required: true, message: '不能为空', trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    cmp_FName: [
                        { required: true, message: '不能为空', trigger: 'blur' },
                        { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            // 修改数据模态框---确认
            amend (index) {
                let amend_data = this.data1[index];
                base.putAjaxData(base.baseURL + 'PublicApi/Bs_CommInfo',JSON.stringify(this.amend_data));
                alert("提交成功")
            },
            // 表格里面的单行修改模态框
            modify (index) {
                console.log(this.data1[index]);
                this.modalModify = true;
                this.indexData = this.data1[index];
            },
            // 表格里面单行删除
            remove (index) {
                let  con=confirm("您即将删除这条信息,确认删除请按确定,否则请按取消!")
                    if (con==true){
                        let _self = this;
                        base.deleteAjaxData(base.baseURL + 'PublicApi/Bs_CommInfo?ID=' + this.data1[index].id);
                        // alert("删除成功,请刷新页面!")
                        this.$Message.info({
                            content: '删除成功',
                            duration: 10,
                            closable: true
                            // onClose: alert("chenggong")
                        });
                     }
                    else{
                        alert("您取消了删除")
                        }
            },
            // 查询函数
            check(skip,take){
                this.options = '';              // 清空options
                  let _self = this;
                 if(this.value){
                    this.options = '&pinyinContains='+this.value;
                }else{
                     base.getAjaxData(base.baseURL + 'PublicApi/Bs_CommInfo?>Class_ID=109&orderBy=-PinYin&Skip=' + this.skip + '&take=' + this.take, (e) => {
                        _self.data1 = e.results;
                        _self.total = e.total;
                    })
                }
                if( skip == undefined ) skip = 0;                 
                if( take == undefined ) take = this.pageSize;   
                // console.log(base.baseURL + '/PublicApi/Bs_CommInfo?Skip=' + this.skip + '&take=' + this.take + this.options);
                base.getAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo?>Class_ID=109&orderBy=-PinYin&Skip=' + skip + '&take=' + take + this.options, (e)=>{
                    _self.data1 = e.results;
                    _self.total = e.total;
                })
            },
            // 分页
            changePage (index) {
            // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.pageCurrent = index;          // 当前页
                let _size = this.pageSize;         // 一页显示的条数
                let _skip = (index-1)*_size;       // 偏移量--数据的起始位置
                this.check(_skip,_size);
            },
            changePageSize (size) {
                this.pageSize = size;                //一页显示的条数
                let _current = this.pageCurrent;     //当前页
                let _skip = (_current-1)*size;       // 偏移量---数据的起始位置
                this.check(_skip, size);
            },
            // 表单提交
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        // console.log(this.formValidate)
                        base.postAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo',JSON.stringify(this.formValidate));
                        this.$Message.info({
                            content: '登记保存成功,您可以继续登记下条记录,或者关闭登记窗口!',
                            duration: 10,
                            closable: true
                        });
                    } else {
                        this.$Message.error('保存失败');
                    }
                })
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 解锁
            lock(index){
                let isEnable_status = this.data1[index].isEnable;
                // console.log(this.data1[index].id);
                if(isEnable_status===1){
                     isEnable_status=2
                     base.putAjaxData(base.baseURL + '/PublicApi/Bs_commisEableupd_view?IsEnable=' + isEnable_status + '&ID=' + this.data1[index].id);
                    
                }else{
                    isEnable_status=1
                    base.putAjaxData(base.baseURL + '/PublicApi/Bs_commisEableupd_view?IsEnable=' + isEnable_status + '&ID=' + this.data1[index].id);
                }
                console.log(this.data1[index].id);
                console.log(isEnable_status);
            }
        },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            let _self = this;
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_CommInfo?>Class_ID=109&orderBy=-PinYin&Skip=' + this.skip + '&take=' + this.take, (e) => {
                _self.data1 = e.results;
                _self.total = e.total;
            })
            // 第一个下拉框获取的数据--大类
            base.getAjaxData(base.baseURL + '/PublicApi/Bs_ClassSet?>Class_ID=109', (e) => {
                _self.data = e.results;
            });
        }
    }
</script>