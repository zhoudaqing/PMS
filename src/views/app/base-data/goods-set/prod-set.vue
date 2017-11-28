<style lang="less" scoped>
@import '../../page-common.less';
</style>
<template>
    <div>
        <card class="margin-bottom-10">
            <Input v-model="value" placeholder="拼音检索" style="width: 175px" @on-change="check()" ></Input>
            <span style="color:#ccc;font-size:12px;"> * 只允许输入拼音首字母，如:gs 公司</span>
            <i-button class="pull-right" type="primary" @click="addModal = true" icon="plus">新增</i-button>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer placement="top" :transfer="true"></Page>
            </div>
        </card>
        <!-- 新增模态框 -->
        <Modal class="modal-common" v-model="addModal" icon="clipboard" :mask-closable="false" class-name="vertical-center-modal" >
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>新增产品信息</span>
            </p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="formValidate.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品品名" prop="subClass_Value">
                    <Input  class="select" v-model="formValidate.subClass_Value" placeholder="请输入产品品名" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="产品规格" prop="specifications">
                    <Input  class="select" v-model="formValidate.specifications" placeholder="请输入产品规格" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="钢级" prop="steelGrade">
                    <Input  class="select" v-model="formValidate.steelGrade" placeholder="请输入产品钢级" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="单位" prop="unit">
                    <Input  class="select" v-model="formValidate.unit" placeholder="请输入产品单位" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="螺纹类型" prop="threadType">
                    <Input class="select" v-model="formValidate.threadType" placeholder="请输入产品螺纹类型" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="长度范围" prop="lengthRange">
                    <Input class="select" v-model="formValidate.lengthRange" placeholder="请输入长度范围" style="width: 300px"></Input>
                </FormItem>
            </Form>
             <div slot="footer">
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
            </div>
        </Modal>
        <!-- 修改模态框 -->
        <Modal class="modal-common" v-model="editModal" :mask-closable="false">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>修改产品信息</span>
            </p>
           <Form ref="indexData" :model="indexData" :rules="ruleValidate" :label-width="120">
                <FormItem label="分类" prop="class_ID">
                    <Select  v-model="indexData.class_ID" class="select" style="width: 300px" :transfer="true">
                        <Option  v-for="item in data" :value="item.class_ID" :key="item.class_ID">{{ item.class_Value }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品品名" prop="subClass_Value">
                    <Input  class="select" v-model="indexData.subClass_Value" placeholder="请输入产品品名" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="产品规格" prop="specifications">
                    <Input  class="select" v-model="indexData.specifications" placeholder="请输入产品规格" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="钢级" prop="steelGrade">
                    <Input  class="select" v-model="indexData.steelGrade" placeholder="请输入产品钢级" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="单位" prop="unit">
                    <Input  class="select" v-model="indexData.unit" placeholder="请输入产品单位" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="螺纹类型" prop="threadType">
                    <Input class="select" v-model="indexData.threadType" placeholder="请输入产品螺纹类型" style="width: 300px"></Input>
                </FormItem>
                <FormItem label="长度范围" prop="lengthRange">
                    <Input class="select" v-model="indexData.lengthRange" placeholder="请输入长度范围" style="width: 300px"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="handleReset('indexData')" style="margin-left: 8px">重置</Button>
                <Button type="primary" @click="amend('indexData')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import base from '@/libs/base';

 export default {
        data () {
            return {
                addModal: false,                // 新增按钮--模态框
                editModal: false,              // 修改按钮--模态框
                options: '',                    // 用来存储查询函数的帅选字段
                data: [],                       // 第一个select下拉列表数据
                data1: [],                      // 表格数据
                skip: 0,                        // 数据起始值
                take: 10 ,                      // 一次获取的条数--一页显示的条数
                total: 100,                     // 数据总数
                pageCurrent: 1,                 // 当前页
                value: '',                      // 拼音检索input的值    
                pageSize: 10,                   // 每页的数据
                indexData: [],                  // 删除模态框所用的表格行数据
                columns: [                      // 表格表头/列信息
                    {type: 'selection', width: 60,align: 'center',width: 60},
                    {key: "id", title: "ID",align: 'center',width: 60},
                    {key: "subClass_Value", title: "品名",align: 'center',width: 150},
                    {key: "specifications", title: "规格",align: 'center',width: 200 },
                    {key: "steelGrade", title: "钢级",align: 'center', width:80},
                    {key: "chemicalPara", title: "化学成分",align: 'center',width:100 },
                    {key: "unit", title: "单位",align: 'center', width: 80},
                    {key: "threadType", title: "螺纹类型",align: 'center', width: 90},
                    {key: "lengthRange", title: "长度范围",align: 'center', width: 90},
                    {key: "pinyin", title: "拼音",align: 'center',width: 80 },
                    {key: "isEnable", title: "启用状态",align: 'center',},
                    {title: '操作',align: 'center',key: 'handle',width: 200,
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                    props:  { type: 'default',size: 'small'},
                                    style: {marginRight: '5px' },
                                    on: {click: () => {this.lock(params.index)}
                                    }}, '锁定'),
                                    h('Button', {props: {
                                        type: 'default',size: 'small'},
                                        style: {marginRight: '5px' },
                                        on: {click: () => {this.modify(params.index)}
                                        }}, '修改'),
                                    h('Button', {props: {
                                        type: 'warning',size: 'small'},
                                        on: {click: () => { this.remove(params.index) }}}, '删除') ]);}
                        }
                ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate: {
                    "ID": "int",
                    "class_ID": '',
                    "subClass_ID": "",
                    "subClass_Value": "",
                    "subSubClass_ID": "",
                    "steelGrade": "",
                    "specifications": "",
                    "unit": "",
                    "unitPrice": 0,
                    "stockNum": "int",
                    "stockWeight": 0,
                    "yJ_UpLimit": 0,
                    "yJ_DownLimit": 0,
                    "tecSpecifications": "",
                    "physicalPara": "",
                    "chemicalPara": "",
                    "testMethod": "",
                    "standardRequire": "",
                    "threadType": "",
                    "lengthRange": "",
                    "isEnable": true,
                    "upDateTime": "int",
                    "remark": ""
                },
                // 表单验证的规则
                ruleValidate: {
                    class_ID: [
                        { required: true, message: '分类不能为空', trigger: 'change' }
                    ],
                    subClass_Value: [
                        { required: true, message: '公司简称不能为空', trigger: 'blur' },
                        // { type: 'string', min: 5, message: '不能少于5个字符', trigger: 'blur' }
                    ],
                    specifications: [
                        { required: true, message: '产品规格不能为空', trigger: 'blur' },
                        // { type: 'string', min: 5, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    steelGrade: [
                        { required: true, message: '产品钢级不能为空', trigger: 'blur' },
                        // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ],
                    isEnable: [
                        { type: 'boolean', required: true,  trigger: 'blur' },
                    ],
                    cmp_Adress: [
                        // { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
             lock(index){
                let isEnable_status = this.data1[index].isEnable;
                let _self = this;
                // console.log(this.data1[index].id);
                if(isEnable_status===1){
                     isEnable_status=2
                     base.putAjaxData(base.baseURL + '/PublicApi/Bs_commisEableupd_view?IsEnable=' + isEnable_status + '&ID=' + this.data1[index].id,(e) => {
                    _self.changePage();
                });
                }else{
                    isEnable_status=1;
                    base.putAjaxData(base.baseURL + '/PublicApi/Bs_commisEableupd_view?IsEnable=' + isEnable_status + '&ID=' + this.data1[index].id,(e) => {
                        _self.changePage();
                    });
                }
            },
            // 修改数据模态框---确认
            amend (name) {
                this.$refs[name].validate((valid) => {
                    let _self = this;
                    if (valid) {
                        base.putAjaxData(base.baseURL + 'PublicApi/Bs_GoodsInfo',JSON.stringify(this.indexData), (e) => {
                            this.$Message.info('更新成功！');
                            _self.changePage(_self.pageCurrent);
                            this.editModal = false;
                            this.$refs[name].resetFields();
                        });
                    } else {
                        _self.$Message.error('保存失败');
                    }
                })
            },
            // 表格里面的单行修改模态框
            modify (index) {
                this.editModal = true;
                this.indexData = this.data1[index];
            },
            // 表格里面单行删除
            remove (index) {
                let _self = this;
                this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        base.deleteAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo?ID=' + this.data1[index].id, (e) => {
                            switch (e.errMsg) {
                                case 'ok':
                                    this.$Message.info('删除成功！');
                                    _self.changePage(_self.pageCurrent)
                                    break;
                                default:
                                    break;
                            }
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('您取消了删除');
                    }
                });  
            },
            // 查询函数
            check(skip,take){
                  this.options = '';              // 清空options
                  let _self = this;
                 if(this.value){
                    this.options = '&pinyinContains='+this.value;
                }else{
                     base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo_view?Skip=' + this.skip + '&take=' + this.take,(e)=>{
                        console.log(e);
                        _self.data1 = e.results;
                    });
                }
                if( skip == undefined ) skip = 0;                 
                if( take == undefined ) take = this.pageSize;   
                base.getAjaxData(base.baseURL + 'PublicApi/bs_goodsinfo?Skip=' + skip + '&take=' + take + this.options, (e)=>{
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
                 let _self = this;
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            console.log(JSON.stringify(this.formValidate));
                            base.postAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo',JSON.stringify(this.formValidate));
                            this.$Message.success('登记保存成功');// alert('登记保存成功,您可以继续登记下条记录,或者关闭登记窗口!');
                            _self.changePage(_self.pageCurrent)
                            this.addModal = false;
                            this.$refs[name].resetFields();
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
            base.getAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo_view?Skip=' + this.skip + '&take=' + this.take, (e) => {
                _self.data1 = e.results;
                _self.total = e.total;
            })
            // 模态框下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_ClassSet?Class_ID=108&Skip=' + this.skip + '&take=' + this.take,(e)=>{
                console.log(e);
                _self.data = e.results;
                _self.total = e.total;
                });
        },
        watch: {
            total: function(val) {
                let num = this.pageSize*this.pageCurrent - 9;
                if(num > val) {
                    this.pageCurrent = this.pageCurrent - 1;
                    this.check(this.pageCurrent*this.pageSize-10, this.pageSize)
                }
            }
        }
    }
</script>