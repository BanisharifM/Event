$(document).ready(function() {

  localStorage.setItem("token","");
  localStorage.setItem("refreshToken","");
  localStorage.setItem("userId",0);
  
  var baseUrl=localStorage.getItem("baseUrl");
  $("#singin").click(function() {
    let user = {
      nationalId: $("#phoneNumber").val(),
      password: $("#password").val()
    };
    signinCall(user);
  });

  function signinCall(user){
    $.ajax(`${baseUrl}/user/login`, {
      data: JSON.stringify(user),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { "api-version": "1.0" },
      success: function(res) {
        localStorage.setItem("token",res.token);
        localStorage.setItem("userId",res.userId);
        localStorage.setItem("isManager",res.isManager);
        window.location="index.html";         
      },
      error: function(jqXHR, textStatus, errorThrown,error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage=err.Message;
      $("#errorNotification").trigger( "click" );
      }
    });
  }
  let errorMessage;
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
