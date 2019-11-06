var baseUrl=localStorage.getItem("baseUrl");
var errorMessage;
$(document).ready(function() {

    let token=localStorage.getItem("token");
    if(token==""||null)
        window.location="signin.html"; 
        


    let user;
    let userId=localStorage.getItem("userId");
    Getuser(userId);
    function Getuser(userId){
        $.ajax(`${baseUrl}/user/staff/${userId}`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                user=res;
                $("#phoneNumber").attr('placeholder',user.phoneNumber);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
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
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                $("#phoneNumber").attr('placeholder',phoneNumber);
                setTimeout($('#multiCollapseExample1').collapse('hide'),3000)
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
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
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                
                errorMessage="با موفقیت ارسال شد.";
                $("#successNotification").trigger( "click" );
                $("#ticketText").val('');
                $('#ticketTitle').val('');

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
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
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
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
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
        
    // var token = localStorage.getItem("token");
    let mode="default";
    let allTags, task;
    GetAllTags();


    function GetAllTags(){
        $.ajax(`${baseUrl}/Samplealert`, {
            // data: JSON.stringify({"classId":classId}),
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
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
            if(allTags[j].isEnabled==true)
                continue;
            $(".add_task_todo").val(allTags[j].text);
            i=allTags[j].id
            $("#add-btn").trigger('click');
            // GetAllTags();
        }
        mode="add"
    }
    function PostTags(add_todo,task){
        $.ajax(`${baseUrl}/samplealert`, {
            data: JSON.stringify({"title":"-","text":task}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                
                errorMessage="با موفقیت افزوده شد.";
                $("#successNotification").trigger( "click" );
                mode="default"
                GetAllTags();
                // $(add_todo)
                // .appendTo(".new-task")
                // .hide()
                // .fadeIn(300);
                // $(".add_task_todo").val("");
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
    //   PutFile(recentNews.id,suffix);
      $("#selectFile").text("انتخاب فایل ...")  
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
          headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
          success: function(res) {
              recentNews.fileUrl.push(res)
              AddFiles(recentNews.fileUrl);
              errorMessage="فایل افزوده شد.";
              $("#successNotification").trigger( "click" );
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
  $.ajax(`${baseUrl}/samplealert/`+e, {
        //   data: JSON.stringify({"enable": true}),
          type: "DELETE",
          processData: true,
          contentType: "application/json",
          headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
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
              errorMessage=err.Message;
          $("#errorNotification").trigger( "click" );
          }
      });
}

