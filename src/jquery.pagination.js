/**
 * jquery.pagination
 * Ajax Pagination and Order component.
 *
 * xiegang.1988@gmail.com
 *
 * require artTemplate(https://github.com/aui/artTemplate)
 *
 * thanks to:
 * https://github.com/aui/artTemplate
 */
(function($) {
    var Pagination = function(opts, $this) {
        if(!template) {
            throw new ReferenceError('require artTemplate');
        }
        // 初始化内部状态
        $.extend(this, opts);
        this.$ele = $this;
        // ajax 请求
        ~~this.delay > 0 ? setTimeout(this._execute(), delay) : this._execute();
    };

    Pagination.prototype = {
        // 执行数据查询请求
        _execute: function() {
            _this = this;
            this.onLoading && this.onLoading();

            $.ajax({
                url : this.buildRequestUrl(),
                dataType : 'json',
                success : function(data, textStatus, jqXHR) {
                    _this.onUpdate(data, textStatus, jqXHR); // 更新内部状态
                    _this.render();
                    _this.onSuccess(data, textStatus, jqXHR); // 成功回调
                },
                error: this.onError
            });
        },

        // 渲染页面,添加页面事件
        render: function() {
            var html = this.tpl ? template.render(this.tpl, this) : template.compile($.fn.pagination.tpl[this.theme])(this);
            this.$ele.html(html);
            _this = this;

            // data events
            this.$ele.find('[data-page]').click(function() {
                _this.selectPage($(this).attr('data-page'));
            });
            this.$ele.find('[data-next]').click(function() {
                _this.selectNext();
            });
            this.$ele.find('[data-prev]').click(function() {
                _this.selectPrev();
            });
            this.$ele.find('[data-first]').click(function() {
                _this.selectFirst();
            });
            this.$ele.find('[data-last]').click(function() {
                _this.selectLast();
            });
            this.$ele.find('[data-refresh]').click(function() {
                _this.refresh();
            });
            this.$ele.find('[data-order]').click(function() {
                _this.order($(this).attr('data-order'));
            });
            // pageSize
            this.$ele.find('[data-pagesize]').each(function() {
                if (this.tagName === 'SELECT') {
                    // tag select
                    $(this).change(function() {
                        _this.changePageSize($(this).val());
                    });
                } else {
                    $(this).click(function() {
                        _this.changePageSize($(this).attr('data-pagesize'));
                    });
                }
            });
        },

        // 构建当前状态的请求路径
        buildRequestUrl: function() {
            var qstr = (Object.prototype.toString.call(this.queryString) == '[object String]') ? template.compile(this.queryString)(this) : this.queryString();
            return this.url + (this.url.indexOf("?") >= 0 ? '&' : '?') + qstr;
        },

        // 选择指定页码
        selectPage: function(page) {
            if (page !== this.page) {
                this.page = ~~page;
                this._execute();
            }
        },

        // 选择前一页
        selectPrev: function() {
            if (this.page - 1 > 0) {
                this.page -= 1;
                this._execute();
            }
        },
        // 选择后一页
        selectNext: function() {
            if (this.page + 1 <= this.totalPage) {
                this.page += 1;
                this._execute();
            }
        },

        // 选择第一页
        selectFirst: function() {
            if (this.page !== 1) {
                this.page = 1;
                this._execute();
            }
        },
        // 选择最后一页
        selectLast: function() {
            if (this.page !== this.totalPage) {
                this.page = this.totalPage;
                this._execute();
            }
        },

        // 选择指定每一页数据条数
        changePageSize: function(pageSize) {
            if (pageSize !== this.pageSize) {
                this.pageSize = ~~pageSize;
                this._execute();
            }
        },

        // 选择指定排序方式
        changeOrder: function(order) {
            if (order !== this.order) {
                this.order = order;
                this._execute();
            }
        },

        // 根据当前状态进行刷新
        refresh : function() {
            this._execute();
        }
    };

    $.fn.pagination = function(options) {
        var opts = $.extend({}, $.fn.pagination.defaults, options);
        var paginations = [];
        this.each(function () {
            paginations.push(new Pagination(opts, $(this)));
        });

        return paginations.length > 0 ? (paginations.length === 1 ? paginations[0] : paginations) : null;
    };

    $.fn.pagination.defaults = {
        url: null,
        tpl: null, // 指定tpl id
        theme: 'default', // 内置tpl名称

        page: 1, // 当前页码
        pageSize: null, // int 每一页数据条数 值是指定值或者是pageSizeList第一条值
        order: null, // order string

        total: null, // int 总数据量
        totalPage: null,
        pageSizeList: null, // [10, 30, 50]

        delay: 0,
        queryString: 'page=<%=page%>&page_size=<%=pageSize%>&order=<%=order%>', // queryString tpl or function

        onLoading: null,
        onUpdate: function() {},
        onSuccess: function(){},
        onError: function() {}
    };

    // pagination templates
    $.fn.pagination.tpl  = {
        'default': '<%var count=3;if(page>totalPage) page=totalPage;var start1=page-count,end1=page-1,start2=page+1,end2=page+count;if(totalPage-page<count+1) {    start1=totalPage-(2*count+1);    if(start1<=2) start1=1;}if(end1<=count+1) start1=1;if(end1<count+1) end2=2*count+2;if(end2>=totalPage-1) end2=totalPage;%><%if(page === 1){%><span class="item word disabled">\u4e0a\u4e00\u9875</span><%}%><%if(page>start1){    if(page>1) {%><a class="item word" href="javascript:;" data-prev title="\u4e0a\u4e00\u9875">\u4e0a\u4e00\u9875</a><%}    if(start1>1) {%><a class="item" href="javascript:;" data-first title="\u9996\u9875">1 ...</a><%}    for(var i=start1;i<=end1;i++) {%><a class="item number" href="javascript:;" data-page="<%=i%>" title="\u7b2c<%=i%>\u9875"><%=i%></a><%}}%><span class="item number current"><%=page%></span><%if(page<totalPage){    for(var i=start2;i<=end2;i++) {%><a class="item number" href="javascript:;" data-page="<%=i%>" title="\u7b2c<%=i%>\u9875"><%=i%></a><%}    if(end2<totalPage) {%><a class="item" href="javascript:;" data-last title="\u5c3e\u9875">... <%=totalPage%></a><%}%><a class="item word" href="javascript:;" data-next title="\u4e0b\u4e00\u9875">\u4e0b\u4e00\u9875</a><%}%><%if(page == totalPage){%><span class="item word disabled">\u4e0b\u4e00\u9875</span><%}%><span class="item desc">\u5171<%=totalPage%>\u9875,<%=total%>\u6761\u8bb0\u5f55</span>'
    };
})(jQuery);