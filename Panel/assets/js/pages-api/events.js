/**
 *  Created by MBD
 *  26/9/1398
 */
$(document).ready(function() {
  var starting = true;
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
  let eventId = localStorage.getItem("eventId");
  if (
    token == "" ||
    token == null ||
    refreshToken == "" ||
    refreshToken == null
  )
    window.location = "signin.html";
  baseUrl = localStorage.getItem("baseUrl");
  tokenValidate();

  function tokenValidate() {
    $.ajax(`${baseUrl}/auth/token/check`, {
      type: "GET",
      async: false,
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        starting = false;
        if (res.expire < 20) refreshingToken();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        refreshingToken();
      }
    });
  }
  function refreshingToken() {
    $.ajax(`${baseUrl}/auth/token/refresh`, {
      data: JSON.stringify({ refresh_token: refreshToken }),
      type: "POST",
      processData: true,
      contentType: "application/json",
      success: function(res) {
        token = res.access_token;
        localStorage.setItem("token", token);
        starting = false;
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        window.location = "signin.html";
      }
    });
  }
  GetAllStudent();
  function GetAllStudent() {
    $.ajax(`${baseUrl}/event`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        AddAllStudents(res, "Events");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddAllStudents(people, type) {
    // for (var j = 0; j < 6; j++) {
    for (i in people) {
      let tr = createStaffTr(people[i], type);
      let id = people[i].id;
      $("#eventList").append(tr);
      document.getElementById(
        "event" + people[i].id
      ).onclick = showSpeakerlClick;
    }
    // }
  }
  function createStaffTr(person, type) {
    return (
      '<div id="event' +
      person.id +
      '" class="col-md-4 col-lg-4 mx-auto" style="margin-bottom:25px;">' +
      '<div class="card event">' +
      '<div class="card-body text-center" style="padding:0.7rem; cursor: pointer;">' +
      '<img src="' +
      person.imageUrl +
      '" class="img-radius mb-4 eventImg" alt="تصویر رویداد">' +
      "<h5>" +
      person.name +
      "</h5>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }
  function showSpeakerlClick() {
    let objectId = $(this).attr("id");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    localStorage.setItem("eventId", id);
    window.location = "index.html";
  }
  //notification
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
