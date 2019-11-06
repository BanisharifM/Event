// "use strict";
$(document).ready(function() {

    var token = localStorage.getItem("token");
    var refreshToken = localStorage.getItem("refreshToken");
    if(token==""||token==null||refreshToken==""||refreshToken==null)
        window.location="signin.html"; 
    baseUrl=localStorage.getItem("baseUrl");
    tokenValidate();

    function tokenValidate(){
        $.ajax(`${baseUrl}/auth/token/check`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                if(res.expire<20)        
                    refreshToken();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                refreshToken();
            }
        });
    }
    function refreshToken(){
        $.ajax(`${baseUrl}/auth/token/refresh`, {
            data: JSON.stringify({"refresh_token":refreshToken}),
            type: "POST",
            processData: true,
            contentType: "application/json",           
            success: function(res) {
                token=res.access_token;
                localStorage.setItem('token',token);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // window.location="signin.html";                 
            }
        });
    }
    
    let mode="default";
    let allTags, task;
    GetAllTags();


    function GetAllTags(){
        $.ajax(`${baseUrl}/news/category`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token':token},            
            success: function(res) {
                allTags=res;
                if(mode=="default")
                    AddAllTags();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddAllTags(){
        $(".new-task").empty();
        for(j in allTags){
            if(allTags[j].isEnabled==true||allTags[j].name==null||allTags.name=="")
                continue;
            $(".add_task_todo").val(allTags[j].name);
            i=allTags[j].id
            $("#add-btn").trigger('click');
            // GetAllTags();
        }
        mode="add"
    }
    function PostTags(add_todo,task){
        $.ajax(`${baseUrl}/news/category`, {
            data: JSON.stringify({"name":task}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'token':token},         
            success: function(res) {
                
                errorMessage="با موفقیت افزوده شد.";
                $("#successNotification").trigger( "click" );

                mode="default"
                GetAllTags();
                $(".add_task_todo").val("");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    var i;
    $("#add-btn").on("click", function() {
        $(".md-form-control").removeClass("md-valid");
        var task = $(".add_task_todo").val();
        if (task == "") {
        alert("لطفا کادر را پر کنید .");
        } else {
            var add_todo = $(
                '<div class="to-do-list mb-3" id="' +
                i +
                '"><div class="d-inline-block"><label class="check-task custom-control custom-checkbox d-flex justify-content-center"><span class="custom-control-label" for="checkbox' +
                i +
                '">' +
                task +
                '</span></label></div><div class="float-right"><a onclick="delete_todo(' +
                i +
                ');" href="#!" class="delete_todolist"><i class="far fa-trash-alt"></i></a></div></div>'
            );
            if(mode=="add"){
                PostTags(add_todo,task);
            }
            else{
                $(add_todo)
                .appendTo(".new-task")
                .hide()
                .fadeIn(300);
                $(".add_task_todo").val("");
            }
        }
    });
    $(".delete_todolist").on("click", function() {
        $(this)
        .parent()
        .parent()
        .fadeOut();
    });

    let Students;
    GetAllStudent();

    function createStaffTr(id,title,text,src){
        return(
            '<div class="col-md-6 " id="news'+id+'"> <div class="card table-card"> <div class="row-table"> <div class="col-auto theme-bg text-white" style="width:200px; height: 200px;padding-left: 0 !important;padding-right: 0 !important"> <img class="img-fluid" style="width:100%; height: 100%;;" src="'+src+'" alt="تصویر خبر"> </div> <div class="col text-center"> <h4 class="f-w-300">'+title+'</h4><span class="text-uppercase d-block m-b-10">'+text+'</span>  </div> </div> </div> </div>'
        );
    }

    function GetAllStudent(){
        $.ajax(`${baseUrl}/news`, {
            // data: JSON.stringify({"classId":classId}),
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token':token},             
            success: function(res) {
                Students=res;
                AddAllStudents();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddAllStudents(){
        $('#newsList').empty();
        for(i in Students){
            let id=Students[i].id
            let src=Students[i].imageUrl.length!=0 ?Students[i].imageUrl[0].url :"../assets/images/user/blank.jpg";
            let text=Students[i].text!=null ?Students[i].text.split(/\s+/).slice(0,15).join(" ") : "";
            let tr=createStaffTr(id,Students[i].title,text,src);
            $('#newsList').append(tr);
            document.getElementById('news'+id).onclick=gotoNews;
        }
    }

    function gotoNews(){
        let objectId=$(this).attr('id');
        let id=objectId.match(/\d+/)[0];
        let news=Students.find(x => x.id==id);
        localStorage.setItem("NEWS_Page_Status","showNews");
        localStorage.setItem("NEWS_Id",news.id);
        window.location="newsContent.html";         
        //go to news page
    }

    $("#postNews").click(function(){
        let title=$("#newsTitle").val();
        let text=$("#newsText").val();
        if(title==""|| text==""){
            alert("لطفا کادر ها را پر کنید.");
            return;
        }
        let data={
            "title": title,
            "text":text ,
            "category":[],
            "images":[],
            "files":[]
        }
        PostNews(data);
    });
    function PostNews(data){
        $.ajax(`${baseUrl}/news`, {
            data: JSON.stringify(data),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'token':token},         
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger('click')
                localStorage.setItem("NEWS_Page_Status","newNews");
                localStorage.setItem("NEWS_Id",res.id);
                window.location="newsContent.html";         
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                $("#errorNotification").trigger( "click" );
            }
        });
    }

    //notification
//   let errorMessage;
    function notify(from, align, icon, type, animIn, animOut) {
        $.growl(
        {
            icon: icon,
            title:"",
            message: errorMessage,
            url: ""
        },
        {
            element: "body",
            type: type,
            allow_dismiss: true,
            placement: { from: from, align: align },
            offset: { x: 30, y: 30 },
            spacing: 10,
            z_index: 999999,
            delay: 2500,
            timer: 1000,
            url_target: "_blank",
            mouse_over: false,
            animate: { enter: animIn, exit: animOut },
            icon_type: "class",
            template:
            '<div data-growl="container" class="alert" role="alert">' +
            '<button type="button" class="close" data-growl="dismiss">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span>' +
            "</button>" +
            '<span data-growl="icon"></span>' +
            '<span data-growl="title"></span>' +
            '<span data-growl="message"></span>' +
            '<a href="#!" data-growl="url"></a>' +
            "</div>"
        }
        );
    }
    $(".notifications.btn").on("click", function(e) {
        e.preventDefault();
        var nFrom = $(this).attr("data-from");
        var nAlign = $(this).attr("data-align");
        var nIcons = $(this).attr("data-notify-icon");
        var nType = $(this).attr("data-type");
        var nAnimIn = $(this).attr("data-animation-in");
        var nAnimOut = $(this).attr("data-animation-out");
        notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);
    });

});
var errorMessage;
var baseUrl;
function delete_todo(e) {
    let token=localStorage.getItem("token");
    $.ajax(`${baseUrl}/news/category/`+e, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'token':token}, 
            success:function(res){
                errorMessage="با موفقیت حذف شد.";
                $("#successNotification").trigger( "click" );
                $("#" + e).fadeOut();

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                $("#errorNotification").trigger( "click" );
            }

        });
}
