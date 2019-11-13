var baseUrl=localStorage.getItem("baseUrl");
var errorMessage;
$(document).ready(function() {

    var token = localStorage.getItem("token");
    var refreshToken = localStorage.getItem("refreshToken");
    if(token==""||token==null||refreshToken==""||refreshToken==null)
        window.location="signin.html"; 
    tokenValidate();

    function tokenValidate(){
        $.ajax(`${baseUrl}/auth/token/check`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                if(res.expire<20)        
                refreshingToken();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                refreshToken();
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
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // window.location="signin.html";                 
            }
        });
    }

    let user;
    let userId=localStorage.getItem("userId");
    Getuser(userId);
    function Getuser(userId){
        $.ajax(`${baseUrl}/user/staff/${userId}`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'token': token}, 
            success: function(res) {
                user=res;
                $("#phoneNumber").attr('placeholder',user.phoneNumber);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    $("#changePhoneBtn").click(function() {
      let phoneNumber = $("#phoneNumber").val();
      if (phoneNumber == "") {
        errorMessage = "شماره موبایل را وارد کنید .";
        $("#errorNotification").trigger("click");
        return;
      }

      let newuser = {
        isTeacher: user.isTeacher,
        isStaff: user.isStaff,
        title: user.title,
        text: user.text,
        major: user.major,
        "phoneNumber": phoneNumber,
        password: "1234",
        firstName: user.firstName,
        lastName: user.lastName,
        nationalId: user.nationalId
      };
      PutPhone(newuser);
    });
    function PutPhone(newuser){
        $.ajax(`${baseUrl}/user/staff/`+user.id, {
            data: JSON.stringify(newuser),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'token': token}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                $("#phoneNumber").attr('placeholder',phoneNumber);
                setTimeout($('#multiCollapseExample1').collapse('hide'),3000)
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
            $("#errorNotification").trigger( "click" );
            }
        });
    }

    $("#ticketSend").click(function(){
        let text=$("#ticketText").val();
        let title=$('#ticketTitle').val();
        PostTicket(text,title);
    });
    function PostTicket(text,title){
        $.ajax(`${baseUrl}/Ticket`, {
            data: JSON.stringify({"title": title,"text": text}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                
                errorMessage="با موفقیت ارسال شد.";
                $("#successNotification").trigger( "click" );
                $("#ticketText").val('');
                $('#ticketTitle').val('');

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    $("#changePasswordBtn").click(function(){
        let oldPass=$("#oldPassword").val();
        let newPass=$("#newPassword1").val();
        let newPassRepeate=$("#newPassword2").val();
        if(newPass!=newPassRepeate){
            errorMessage="رمز ها باهم همخوانی ندارد";
            $("#errorNotification").trigger( "click" );
            return;
        }
        PostResetPass(oldPass,newPass)
    });
    function PostResetPass(oldPass,newPass){
        $.ajax(`${baseUrl}/User/ResetPassword`, {
            data: JSON.stringify({ "oldPassword": oldPass, "newPassword": newPass}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                
                errorMessage="با موفقیت تغییر کرد";
                $("#successNotification").trigger( "click" );
                $("#oldPassword").val('');
                $('#newPassword1').val('');
                $('#newPassword2').val('');
                setTimeout($('#multiCollapseExample2').collapse('hide'),3000)
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
        
    // var token = localStorage.getItem("token");
    let mode="default";
    let allTags, task;
    GetAllTags();


    function GetAllTags(){
        $.ajax(`${baseUrl}/industry`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                allTags=res;
                if(mode=="default")
                AddAllTags();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddAllTags(){
        $(".new-task").empty();
        addImageMode=true;
        for(j in allTags){
            if(allTags[j].isEnabled==true)
                continue;
            $(".add_task_todo").val(allTags[j].name);
            imgUrl=allTags[j].imageUrl;
            i=allTags[j].id
            $("#add-btn").trigger('click');
            // GetAllTags();
        }
        mode="add";
        addImageMode=false;
    }
    function PostTags(task,imageUrl){
        $.ajax(`${baseUrl}/industry`, {
            data: JSON.stringify({"imageUrl":imageUrl,"name":task}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                
                errorMessage="با موفقیت افزوده شد.";
                $("#successNotification").trigger( "click" );
                mode="default"
                GetAllTags();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

  var i,imageUrl;
  $("#add-btn").on("click", function() {
    $(".md-form-control").removeClass("md-valid");
    var task = $(".add_task_todo").val();
    if(addImageMode==false)
          alert("لطفا تصویر انتخاب کنید .") 
    else if (task == "")
      alert("لطفا کادر را پر کنید .");
    else {
        var add_todo = $(
            '<div class="to-do-list mb-3" id="' +
              i +
              '"><div class="d-inline-block">'+
              '<img id="imageUrlImg'+i+'" class="rounded-circle" style="width:40px;float:right;" src="'+imgUrl+'" alt="تصویر">'+
              '<label class="check-task custom-control custom-checkbox d-flex justify-content-center" style="margin-top:12px;"><span class="custom-control-label" for="checkbox' +
              i +
              '">' +
              task +
              '</span></label></div><div class="float-right"><a onclick="delete_todo(' +
              i +
              ');" href="#!" class="delete_todolist"><i class="far fa-trash-alt"></i></a></div></div>'
          );
        if(mode=="add"){
            if(!addImageMode)
                return;
            let fileType=uploadedImage.type;
            let suffix=fileType.substring(fileType.indexOf("/") + 1);
            addImageMode=false; 
            PutImage(task,suffix)
            // PostTags(add_todo,task);
        }
        else{
            $(add_todo)
            .appendTo(".new-task")
            .hide()
            .fadeIn(300);
            $(".add_task_todo").val("");
            $("#imageUrlImg").attr('src','../assets/images/user/add-image2.png');
        }

    }
  });
  $(".delete_todolist").on("click", function() {
    $(this)
      .parent()
      .parent()
      .fadeOut();
  });

    let uploadedImage;
    let addImageMode=false;
    document.getElementById("imageUrlImg").addEventListener('click', () => {
            document.getElementById('imageUrlInp').click()               
    })
    document.getElementById('imageUrlInp').onchange = ImageChange;
    function ImageChange(){
        uploadedImage=event.target.files[0]; 
        $("#imageUrlImg").attr('src',URL.createObjectURL(uploadedImage));
        addImageMode=true;       
    }
    // $("#addImage-btn").click(function(){
            
    // });
    function PutImage(task,suffix){
        const datas = new FormData();
        datas.append("file",uploadedImage)
        $.ajax({
            type: 'POST',
            url: `${baseUrl}/file/${suffix}`,
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'token':token}, 
            success: function(res) {
                PostTags(task,res.url)
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
                $("#errorNotification").trigger( "click" );
                return false;
            }
        });
    }


    let uploadedFile;
    let addFileMode=false;
    document.getElementById("selectFileIcon").addEventListener('click', () => {
        document.getElementById('selectFileInp').click()               
    })
    document.getElementById('selectFileInp').onchange = FileChange;
    function FileChange(){
        uploadedFile=event.target.files[0]; 
        $("#selectFile").text(uploadedFile.name)
        addFileMode=true;       
    }

    $("#addFile-btn").click(function(){
        if(!addFileMode)
            return;
        let fileType=uploadedFile.type;
        let suffix=fileType.substring(fileType.indexOf("/") + 1);
        alert(suffix)
    //   PutFile(recentNews.id,suffix);
        addFileMode=false;     
    });
    function PutFile(newsId,suffix){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/News/${newsId}/File/Suffix/${suffix}`,
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'token': token}, 
            success: function(res) {
            recentNews.fileUrl.push(res)
            AddFiles(recentNews.fileUrl);
            errorMessage="فایل افزوده شد.";
            $("#successNotification").trigger( "click" );
            $("#selectFile").text("");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
                $("#errorNotification").trigger( "click" );
                return false;
            }
        });
    }

//notification
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
function delete_todo(e) {
  let token=localStorage.getItem("token");
  $.ajax(`${baseUrl}/industry/`+e, {
          type: "DELETE",
          processData: true,
          contentType: "application/json",
          headers: {'token': token}, 
          success: function(res) {
              errorMessage="با موفقیت حذف شد.";
            //   alert(errorMessage)
              $("#successNotification").trigger( "click" );
              $("#" + e).fadeOut();
            //   GetAllTags();
          },
          error: function(jqXHR, textStatus, errorThrown,error) {
              // set errorMessage
              var err = eval("(" + jqXHR.responseText + ")");
              errorMessage="امکان حذف وجود ندارد.";
          $("#errorNotification").trigger( "click" );
          }
      });
}

