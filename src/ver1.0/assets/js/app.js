Ractive.DEBUG = false;
function index(page) {
    var page = parseInt(page) || 1;
    window._G = window._G || { post: {}, postList: {} };
    $('#title').html(_config['blog_name']);
    if (_G.postList[page] != undefined) {
        $('.span12').html(_G.postList[page]);
        return;
    }

    $.ajax({
        url: "https://api.github.com/repos/" + _config['owner'] + "/" + _config['repo'] + "/issues",
        data: {
            filter: 'created',
            page: page,
            per_page: _config['per_page']
            // access_token : _config['access_token']
        },
        beforeSend: function () {
            $('.span12').html('<center><img src="src/ver1.0/assets/images/loading.gif" class="loading"></center>');
        },
        success: function (data, textStatus, jqXHR) {
            var link = jqXHR.getResponseHeader("Link") || "";
            var next = false;
            var prev = false;
            if (link.indexOf('rel="next"') > 0) {
                next = true;
            }
            if (link.indexOf('rel="prev"') > 0) {
                prev = true;
            }
            var ractive = new Ractive({
                template: '#listTpl',
                data: {
                    posts: data,
                    next: next,
                    prev: prev,
                    page: page
                }
            });
            window._G.postList[page] = ractive.toHTML();
            $('.span12').html(window._G.postList[page]);

            //将文章列表的信息存到全局变量中，避免重复请求
            for (i in data) {
                var ractive = new Ractive({
                    template: '#detailTpl',
                    data: { post: data[i] }
                });
                window._G.post[data[i].number] = {};
                window._G.post[data[i].number].body = ractive.toHTML();

                var title = new Ractive({
                    template: '#titleTpl',
                    data: { title: data[i].title + " | " + _config['blog_name'] }
                });
                window._G.post[data[i].number].title = title.toHTML();
            }
        }
    });
}

// 动态加载多说评论框的函数
function toggleDuoshuoComments(container, id) {
    var el = document.createElement('div');//该div不需要设置class="ds-thread"
    var url = window.location.href;
    el.setAttribute('data-thread-key', id);//必选参数
    el.setAttribute('data-url', url);//必选参数
    DUOSHUO.EmbedThread(el);
    jQuery(container).append(el);
}

function detail(id) {
    if (!window._G) {
        window._G = { post: {}, postList: {} };
        window._G.post[id] = {};
    }

    if (_G.post[id].body != undefined) {
        $('.span12').html(_G.post[id].body);
        $('#title').html(_G.post[id].title);
        //   toggleDuoshuoComments('.span12', id);
        return;
    }
    $.ajax({
        url: "https://api.github.com/repos/" + _config['owner'] + "/" + _config['repo'] + "/issues/" + id,
        data: {
            // access_token:_config['access_token']
        },
        beforeSend: function () {
            $('.span12').html('<center><img src="src/ver1.0/assets/images/loading.gif" alt="loading" class="loading"></center>');
        },
        success: function (data) {
            var ractive = new Ractive({
                template: '#detailTpl',
                data: { post: data }
            });

            window._G.post[id].body = ractive.toHTML();
            $('.span12').html(window._G.post[id].body);

            var title = new Ractive({
                template: '#titleTpl',
                data: { title: data.title + " | " + _config['blog_name'] }
            });
            window._G.post[id].title = title.toHTML();
            $('#title').html(window._G.post[id].title);
            // toggleDuoshuoComments('.span12', id);
        }
    });

}

var helpers = Ractive.defaults.data;
helpers.toIntroHTML = function (content) {
    var converter = new showdown.Converter();
    converter.setFlavor('github');
    return converter.makeHtml(content.substr(0, 500) + '......');
}
helpers.toHTML = function (content) {
    var converter = new showdown.Converter();
    converter.setFlavor('github');
    return converter.makeHtml(content);
}
helpers.formatTime = function (time) {
    return time.substr(0, 10);
}
helpers.formatMonth = function (time) {
    return time.substr(5, 2) + '/' + time.substr(8, 2);
}
helpers.formatYear = function (time) {
    return time.substr(0, 4);
}

helpers.formatTitle = function (title) {
    if (title.index('_') > -1)
        return title.split('_')[1];
    return title;
}

function categories(page) {
    $('.span12').html('<center>功能完善中...</center>');
}

var routes = {
    '/': index,
    'p:page': index,
    'post/:postId': detail,
    '/categories': categories
};
var router = Router(routes);
router.init('/');