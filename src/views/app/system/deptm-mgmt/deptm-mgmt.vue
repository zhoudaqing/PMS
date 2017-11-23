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
            <Col span="6">
                <Card style="max-height: 600px; overflow-y: scroll; overflow-x: hidden;">
                    <Tree style="width: 100%;" :data="data" :render="renderContent"></Tree>
                </Card>
            </Col>
            <Col span="18">
                <Card style="min-height: 600px;">
                    <h1>title: {{ nodeInfo.title }}</h1>
                    <h2>nodeKey: {{ nodeInfo.nodeKey }}</h2>

                </Card>
            </Col>
        </Row>
            
        <Modal v-model="modal" title="添加部门" @on-ok="ok" class-name="vertical-center-modal">
            <Input v-model="deptmName" placeholder="部门名称" value="" :maxlength="5"></Input>
        </Modal>
        
    </div>
</template>

<script>
import base from '@/libs/base';

export default {
    props:{
        maxlength: 5
    },
    data () {
        return {
            data: [],
            buttonProps: {
                type: 'ghost',
                size: 'small',
            },
            modal: false,
            deptmName: '',
            nodeInfo: {}
        }
    },
    mounted () {
        // 获取部门数据
        base.getAjaxData(base.baseURL + 'PublicApi/Bs_dep', (e) => {
            let data = e.results;
            let nodes = [];
            data.forEach(item => {
                let node = {};
                node.id = item.id;
                node.title = item.depName;
                node.parentID = item.parentID;
                node.expand = item.isEnable;
                nodes.push(node)
            });
            let parseData = base.convert(nodes);

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
                                    marginRight: '8px'
                                }
                            }),
                            h('span', {
                                class: 'ivu-tree-title',
                                on: {
                                    click: () => { console.log(data); }
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
                                    width: '52px'
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
    methods: {
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
                            marginRight: '8px'
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
                            marginRight: '6px'
                        },
                        on: {
                            click: () => { this.append(data) }
                        }
                    }),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-minus-empty'
                        }),
                        on: {
                            click: () => { this.remove(root, node, data) }
                        }
                    })
                ])
            ]);
        },
        append (data) {
            this.modal = true;
            this.nodeInfo = data;
        },
        remove (root, node, data) {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        },
        ok () {
            let data = this.nodeInfo;
            const children = data.children || [];
            children.push({
                title: this.deptmName,
                expand: true
            });
            console.log(this)
            this.$set(data, 'children', children);
            this.nodeInfo = {};
            this.deptmName = '';
        },
        selectNode (e) {
            this.nodeInfo = e;
        }
    }
}
</script>
