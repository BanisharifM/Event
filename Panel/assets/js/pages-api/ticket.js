$(document).ready(function() {
  var starting = true;
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
  let eventId = localStorage.getItem("eventId");

  if (
    token === "" ||
    token === null ||
    refreshToken === "" ||
    refreshToken == null
  )
    window.location = "signin.html";
  baseUrl = localStorage.getItem("baseUrl");
  tokenValidate();

  function tokenValidate() {
    $.ajax(`${baseUrl}/auth/token/check`, {
      type: "GET",
      processData: true,
      async: false,
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

  let allMessage;
  GetMessages();

  function AddTestDate(exampRes) {
    $("#TestDateList").empty();
    for (i in exampRes) {
      let id = exampRes[i].id;
      let name = exampRes[i].title;
      let status = exampRes[i].answered;
      let date = exampRes[i].createDate.substring(0, 10);
      let time = exampRes[i].createDate.substring(11);
      let text = exampRes[i].question
        .split(/\s+/)
        .slice(0, 15)
        .join(" ");

      let tr = createTestDateTr(id, "TestDate", name, date, time, text, status);
      $("#TestDateList").append(tr);
      document.getElementById("tr" + id).onclick = gotoMessageContent;
    }
  }
  function createTestDateTr(id, type, name, date, time, text, status) {
    return (
      '<tr id="tr' +
      id +
      '" style="cursor:pointer;">' +
      "<td>" +
      testStatus(id, type, status) +
      "</td>" +
      "<td>" +
      testDateName(id, type, name) +
      "</td>" +
      "<td>" +
      testDateDate(id, type, date) +
      "</td>" +
      "<td>" +
      testDateTime(id, type, time) +
      "</td>" +
      "<td>" +
      testDateDetail(id, type, text) +
      "</td>" +
      "</tr>"
    );
  }

  function gotoMessageContent() {
    let objectId = $(this).attr("id");
    let id = objectId.match(/\d+/)[0];
    let message = allMessage.find(x => x.id == id);
    if (!message.answered) {
      errorMessage = "هنوز پاسخی داده نشده است !";
      $("#warningNotification").trigger("click");
      return;
    }
    localStorage.setItem("Ticket_Ans", message.answer);
    localStorage.setItem("Ticket_Title", message.title);
    localStorage.setItem("Ticket_Qu", message.question);
    window.location = "ticketContent.html";
    //go to news page
  }

  function testStatus(id, type, status) {
    return (
      '<div class="to-do-list" style="margin-top:-17px;" disabled>' +
      '<div class="checkbox-fade fade-in-primary"' +
      'style="pointer-events:none;">' +
      '<label class="check-task done-task">' +
      '<input type="checkbox" checked="">' +
      '<span class="cr mr-3"' +
      (status ? "" : 'style="background: #f44236 !important;') +
      '">' +
      '<i class="cr-icon fas ' +
      (status ? 'fa-check"' : 'fa-times"') +
      'txt-danger"></i>' +
      "</span>" +
      "</label>" +
      "</div>" +
      "</div>"
    );
  }
  function testDateName(id, type, name) {
    return (
      '<h6 id="Name' +
      type +
      id +
      '" class="mb-1" objectId="' +
      type +
      id +
      '" >' +
      name +
      "</h6>"
    );
  }
  function testDateDate(id, type, date) {
    return (
      '<div class="col-sm-6 col-md-6">' +
      '<h6 class="mb-1">' +
      date +
      "</h6>" +
      "</div>"
    );
  }
  function testDateTime(id, type, time) {
    return (
      '<div class="col-sm-6 col-md-6">' +
      '<h6 class="mb-1">' +
      time +
      "</h6>" +
      "</div>"
    );
  }
  function testDateDetail(id, type, name) {
    return (
      '<h6 id="detail' +
      type +
      id +
      '" class="mb-1" objectId="' +
      type +
      id +
      '" >' +
      name +
      "</h6>"
    );
  }

  function GetMessages() {
    $.ajax(`${baseUrl}/event/${eventId}/ticket/panel`, {
      type: "GET",
      processData: false,
      async: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        allMessage = res;
        AddTestDate(allMessage);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
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
    let nFrom = $(this).attr("data-from");
    let nAlign = $(this).attr("data-align");
    let nIcons = $(this).attr("data-notify-icon");
    let nType = $(this).attr("data-type");
    let nAnimIn = $(this).attr("data-animation-in");
    let nAnimOut = $(this).attr("data-animation-out");
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);
  });
});
