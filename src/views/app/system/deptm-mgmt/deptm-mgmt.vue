<style lang="less">
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>

<template>
    <div>
        <Row>
            <Col :span="colLeft">
                <Card style="height: 600px; max-height: 600px; overflow-y: scroll; overflow-x: hidden; ">
                    <div slot="title">
                        <div v-if="buttonStatus == 'none'">
                            <Button type="ghost" shape="circle" size="small" @click="editShow"><Icon type="ios-compose-outline"></Icon> 编辑</Button>
                        </div>
                        <div v-else-if="buttonStatus == ''">
                            <Button type="primary" shape="circle" size="small" @click="editClose"><Icon type="ios-download-outline"></Icon> 保存</Button>
                        </div>
                        
                        
                    </div>
                    <Tree style="width: 100%;" :data="data" :render="renderContent"></Tree>
                </Card>
            </Col>
            <Col :span="colRight">
                <Card style="min-height: 600px;">
                    <h1>title: {{ nodeInfo.title }}</h1>
                    <h2>nodeKey: {{ nodeInfo.nodeKey }}</h2>
                    <Table border :columns="deptmDetailColumns" :data="deptmDetail"></Table>
                </Card>
            </Col>
        </Row>
            
        <Modal v-model="modal" :title="modalTitle" @on-ok="ok(modalTitle)" class-name="vertical-center-modal">
            <Input v-model="deptmName" placeholder="部门名称" value="" :maxlength="5"></Input>
        </Modal>
        
    </div>
</template>

<script>
function formatDataToTree(arr) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;
    // First map the nodes of the array to an object -> create a hash table.
    for(var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }
    for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentID) {
                mappedArr[mappedElem['parentID']]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}

import base from '@/libs/base';

export default {
    props:{
        maxlength: 5
    },
    data () {
        return {
            data: [],
            buttonProps: {          // 树按钮属性
                type: 'ghost',
                size: 'small',
            },
            buttonStatus: 'none',   // 按钮是否显示
            modal: false,           // modal状态
            modalTitle: '',         // modal标题
            deptmName: '',          // 输入框部门名称
            nodeInfo: {},           // 选中node信息
            colLeft: 6,
            colRight: 18,
            deptmDetail: [],
            deptmDetailColumns: [
                { title: 'cRecord_ID', key: 'cRecord_ID' },
                { title: 'cid', key: 'cid' },
                { title: 'mDepName', key: 'mDepName' }
            ]
        }
    },
    mounted () {
        // 获取部门数据
        this.getDepartmentTree(0);
    },
    methods: {
        getDepartmentTree (isEnable) {
            base.getAjaxData(base.baseURL + 'PublicApi/Bs_dep', (e) => {
                let data = e.results;
                let nodes = [];
                data.forEach(item => {
                    let node = {};
                    node.id = item.id;
                    node.title = item.depName;
                    node.parentID = item.parentID;
                    node.expand = isEnable;
                    nodes.push(node)
                });
                // let parseData = base.convert(nodes);
                let parseData = formatDataToTree(nodes);

                this.data = [{
                    title: '材料厂',
                    expand: true,
                    id: 1,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    }
                                }),
                                h('span', {
                                    class: 'ivu-tree-title',
                                    on: {
                                        click: () => { this.selectNode(data); }
                                    }
                                }, data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '32px'
                                }
                            }, [
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: 'ios-plus-empty',
                                        type: 'primary'
                                    }),
                                    style: {
                                        display: this.buttonStatus,
                                        width: '75px'
                                    },
                                    on: {
                                        click: () => { console.log(data);this.append(data) }
                                    }
                                })
                            ])
                        ]);
                    },
                    children: parseData[0].children
                }];
            });
        },
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%'
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-paper-outline'
                        },
                        style: {
                            marginRight: '4px'
                        }
                    }),
                    h('span', {
                        class: 'ivu-tree-title',
                        on: {
                            click: () => { this.selectNode(data); }
                        }
                    }, data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '32px'
                    }
                }, [
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-plus-empty'
                        }),
                        style: {
                            display: this.buttonStatus,
                            marginRight: '3px'
                        },
                        on: {
                            click: () => { this.append(data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        style: {
                            display: this.buttonStatus,
                            marginRight: '3px'
                        },
                        on: {
                            click: () => { this.remove(root, node, data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-compose-outline'
                        }),
                        style: {
                            display: this.buttonStatus
                        },
                        on: {
                            click: () => { this.edit(root, node, data) }
                        }
                    })
                ])
            ]);
        },
        append (data) {
            this.modalTitle = '添加部门';
            this.modal = true;
            this.nodeInfo = data;
        },
        remove (root, node, data) {
            let _self = this;
            if(data.children.length > 0) {
                this.$Modal.error({
                    content: '当前部门下含有子部门，无法删除！'
                });
            } else {
                this.$Modal.confirm({
                    content: '确定删除 【' + data.title + '】 ？',
                    onOk: function() {
                        base.ajaxData('PublicApi/Bs_dep?id=' + data.id, {}, 'DELETE', (e) => {
                            switch (e.errMsg) {
                                case 'ok':
                                    this.$Message.info('删除成功！');
                                    _self.getDepartmentTree(1);
                                    break;
                            
                                default:
                                    break;
                            }
                        })
                    }
                });
            }
            
            // const parentKey = root.find(el => el === node).parent;
            // const parent = root.find(el => el.nodeKey === parentKey).node;
            // const index = parent.children.indexOf(data);
            // parent.children.splice(index, 1);
        },
        edit (root, node, data) {
            this.deptmName = data.title;
            this.modalTitle = '修改部门';
            this.modal = true;
            this.nodeInfo = data;
        },
        ok (e) {
            let _self = this;
            let para = {}
            switch (e) {
                case '添加部门':
                    let data = this.nodeInfo;
                    let children = data.children || [];
                    children.push({
                        title: this.deptmName,
                        expand: true,
                        parentID: data.id
                    });
                    para = {
                        ParentID: data.id,
                        DepName: this.deptmName,
                        isEnable: 1
                    }
                    base.postAjaxData(base.baseURL + 'PublicApi/Bs_dep', para, (e) => {
                        switch (e.errMsg) {
                            case 'ok':
                                // this.$set(data, 'children', children);
                                this.$Message.info('添加成功！');
                                _self.getDepartmentTree(1);
                                break;
                        
                            default:
                                break;
                        }
                    });
                    this.nodeInfo = {};
                    this.deptmName = '';
                    break;
                case '修改部门':
                    this.nodeInfo.title = this.deptmName;
                    // this.$set(this.nodeInfo);
                    para = {
                        id: this.nodeInfo.id,
                        ParentID: this.nodeInfo.parentID,
                        DepName: this.deptmName,
                        isEnable: 1
                    }
                    base.ajaxData('PublicApi/Bs_dep', para, 'PUt', (e) => {
                        switch (e.errMsg) {
                            case 'ok':
                                this.$Message.info('修改成功！');
                                _self.getDepartmentTree(1);
                                break;
                        
                            default:
                                break;
                        }
                    })
                    break;
                // case '删除部门':
                    
                //     break;
                default:
                    break;
            }
            
        },
        selectNode (e) {
            console.log(e);
            let _self = this;
            this.nodeInfo = e;
            base.ajaxData('PublicApi/Bs_depdepdetail_view', {'MParentID': e.id}, 'GET', (e) => {
                // console.log(e.results)
                base.ajaxData('PublicApi/Bs_depdepdetail_view', {'cRecord_ID': e.id}, 'GET', (g) => {
                    console.log(g)
                    _self.deptmDetail = g.results;
                })
            })
        },
        editShow () {
            this.colLeft = 8;
            this.colRight = 16;
            this.buttonStatus = '';
            this.getDepartmentTree(1);
        },
        editClose () {
            this.colLeft = 6;
            this.colRight = 18;
            this.buttonStatus = 'none';
            this.getDepartmentTree(0);
        }
    }
}
</script>
