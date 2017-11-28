<style lang="less" >
    @import '../../page-common.less';
    @import './storage-notice-mgmt.less';
</style>

<template>
    <div class="storage-notice-mgmt">
        <div class="margin-bottom-10">
            <div>
                <i-button type="primary" @click="handleOutBill()" icon="plus">录入</i-button>
                <i-button type="primary" icon="ios-search" @click="check()" >查询</i-button>
            </div>
        </div>
        <card class="margin-bottom-10">
           <div class="select-col" >
                <div class="div">
                    <label class="label" for="for"  filterable>产品类别:</label>
                    <Select :transfer="true" v-model="prodClassSelect" class="select" >
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodClass" :value="item.pinMing " :key="item.pinMing ">{{ item.pinMing }}</Option> 
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for">生产单位:</label>
                    <Select :transfer="true" v-model="prodUnitSelect" class="select" >
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodUnit" :value="item.subClass_Value" :key="item.subClass_Value">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for" >入库序号:</label>
                    <Input  class="select" v-model="storageNum" placeholder="请输入入库序列号"></Input>
                </div>
                <div class="div">
                    <label class="label" for="for"  filterable>原料供货:</label>
                    <Select :transfer="true" v-model="materialSupplySelect" class="select" on>
                        <Option  v-for="item in materialSupply" :value="item.subClass_Value" :key="item.subClass_Value" >{{ item.subClass_Value }}</Option>
                    </Select>
                </div>
                <div class="div">
                    <label class="label" for="for">入库日期:</label>
                    <Date-picker :transfer="true" v-model="storageDate" type="daterange" placement="bottom-end" placeholder="选择日期" style="width:175px"></Date-picker>
                </div>
            </div>
        </card>
        <card class="margin-bottom-10">
            <Table class="margin-bottom-10" size="small" border  style="min-height:400px;" :columns="columns" :data="data1"></Table>
            <div>
                <Page :total="total" :current="1" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
            </div>
        </card>
        <!-- 录入模态框 -->
        <Modal  class="type-in-modal modal-common" v-model="recordModal"  :mask-closable="false"  width="1000px" :styles="{top: '20px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <div  class="margin-bottom-10 ">
                <i-button type="primary"  icon="plus" @click="handleSubmit('formValidate')" size="small">保存</i-button>
                <i-button type="primary"  icon="plus" size="small">导出excel</i-button>
                <i-button type="primary" icon="ios-search" size="small">关闭</i-button>
            </div>
            <div class="select-col margin-bottom-10" >
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for"  filterable>产品类别:</label>
                    <Select :transfer="true" v-model="prodClassSelect" class="select" size="small" style="width:130px">
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodClass" :value="item.pinMing" :key="item.pinMing" active>{{ item.pinMing }}</Option>
                    </Select>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for">生产单位:</label>
                    <Select :transfer="true" v-model="prodUnitSelect" class="select" filterable size="small" style="width:100px">
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodUnit" :value="item.subClass_Value" :key="item.subClass_Value">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for" >入库序号:</label>
                    <Input  class="select" v-model="storageNum"  placeholder="请输入序号" size="small" style="width:100px"></Input>
                </div>
                 <div class="div" style="margin-right:0px;">
                    <label class="label" for="for"  filterable style="width:30px">库区:</label>
                    <Input  class="select" v-model="storeArea" placeholder="请输入库区" size="small" style="width:100px"></Input>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for" style="width:30px">日期:</label>
                    <!-- <Date-picker :transfer="true" type="daterange" placement="bottom-end" placeholder="选择日期" style="width:130px" size="small"></Date-picker> -->
                    <DatePicker :transfer="true" type="date" v-model="storageDate" placement="bottom-end" placeholder="选择日期" style="width:105px" size="small"></DatePicker>
                </div>
            </div>
            <div>
                <h1 style="font-weight:lighter;text-align:center;margin-bottom:10px;">产品判定入库通知书</h1>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <table class="f-table" cellspan="0" cellpadding="0" border="1">
                        <tr>
                            <td colspan="3">生产单位：{{prodUnitSelect}}</td>
                            <td ></td>
                            <td colspan="3">2017年11月20日</td>
                            <td ></td>
                            <td colspan="4">编码：SYC/ZJ-JZ-19</td>
                        </tr>
                        <tr>
                            <td style="width:100.8px;">产品类别</td>
                            <td style="width:125.6px;">钢级</td>
                            <td colspan="2" style="width:141px;">规格</td>
                            <td colspan="2" style="width:119.2px;">技术条件</td>
                            <td style="width:100px;">总重量kg</td>
                            <td style="width:125.6px;">总长度m</td>
                            <td style="width:70.4px;">总支数</td>
                            <td style="width:69.6px;">总件数</td>
                            <td style="width:69.6px;">入库序号</td>
                            <td style="width:49.6px;">库区</td>
                        </tr>
                        <tr v-for="item in recordModalData" :key="item" >
                            <td >{{item.subClass_Value}}</td>
                            <td >{{item.steelGrade}}</td>
                            <td colspan="2" style="width:141px;">{{item.specifications}}</td>
                            <td colspan="2">API Spec5CT</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td >{{storageNum}}</td>
                            <td >{{storeArea}}</td>
                        </tr>
                    </table>  
                    <Table class="z-table"  size="small" border  style="min-height:400px;" :columns="modelColumnsTwo" :data="modelData2"></Table>
                    <table class="foot-table" cellspan="0" cellpadding="0" border="1">
                        <tr >
                            <td style="width:100.8px;">备注：</td>
                            <td colspan="4" style="width:405px;"></td>
                            <td style="width:100px;">判定结论：</td>
                            <td colspan="4" style="width:400.8px;"></td>
                        </tr>
                        <tr >
                            <td></td>
                            <td>制表人：</td>
                            <td colspan="6"></td>
                            <td>判定人：</td>
                            <td colspan="3"></td>
                        </tr>
                    </table>
                </Form>
            </div>
            <div slot="footer">
            </div>
        </Modal>
        <!-- 查看模态框 -->
         <Modal  class="type-in-modal modal-common" v-model="lookModal"  :mask-closable="false"  width="1000px" :styles="{top: '20px'}">
            <p slot="header" >
                <Icon type="clipboard"></Icon>
                <span>产品判定入库通知书</span>
            </p>
            <div  class="margin-bottom-10 ">
                <i-button type="primary"  icon="plus" @click="handleSubmit ()" size="small">保存</i-button>
                <i-button type="primary"  icon="plus" size="small">导出excel</i-button>
                <i-button type="primary" icon="ios-search" size="small">关闭</i-button>
            </div>
            <div class="select-col margin-bottom-10" >
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for"  filterable>产品类别:</label>
                    <Select :transfer="true" v-model="prodClassSelect" class="select" size="small" style="width:130px">
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodClass" :value="item.pinMing" :key="item.pinMing" active>{{ item.pinMing }}</Option>
                    </Select>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for">生产单位:</label>
                    <Select :transfer="true" v-model="prodUnitSelect" class="select" filterable size="small" style="width:100px">
                        <Option  value="" >全部</Option>
                        <Option  v-for="item in prodUnit" :value="item.subClass_Value" :key="item.subClass_Value">{{item.subClass_Value}}</Option>
                    </Select>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for" >入库序号:</label>
                    <Input  class="select" v-model="storageNum"  placeholder="请输入序号" size="small" style="width:100px"></Input>
                </div>
                 <div class="div" style="margin-right:0px;">
                    <label class="label" for="for"  filterable style="width:30px">库区:</label>
                    <Input  class="select" v-model="storeArea" placeholder="请输入库区" size="small" style="width:100px"></Input>
                </div>
                <div class="div" style="margin-right:0px;">
                    <label class="label" for="for" style="width:30px">日期:</label>
                    <!-- <Date-picker :transfer="true" type="daterange" placement="bottom-end" placeholder="选择日期" style="width:130px" size="small"></Date-picker> -->
                    <DatePicker :transfer="true" type="date" v-model="storageDate" placement="bottom-end" placeholder="选择日期" style="width:105px" size="small"></DatePicker>
                </div>
            </div>
            <div>
                <h1 style="font-weight:lighter;text-align:center;margin-bottom:10px;">产品判定入库通知书</h1>
                <!-- <p class="margin-bottom-5" style="text-align:center;"><span style="float:left;">生产单位：一分厂；</span><span >2017年11月17日</span> <span style="float:right;">编码：SYC/ZJ JZ-19；</span></p> -->
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                    <table class="f-table" cellspan="0" cellpadding="0" border="1">
                        <tr>
                            <td colspan="3">生产单位：{{prodUnitSelect}}</td>
                            <td ></td>
                            <td colspan="3">2017年11月20日</td>
                            <td ></td>
                            <td colspan="4">编码：SYC/ZJ-JZ-19</td>
                        </tr>
                        <tr>
                            <td style="width:100.8px;">产品类别</td>
                            <td style="width:125.6px;">钢级</td>
                            <td colspan="2" style="width:141px;">规格</td>
                            <td colspan="2" style="width:119.2px;">技术条件</td>
                            <td style="width:100px;">总重量kg</td>
                            <td style="width:125.6px;">总长度m</td>
                            <td style="width:70.4px;">总支数</td>
                            <td style="width:69.6px;">总件数</td>
                            <td style="width:69.6px;">入库序号</td>
                            <td style="width:49.6px;">库区</td>
                        </tr>
                        <tr v-for="item in recordModalData" :key="item" >
                            <td >{{item.subClass_Value}}</td>
                            <td >{{item.steelGrade}}</td>
                            <td colspan="2" style="width:141px;">{{item.specifications}}</td>
                            <td colspan="2">API Spec5CT</td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td ></td>
                            <td >{{storageNum}}</td>
                            <td >{{storeArea}}</td>
                        </tr>
                    </table>  
                    <Table class="z-table"  size="small" border  style="min-height:400px;" :columns="modelColumnsTwo" :data="modelData2"></Table>
                    <table class="foot-table" cellspan="0" cellpadding="0" border="1">
                        <tr >
                            <td style="width:100.8px;">备注：</td>
                            <td colspan="4" style="width:405px;"></td>
                            <td style="width:100px;">判定结论：</td>
                            <td colspan="4" style="width:400.8px;"></td>
                        </tr>
                        <tr >
                            <td></td>
                            <td>制表人：</td>
                            <td colspan="6"></td>
                            <td>判定人：</td>
                            <td colspan="3"></td>
                        </tr>
                    </table>
                </Form>
            </div>
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
                totalWeight:"number",
                totalLenght:"number",
                totalZnumber:"number",
                totalJnumber:"number",
                zWeight:[],
                zLenght:[],
                zZnumber:[],
                zJnumber:[],
                modelData2:[],
                // logTwoColData:[],
                lookModal:false,             // 查看模态框
                recordModal: false,          // 新增按钮--模态框
                prodClassSelect:"油管光管 J55 73.02*5.51",          // 产品类别下拉框
                prodUnitSelect:"一分厂",           // 生产单位
                storeArea:'',                // 库区
                storageDate:'',              // 入库日期
                storageNum:'',               // 入库序号
                materialSupplySelect:"",     // 原料供货下拉框
                options: '',                 // 用来存储查询函数的帅选字段
                prodClass: [],               // 第一个select下拉列表数据
                data1: [],                   // 表格数据
                prodUnit:[],                 // 第二个select下拉列表数据
                materialSupply:[],           // 第三个select下拉列表数据
                recordModalData:[],          // 模态框数据
                skip: 0,                     // 数据起始值
                take: 10 ,                   // 一次获取的条数--一页显示的条数
                total: 100,                  // 数据总数
                pageCurrent: 1,              // 当前页
                pageSize: 10,                // 每页的数据
                indexData: [],               // 删除模态框所用的表格行数据
                columns: [                   // 表格表头/列信息
                    {type:'selection', width: 60,align: 'center',width: 60},
                    {key: "CP_TyID", title: "产品类别",align: 'center',},
                    {key: "zProd_line", title: "生产单位",align: 'center', },
                    {key: "YLSupCmp_ID", title: "原料供货单位",align: 'center', },
                    {key: "Seq_Num", title: "入库序号",align: 'center', },
                    {key: "TotalWeight", title: "总重量",align: 'center', },
                    {key: "TotalLength", title: "总长度",align: 'center', },
                    {key: "TotalJianShu", title: "总件数",align: 'center', },
                    {key: "DecisionStatus", title: "判定",align: 'center',width: 100 },
                    {key: "zDate", title: "日期",align: 'center',width: 100 },
                    {key: "OffsetStatus", title: "冲红状态",align: 'center',width: 100 },
                    {key: "SinglePerson", title: "录入",align: 'center',},
                    {title: '操作',"sortable": true,align:"center",key: 'handle',
                        render: (h, params) => {
                            return h('div', [
                                 h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '查看'),
                                h('Button', {
                                    props: {
                                        type: 'default',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    } 
                ],
                //  modelColumnsTwo: [        
                //     {key: "subClass_Value", title: "原料供货商",align: 'center',width:100, render: (h, params) => { return h('input', { props: { type: 'person', size: 'small',width:91, }, }) }},                  
                //     {key: "steelGrade", title: "炉号",width:125,align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                //     {key: "specifications", title: "捆数编号",width: 70,align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                //     {key: "pinyin", title: "捆重量kg",width: 70,align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                //     {key: "unit", title: "捆长度m",width: 70, align: 'center',  render: (h, params) => { return h('input', { props: { type: 'person', size: 'small', background:''}, }) }},   
                //     {key: "threadType", title: "支数",width: 50,align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                //     {key: "subClass_Value", title: "原料供货商",align: 'center',width:100, render: (h, params) => { return h('input', { props: { type: 'person', size: 'small',width:91, }, }) }},                  
                //     {key: "steelGrade", title: "炉号",width: 125,align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                //     {key: "specifications", title: "捆数编号",width:70,align: 'center',render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                //     {key: "pinyin", title: "捆重量kg",width: 70,align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},    
                //     {key: "unit", title: "捆长度m",width: 70, align: 'center',  render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                //     {key: "threadType", title: "支数",width: 50,align: 'center', render: (h, params) => { return h('input', { props: { type: 'person', size: 'small' }, }) }},   
                // ],
                 modelColumnsTwo: [        
                    {key: "YLSupCmp_ID", title: "原料供货商",align: 'center',width:100, },
                    {key: "FurnaceNo", title: "炉号",width:125,align: 'center',   },
                    {key: "BundleNo", title: "捆数编号",width: 70,align: 'center',},
                    {key: "Weight", title: "捆重量kg",width: 70,align: 'center', },    
                    {key: "Length", title: "捆长度m",width: 70, align: 'center',  },   
                    {key: "Number", title: "支数",width: 50,align: 'center', },   
                    {key: "YLSupCmp_ID", title: "原料供货商",align: 'center',width:100, },
                    {key: "FurnaceNo", title: "炉号",width:125,align: 'center',   },
                    {key: "BundleNo", title: "捆数编号",width: 70,align: 'center',},
                    {key: "Weight", title: "捆重量kg",width: 70,align: 'center', },    
                    {key: "Length", title: "捆长度m",width: 70, align: 'center',  },   
                    {key: "Number", title: "支数",width: 50,align: 'center', },   
                ],
               // 提交的数据  也是验证表单绑定的数据
                formValidate:{
                    "ID": "",
                    "Seq_Num": "",
                    "CP_TyID": "",
                    "YLSupCmp_ID": "",
                    "Prod_line": "",
                    "FurnaceNo": "",
                    "Date": "Date",
                    "StoreArea": "",
                    "TotalJianShu": "int",
                    "TotalNumber": "int",
                    "TotalWeight": 0,
                    "TotalLength": 0,
                    "SinglePerson": "",
                    "DecisionStatus": "int",
                    "DecisionResult": "",
                    "Inspector": "",
                    "IsQualified": "int",
                    "DecisionDate": "Date",
                    "RecordDate": "Date",
                    "OffsetStatus": "int",
                    "Offset": "int",
                    "IsLock": "int",
                    "Remarks": "",
                    "Cp_ProdStoreRec": [
                        {
                            "ID": "int",
                            "Cp_ProdStoreId": "int",
                            "CPOutStoreSgl_ID": "int",
                            "CP_TyID": "",
                            "YLSupCmp_ID": "",
                            "Prod_line": "int",
                            "BundleNo": "int",
                            "FurnaceNo": "",
                            "Weight": 0,
                            "Length": 0,
                            "Number": "int",
                            "ProdDate": "Date",
                            "StoreDate": "Date",
                            "OutStoreDate": "Date",
                            "StoreArea": "",
                            "DecisionStatus": "int",
                            "IsQualifiedSecStore": "int",
                            "IsOffset": "",
                            "Remarks": ""
                        }
                    ]
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
                    specifications: [
                        { required: true, message: '产品规格不能为空', trigger: 'blur' },
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
                },
            }   
        },
        methods: {
            // 循环表格行
            handleOutBill(){
                this.logTwoColData = [];
                this.recordModal = true; 
                for(var i = 0;i < 25;i++){
                    this.logTwoColData.push({
                        left:{},
                        right:{}
                    });
                }
            },
            // 查看
            show (index) {
                this.logTwoColData = [];
                this.lookModal = true 
                for(var i = 0;i < 25;i++){
                    this.logTwoColData.push({
                        left:{},
                        right:{}
                    });
                }
                for(var i = 0;i < 1;i++){
                    if(i < 30)this.logTwoColData[i].left = {luhao:'l'+i  ,pici:'l'+i,zhishu:'l'+i,zhongliang:'l'+i};
                    if(i >= 30)this.logTwoColData[i-15].right = {luhao:'r'+i,pici:'r'+i,zhishu:'r'+i,zhongliang:'r'+i};
                }
                this.indexData = this.data1[index];
            },
            // 删除
            remove (index) {
                // console.log(this.skip);
                let _self = this;
                 this.$Modal.confirm({
                    title: '提醒消息',
                    content: '<p>确定删除这条吗？</p>',
                    onOk: () => {
                        this.$Message.info('删除成功！');
                        base.deleteAjaxData(base.baseURL + '/PublicApi/bs_goodsinfo?ID=' + this.data1[index].id,(e)=>{
                             _self.changePage(_self.pageCurrent)
                        });
                    },
                    onCancel: () => {
                        this.$Message.info('您取消了删除');
                    }
                });  
                //  this.changePage (this.pageCurrent);
            },
            // 查询函数
           check(skip,take){
                  this.options = '';              // 清空options
                  let _self = this;
                console.log(this.prodClassSelect)
                if(this.prodClassSelect){
                    this.options = '&subClass_Value='+this.prodClassSelect;
                }
                // if(this.prodUnitSelect){
                //     this.options = '&subClass_Value='+this.prodUnitSelect;
                // }
                if( skip == undefined ) skip = 0;                 
                if( take == undefined ) take = this.pageSize;   
                base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec_view?Skip=' + skip + '&take=' + take + this.options, (e)=>{
                    _self.data1 = e.results;
                    _self.total = e.total;
                })
            },
            // 分页
            changePage (index) {
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
            // 保存
            handleSubmit (name) {
                // this.$refs[name].validate((valid) => {
                //     let _self = this;
                //     if (valid) {
                //         if( _self.isEnable == false){
                //             _self.isEnable = 2;
                //         }else{
                //             _self.isEnable = 1;
                //         }
                //         console.log(this.isEnable);
                        base.postAjaxData(base.baseURL + '/FCManage/Cp_ProdStore',JSON.stringify(this.formValidate));
                        this.$Message.success('登记保存成功,您可以继续登记下条记录,或者关闭登记窗口!');
                        this.check();
                //     } else {
                //         this.$Message.error('保存失败');
                //     }
                // })
            }
        },
        created(){
           for(var i = 0;i <25;i++){
                this.modelData2.push({
                    
                });
            }
            //给表格增加input框
            let self = this;
             this.modelColumnsTwo.forEach((item,index) => {
                if(item.key){   //只循环有key的项
                    item.render = (h, params) => {
                        let i = params.index;//读取当前行
                        return h('FormItem',{
                            props:{ 
                            
                            }
                        },
                            [ h('Input',{
                                props:{
                                    type:'text',
                                    size: 'small',
                                    style:'height:24px;line-height:24px;',
                                    value: self.modelData2[i][item.key]
                                },
                                on:{
                                    'on-blur':(e) => {
                                        self.formValid = true;
                                        if(e.target.value.length > 15){
                                            self.formValid = false;
                                            self.$Message.error('输入长度超过字数限制！');
                                        }
                                        self.modelData2[i][item.key] = e.target.value;
                                        // self.$set(self.logData[i],item.key,e.target.value)
                                        let sum = 0;
                                        self.modelData2.forEach((item) => {
                                            if(item.Number) sum += parseFloat(item.Number);
                                        });
                                    }
                                }
                            })]
                        )
                    }
                }
            })
    },
        // 获取数据
        mounted () {
            // 表格获取的全部数据
            let _self = this;
            base.getAjaxData(base.baseURL + 'FCManage/Cp_ProdStoreRec_view?Skip=' + this.skip + '&take=' + this.take, (e) => {
                console.log(e);
                _self.data1 = e.results;
                _self.total = e.total;
            })
            // 产品类别 下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_goodsinfo_view?Skip=' + this.skip + '&take=' + this.take,(e)=>{
                console.log(e);
                _self.prodClass = e.results;
                _self.total = e.total;
                });
            // 生产单位 下拉列表数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_comminfo_view?Comm_IDStartsWith=104&Skip=' + this.skip + '&take=' + this.take,(e)=>{
                console.log(e);
                _self.prodUnit = e.results;
                _self.total = e.total;
                });
            // 原料供货单位 下拉列表数据
            base.getAjaxData(base.baseURL+'PublicApi/Bs_comminfo_view?Comm_IDStartsWith=100&Skip=' + this.skip + '&take=' + this.take,(e)=>{
                console.log(e);
                _self.materialSupply = e.results;
                _self.total = e.total;
                });
            // 新增模态框表格数据
            base.getAjaxData(base.baseURL+'/PublicApi/Bs_goodsinfo_view?pinMing='+this.prodClassSelect,(e)=>{
                this.recordModalData = e.results;
            });
        },
        watch : {
           prodClassSelect (value){
                base.getAjaxData(base.baseURL+'/PublicApi/Bs_goodsinfo_view?pinMing='+value,(e)=>{
                   this.recordModalData = e.results;
                     console.log(this.recordModalData);
                });
            },
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
