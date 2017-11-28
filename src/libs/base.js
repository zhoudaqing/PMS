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
            callback(e);
        }
    });
};

base.postAjaxData = function (url, para, callback) {
    $.ajax({
        url: url,
        data: para,
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            callback(e);
        },
        error: function (er) {
            callback(er);
        }
    });
};

base.putAjaxData = function (url, callback) {
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
            if (callback) {
                callback(e);
            }
        }
    });
};

base.deleteAjaxData = function (url, callback) {
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
            if (callback) {
                callback(e);
            }
        }
    });
};

/**
 * @param {String} url 地址
 * @param {Object} para 参数
 * @param {String} type 类型
 * @param {Function} callback 回调函数
 */
base.ajaxData = function (url, para, type, callback) {
    $.ajax({
        url: base.baseURL + url,
        data: para,
        type: type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('X-ss-id', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-pid', Cookies.get('pms-ss-id'));
            xhr.setRequestHeader('X-ss-opts', 'perm');
            xhr.setRequestHeader('X-UAId', Cookies.get('pms-X-UAId'));
        },
        success: function (e) {
            callback(e);
        },
        error: function (er) {
            callback(er);
        }
    });
};

base.randomNum = function (min, max) {
    let range = max - min;
    let rand = Math.random();
    return (min + rand * range).toFixed(2);
};

export default base;
