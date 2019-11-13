// "use strict";
$(document).ready(function() {

    var starting=true;
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
                starting=false;
                if(res.expire<20)        
                    refreshingToken();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                refreshingToken();
            }
        });
    }
    function refreshingToken(){
        $.ajax(`${baseUrl}/auth/token/refresh`, {
            data: JSON.stringify({"refresh_token":refreshToken}),
            type: "POST",
            processData: true,
            contentType: "application/json",           
            success: function(res) {
                token=res.access_token;
                localStorage.setItem('token',token);
                starting=false;
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                window.location="signin.html";                 
            }
        });
    }
    
    
    let id=localStorage.getItem("Message_ID");
    let adminId=localStorage.getItem("userId");
    let title=localStorage.getItem("Message_Title");
    let question=localStorage.getItem("Message_Qu");
    $("#ticketTitle").val(title);
    $("#ticketQuestion").val(question);

    function PutNews(answer){
        $.ajax(`${baseUrl}/ticket/${id}`, {
            data: JSON.stringify({"answer":answer,"adminId":adminId}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'token':token}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                window.location="message.html";                         
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
            $("#errorNotification").trigger( "click" );
            }
        });
    }

    $("#ticketAnswering").click(function(){
        let answer=$("#ticketAnswer").val();
        if(answer==""||answer==null){
            errorMessage="کادر پاسخ را تکمیل کنید.";
            $("#errorNotification").trigger( "click" );
            return;
        }
        if(!confirm("آیا مطمئن  هستید پاسخ داده شود شود؟"))
            return;
        PutNews(answer)    
    });
    

  //notification
  function notify(from, align, icon, type, animIn, animOut) {
    $.growl(
      {
        icon: icon,
        title: "",
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
  var errorMessage;

});


