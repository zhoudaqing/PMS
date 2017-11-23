import Cookies from 'js-cookie';

const base = {};

// base.baseURL = 'http://61.185.0.135:6988/';
base.baseURL = 'http://172.20.0.192:9000/';

base.getAjaxData = function (url, callback) {
    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            // console.log(e);
            callback(e);
        }
    });
};

base.postAjaxData = function (url) {
    $.ajax({
        url: url,
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            console.log(e);
            console.log('提交成功');
        }
    });
};

base.putAjaxData = function (url) {
    $.ajax({
        url: url,
        type: 'PUT',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            console.log(e);
            console.log('更新成功');
        }
    });
};

base.deleteAjaxData = function (url) {
    $.ajax({
        url: url,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            console.log(e);
            console.log('删除成功');
        }
    });
};

base.convert = function (source) {
    var data = source.reduce(function (r, a) {
        function getParent (s, b) {
            return b.id === a.parentID ? b : (b.children && b.children.reduce(getParent, s));
        }
        let index = 0;
        let node;
        if ('parentID' in a) {
            node = r.reduce(getParent, {});
        }
        if (node && Object.keys(node).length) {
            node.children = node.children || [];
            node.children.push(a);
        } else {
            while (index < r.length) {
                if (r[index].parentID === a.id) {
                    a.children = (a.children || []).concat(r.splice(index, 1));
                } else {
                    index++;
                }
            }
            r.push(a);
        }
        return r;
    }, []);
    return data;
}

export default base;
