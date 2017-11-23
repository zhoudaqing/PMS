<style lang="less" scoped>
@import './deptm-set.less';
</style>

<template>
    <div>
        <card class="margin-bottom-10">
            <div class="select-col" >
                <div class="div">
                    <label class="label" for="for"  filterable>基础分类:</label>
                    <Select v-model="material" class="select" >
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.Class_ID" >{{ item.class_Value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for">公司简称:</label>
                    <Select v-model="com_name" class="select" filterable>
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in company" :value="item" :key="item">{{item}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for" >联系人:</label>
                    <Select  v-model="conta" class="select" filterable>
                        <Option  value="全部" >全部</Option>
                        <Option  v-for="item in contact" :value="item" :key="item" >{{ item }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <i-button type="primary" icon="ios-search" @click="check()" >查询</i-button>
                </div>
                <div class="last">
                    <i-button type="primary" @click="modal1 = true" icon="plus">新增</i-button>
                </div>
            </div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 新增模态框 -->
        <Modal class="modal" v-model="modal1" icon="clipboard" :mask-closable="false" :styles="{top: '20px'}" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增基础信息</span>
            </p>
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="formValidate.class_ID" class="select" style="width: 300px">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.Class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="单位简称" prop="subClass_Value">
                    <Input  class="select" v-model="formValidate.subClass_Value" placeholder="请输入公司简称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="单位全称" prop="cmp_FName">
                    <Input  class="select" v-model="formValidate.cmp_FName" placeholder="请输入公司全称" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="联系人" prop="cmp_Contact">
                    <Input  class="select" v-model="formValidate.cmp_Contact" placeholder="请输入公司联系人" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="电话" prop="cmp_Phone">
                    <Input  class="select" v-model="formValidate.cmp_Phone" placeholder="请输入联系电话" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="地址" prop="cmp_Adress">
                    <Input  class="select" v-model="formValidate.cmp_Adress" placeholder="请输入公司地址" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="开户银行" prop="cmp_DepositBank">
                    <Input class="select" v-model="formValidate.cmp_DepositBank" placeholder="请输入开户银行" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="账号" prop="cmp_Account">
                    <Input class="select" v-model="formValidate.cmp_Account" placeholder="请输入开户行账号" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="税号" prop="cmp_Tax">
                    <Input class="select" v-model="formValidate.cmp_Tax" placeholder="请输入邮政编码" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="邮政编码" prop="zip_Code">
                    <Input class="select" v-model="formValidate.zip_Code" placeholder="请输入税号" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="备注" prop="remarks">
                    <Input class="select" v-model="formValidate.remarks"  placeholder="请备注信息" style="width: 300px"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
             <div slot="footer">
            </div>
        </Modal>
        <!-- 修改模态框 -->
        <Modal class="modal" v-model="modalModify" :mask-closable="false">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改信息</span>
            </p>
             <div slot="footer">
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
            material:'',                 // 与查询函数绑定的第一个select的值
            conta:'',                    // 与查询函数绑定的第三个select的值
            com_name:'',                 // 与查询函数绑定的第二个select的值
            data: [],                    // 第一个select下拉列表数据
            company:[],                  // 第二个下拉框的数据
            contact:[],                  // 第三个下拉框的数据
            data1: [],                   // 表格数据
            skip: 0,                     // 数据起始值
            take: 10 ,                   // 一次获取的条数--一页显示的条数
            total: 100,                  // 数据总数
            pageCurrent: 1,              // 当前页
            // value: '',                // 拼音检索input的值    
            pageSize: 10,                // 每页的数据
            indexData: [],               // 删除模态框所用的表格行数据
            modalModify: false,          // 修改按钮--模态框
            columns: [                   // 表格表头/列信息
                {type: 'selection', width: 60,align: 'center',width: 60},
                {key: "id", title: "ID",align: 'center',width: 60},
                {key: "subClass_Value", title: "名称",align: 'center',},
                {key: "cmp_Contact", title: "联系人",align: 'center',width:120},
                {key: "cmp_Phone", title: "电话",align: 'center', },
                {key: "cmp_Adress", title: "地址",align: 'center',width: 300, },
                {key: "pinyin", title: "拼音",align: 'center',width: 100 },
                {key: "isEnable", title: "启用状态",align: 'center',width: 100,},
                {title: '操作',align: 'center',width: 200,key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => {this.modify(params.index)}
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
                    "class_ID": "",
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
                    "isEnable": "int",
                    "pinYin": "",
                    "remarks": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    class_ID: [
                        { required: true, message: '分类不能为空', trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                        { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    cmp_FName: [
                        { required: true, message: '公司全称不能为空', trigger: 'blur' },
                        { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    cmp_Contact: [
                        { required: true, message: '联系人不能为空', trigger: 'blur' },
                        // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    cmp_Phone: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        // { type: 'number', min:11, message: '电话号码不能少于11位', trigger: 'blur' }，
                        // {type: 'number',min:11,pattern:/^[0-9]+$/,message:'请输入数字',trigger:'blur'}
                        // {type: 'number',required:true,pattern:/^[a-z0-9]+$/,message:'请输入数字',trigger:'change'}
                    ],
                    cmp_Adress: [
                        // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 修改数据模态框---确认
            amend () {
                console.log(this.indexData);
                let input=document.querySelectorAll(input);
                let value=input.value;
                if(value.onchange){
                    value=input.value;
                   indexData.push
                }
                this.putAjaxData('http://127.0.0.1:9000/PublicApi/Bs_CommInfo',JSON.stringify(this.indexData));
                alert("提交成功")
            },
            // 模态框--取消
            cancel () {
                close();
            },
            // 表格里面的单行修改模态框
            modify (index) {
                this.modalModify = true;
                this.indexData = this.data1[index];
            },
            // 表格里面单行删除
            remove (index) {
                let  con=confirm("您即将删除这条信息,确认删除请按确定,否则请按取消!")
                    if (con==true){
                        this.deleteAjaxData('http://127.0.0.1:9000/PublicApi/Bs_CommInfo?ID=' + this.data1[index].id);
                        alert("删除成功,请刷新页面!")
                     }
                    else{
                        alert("您取消了删除")
                        }
            },
            // 查询函数
            check(skip,take){
                  this.options = '';              // 清空options
                  let _self = this;
                if(this.material) {
                    _self.options += '&Class_ID=' + _self.material;
                }
                if(this.com_name) {
                    _self.options += '&subClass_Value=' + _self.com_name;
                }
                if(this.conta) {
                    _self.options += '&cmp_Contact=' + _self.conta;
                }
                if( skip == undefined ) skip = 0;                 
                if( take == undefined ) take = this.pageSize;      
                // console.log(base.baseURL + '/PublicApi/Bs_CommInfo?Skip=' + this.skip + '&take=' + this.take + this.options);
                base.getAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo?Skip=' + skip + '&take=' + take + this.options, (e)=>{
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
                        this.postAjaxData('http://127.0.0.1:9000/PublicApi/Bs_CommInfo',JSON.stringify(this.formValidate));
                        alert('登记保存成功,您可以继续登记下条记录,或者关闭登记窗口!');
                    } else {
                        this.$Message.error('保存失败');
                    }
                })
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            let _self = this;
            base.getAjaxData(base.baseURL + '/PublicApi/Bs_CommInfo_view?Skip=' + this.skip + '&take=' + this.take, (e) => {
                _self.data1 = e.results;
                _self.total = e.total;
            })
            // 第一个下拉框获取的数据--大类
            base.getAjaxData(base.baseURL + '/PublicApi/Bs_ClassSet?Class_ID%3C=105', (e) => {
                _self.data = e.results;
            });
            // 第二个下拉框获取的数据--单位名称
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_comminfo_view?&Comm_ID%3C=10510001&', (e)=>{
                let _self = this;
                e.results.forEach(function(item) {
                    if(_self.company.indexOf(item.subClass_Value)) {
                        _self.company.push(item.subClass_Value)
                    }
                })
            });
             // 第三个下拉框获取的数据--联系人
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_comminfo_view?&Comm_ID%3C=10510001&', (e)=>{
                let _self = this;
                e.results.forEach(function(item) {
                    if(_self.contact.indexOf(item.cmp_Contact)) {
                        _self.contact.push(item.cmp_Contact)
                    }
                })
            });
        }
    }
</script>


