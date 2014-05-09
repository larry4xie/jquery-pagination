<%
var count=3;
if(page>totalPage) page=totalPage;
var start1=page-count,end1=page-1,start2=page+1,end2=page+count;
if(totalPage-page<count+1) {
    start1=totalPage-(2*count+1);
    if(start1<=2) start1=1;
}
if(end1<=count+1) start1=1;
if(end1<count+1) end2=2*count+2;
if(end2>=totalPage-1) end2=totalPage;
%>
<%if(page === 1){%>
<span class="item word disabled">上一页</span>
<%}%>
<%
if(page>start1){
    if(page>1) {
        %><a class="item word" href="javascript:;" data-prev title="上一页">上一页</a><%
    }
    if(start1>1) {
        %><a class="item" href="javascript:;" data-first title="首页">1 ...</a><%
    }
    for(var i=start1;i<=end1;i++) {
        %><a class="item number" href="javascript:;" data-page="<%=i%>" title="第<%=i%>页"><%=i%></a><%
    }
}
%>
<span class="item number current"><%=page%></span>
<%
if(page<totalPage){
    for(var i=start2;i<=end2;i++) {
        %><a class="item number" href="javascript:;" data-page="<%=i%>" title="第<%=i%>页"><%=i%></a><%
    }
    if(end2<totalPage) {
        %><a class="item" href="javascript:;" data-last title="尾页">... <%=totalPage%></a><%
    }
    %>
<a class="item word" href="javascript:;" data-next title="下一页">下一页</a>
<%}%>
<%
if(page == totalPage){
     %><span class="item word disabled">下一页</span><%
}
%>
<span class="item desc">共<%=totalPage%>页,<%=total%>条记录</span>