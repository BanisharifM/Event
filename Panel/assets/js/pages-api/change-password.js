$(document).ready(function() {

  var baseUrl=localStorage.getItem("baseUrl");
  
  $("#submit").click(function() {
    let data = {
      nationalId: localStorage.getItem("resetPassNationalId"),
      oneTimeToken: $("#token").val(),
      newPassword: $("#password").val()
    };
    ForgotPassword(data);
  });

  function ForgotPassword(data) {
    $.ajax(`${baseUrl}/User/ForgotPassword`, {
      data: JSON.stringify(data),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { "api-version": "1.0" },
      success: function(res) {
        let user = {
          nationalId: data.nationalId,
          password: data.newPassword
        };
        signinCall(user);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "مجددا تلاش کنید"
        $("#errorNotification").trigger("click");
      }
    });
  }

  function signinCall(user) {
    $.ajax(`${baseUrl}/user/login`, {
      data: JSON.stringify(user),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { "api-version": "1.0" },
      success: function(res) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userId", res.userId);
        window.location = "index.html";
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        window.location = "signin.html";
      }
    });
  }
  let errorMessage;
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
});
