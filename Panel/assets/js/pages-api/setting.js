var baseUrl = localStorage.getItem("baseUrl");
var errorMessage, eventId;
$(document).ready(function() {
  var starting = true;
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
  // var userId = localStorage.getItem("userId");
  eventId = localStorage.getItem("eventId");
  if (
    token == "" ||
    token == null ||
    refreshToken == "" ||
    refreshToken == null
  )
    window.location = "signin.html";
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

  let user;
  let userId = localStorage.getItem("userId");
  // Getuser(userId);
  function Getuser(userId) {
    $.ajax(`${baseUrl}/event/${eventId}/user/staff/${userId}`, {
      type: "GET",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        user = res;
        $("#phoneNumber").attr("placeholder", user.phoneNumber);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
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
      phoneNumber: phoneNumber,
      password: "1234",
      firstName: user.firstName,
      lastName: user.lastName,
      nationalId: user.nationalId
    };
    // PutPhone(newuser);
  });
  function PutPhone(newuser) {
    $.ajax(`${baseUrl}/event/${eventId}/user/staff/` + user.id, {
      data: JSON.stringify(newuser),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        $("#phoneNumber").attr("placeholder", phoneNumber);
        setTimeout($("#multiCollapseExample1").collapse("hide"), 3000);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  $("#ticketSend").click(function() {
    let text = $("#ticketText").val();
    let title = $("#ticketTitle").val();
    PostTicket(text, title);
  });
  function PostTicket(text, title) {
    $.ajax(`${baseUrl}/event/${eventId}/ticket/panel`, {
      data: JSON.stringify({
        title: title,
        question: text,
        eventId: eventId,
        adminId: userId
      }),
      type: "POST",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت ارسال شد.";
        $("#successNotification").trigger("click");
        $("#ticketText").val("");
        $("#ticketTitle").val("");
        setTimeout($("#multiCollapseExample4").collapse("hide"), 3000);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  $("#changePasswordBtn").click(function() {
    let oldPass = $("#oldPassword").val();
    let newPass = $("#newPassword1").val();
    let newPassRepeate = $("#newPassword2").val();
    if (newPass != newPassRepeate) {
      errorMessage = "رمز ها باهم همخوانی ندارد";
      $("#errorNotification").trigger("click");
      return;
    }
    PostResetPass(oldPass, newPass);
  });
  function PostResetPass(oldPass, newPass) {
    $.ajax(`${baseUrl}/auth/admin/changepass`, {
      data: JSON.stringify({
        old: MD5(oldPass).toUpperCase(),
        new: MD5(newPass).toUpperCase()
      }),
      type: "PUT",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت تغییر کرد";
        $("#successNotification").trigger("click");
        $("#oldPassword").val("");
        $("#newPassword1").val("");
        $("#newPassword2").val("");
        setTimeout($("#multiCollapseExample2").collapse("hide"), 3000);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  // var token = localStorage.getItem("token");
  let mode = "default";
  let allTags, task;
  GetAllTags();

  function GetAllTags() {
    $.ajax(`${baseUrl}/event/${eventId}/industry`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        allTags = res;
        if (mode == "default") AddAllTags();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddAllTags() {
    $(".new-task").empty();
    addImageMode = true;
    for (j in allTags) {
      if (allTags[j].isEnabled == true) continue;
      $(".add_task_todo").val(allTags[j].name);
      imgUrl = allTags[j].imageUrl;
      i = allTags[j].id;
      $("#add-btn").trigger("click");
      // GetAllTags();
    }
    mode = "add";
    addImageMode = false;
  }
  function PostTags(task, imageUrl) {
    $.ajax(`${baseUrl}/event/${eventId}/industry`, {
      data: JSON.stringify({ imageUrl: imageUrl, name: task }),
      type: "POST",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت افزوده شد.";
        $("#successNotification").trigger("click");
        mode = "default";
        GetAllTags();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  var i, imageUrl;
  $("#add-btn").on("click", function() {
    $(".md-form-control").removeClass("md-valid");
    var task = $(".add_task_todo").val();
    if (addImageMode == false) alert("لطفا تصویر انتخاب کنید .");
    else if (task == "") alert("لطفا کادر را پر کنید .");
    else {
      var add_todo = $(
        '<div class="to-do-list mb-3" id="' +
          i +
          '"><div class="d-inline-block">' +
          '<img id="imageUrlImg' +
          i +
          '" class="rounded-circle" style="width:40px;float:right;" src="' +
          imgUrl +
          '" alt="تصویر">' +
          '<label class="check-task custom-control custom-checkbox d-flex justify-content-center" style="margin-top:12px;"><span class="custom-control-label" for="checkbox' +
          i +
          '">' +
          task +
          '</span></label></div><div class="float-right"><a onclick="delete_todo(' +
          i +
          ');" href="#!" class="delete_todolist"><i class="far fa-trash-alt"></i></a></div></div>'
      );
      if (mode == "add") {
        if (!addImageMode) return;
        let fileType = uploadedImage.type;
        let suffix = fileType.substring(fileType.indexOf("/") + 1);
        addImageMode = false;
        PutImage(task, suffix);
        // PostTags(add_todo,task);
      } else {
        $(add_todo)
          .appendTo(".new-task")
          .hide()
          .fadeIn(300);
        $(".add_task_todo").val("");
        $("#imageUrlImg").attr("src", "../assets/images/user/add-image2.png");
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
  let addImageMode = false;
  document.getElementById("imageUrlImg").addEventListener("click", () => {
    document.getElementById("imageUrlInp").click();
  });
  document.getElementById("imageUrlInp").onchange = ImageChange;
  function ImageChange() {
    uploadedImage = event.target.files[0];
    $("#imageUrlImg").attr("src", URL.createObjectURL(uploadedImage));
    addImageMode = true;
  }
  // $("#addImage-btn").click(function(){

  // });
  function PutImage(task, suffix) {
    const datas = new FormData();
    datas.append("file", uploadedImage);
    $.ajax({
      type: "POST",
      url: `${baseUrl}/file/${suffix}`,
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        PostTags(task, res.url);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "عکس آپلود نشد!";
        $("#errorNotification").trigger("click");
        return false;
      }
    });
  }

  let uploadedFile, fileTypeId;
  let addFileMode = false;
  document.getElementById("selectFileIcon").addEventListener("click", () => {});
  function openSelectFile() {
    let objectId = $(this).attr("id");
    let id = objectId.match(/\d+/)[0];
    fileTypeId = id;
    let type = $(this).attr("format");
    $("#selectFileInp").attr("accept", "." + type);
    $("#multiCollapseExample31").collapse("hide");
    document.getElementById("selectFileInp").click();
  }
  document.getElementById("selectFileInp").onchange = FileChange;
  function FileChange() {
    uploadedFile = event.target.files[0];
    $("#selectFile").text(uploadedFile.name);
    addFileMode = true;
  }

  $("#addFile-btn").click(function() {
    if (!addFileMode) return;
    // let fileType = uploadedFile.type;
    // let suffix = fileType.substring(fileType.indexOf("/") + 1);
    // alert(suffix);
    PutFile();
    addFileMode = false;
  });
  function PutFile(newsId, suffix) {
    const datas = new FormData();
    datas.append("file", uploadedFile);
    $.ajax({
      type: "POST",
      url: `${baseUrl}/event/${eventId}/import/${fileTypeId}`,
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت آپلود شد !";
        $("#successNotification").trigger("click");
        $("#selectFile").text("");
        $("#multiCollapseExample6").collapse("hide");
        document.getElementById("selectFileInp").value = "";
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "فایل آپلود نشد !";
        $("#errorNotification").trigger("click");
        return false;
      }
    });
  }

  //user type list
  let allType;
  GetAllType();
  function GetAllType() {
    $.ajax(`${baseUrl}/event/${eventId}/import`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        allType = res;
        AddAllType();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddAllType() {
    $(".new-tasks").empty();
    for (j in allType) {
      let tr = typeItem(allType[j].id, allType[j].name, allType[j].format);
      $(".new-tasks").append(tr);
      document.getElementById("type" + allType[j].id).onclick = openSelectFile;
    }
  }
  function typeItem(id, typeName, format) {
    return (
      '<label id="type' +
      id +
      '" format="' +
      format +
      '" class="check-task custom-control custom-checkbox d-flex justify-content" style="margin-top:12px; cursor: pointer;">' +
      '<span class="custom-control-label" for="checkbox11">' +
      typeName +
      "</span></label>"
    );
  }

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

  MD5 = function(e) {
    function h(a, b) {
      var c, d, e, f, g;
      e = a & 2147483648;
      f = b & 2147483648;
      c = a & 1073741824;
      d = b & 1073741824;
      g = (a & 1073741823) + (b & 1073741823);
      return c & d
        ? g ^ 2147483648 ^ e ^ f
        : c | d
        ? g & 1073741824
          ? g ^ 3221225472 ^ e ^ f
          : g ^ 1073741824 ^ e ^ f
        : g ^ e ^ f;
    }

    function k(a, b, c, d, e, f, g) {
      a = h(a, h(h((b & c) | (~b & d), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function l(a, b, c, d, e, f, g) {
      a = h(a, h(h((b & d) | (c & ~d), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function m(a, b, d, c, e, f, g) {
      a = h(a, h(h(b ^ d ^ c, e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function n(a, b, d, c, e, f, g) {
      a = h(a, h(h(d ^ (b | ~c), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function p(a) {
      var b = "",
        d = "",
        c;
      for (c = 0; 3 >= c; c++)
        (d = (a >>> (8 * c)) & 255),
          (d = "0" + d.toString(16)),
          (b += d.substr(d.length - 2, 2));
      return b;
    }

    var f = [],
      q,
      r,
      s,
      t,
      a,
      b,
      c,
      d;
    e = (function(a) {
      a = a.replace(/\r\n/g, "\n");
      for (var b = "", d = 0; d < a.length; d++) {
        var c = a.charCodeAt(d);
        128 > c
          ? (b += String.fromCharCode(c))
          : (127 < c && 2048 > c
              ? (b += String.fromCharCode((c >> 6) | 192))
              : ((b += String.fromCharCode((c >> 12) | 224)),
                (b += String.fromCharCode(((c >> 6) & 63) | 128))),
            (b += String.fromCharCode((c & 63) | 128)));
      }
      return b;
    })(e);
    f = (function(b) {
      var a,
        c = b.length;
      a = c + 8;
      for (
        var d = 16 * ((a - (a % 64)) / 64 + 1), e = Array(d - 1), f = 0, g = 0;
        g < c;

      )
        (a = (g - (g % 4)) / 4),
          (f = (g % 4) * 8),
          (e[a] |= b.charCodeAt(g) << f),
          g++;
      a = (g - (g % 4)) / 4;
      e[a] |= 128 << ((g % 4) * 8);
      e[d - 2] = c << 3;
      e[d - 1] = c >>> 29;
      return e;
    })(e);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (e = 0; e < f.length; e += 16)
      (q = a),
        (r = b),
        (s = c),
        (t = d),
        (a = k(a, b, c, d, f[e + 0], 7, 3614090360)),
        (d = k(d, a, b, c, f[e + 1], 12, 3905402710)),
        (c = k(c, d, a, b, f[e + 2], 17, 606105819)),
        (b = k(b, c, d, a, f[e + 3], 22, 3250441966)),
        (a = k(a, b, c, d, f[e + 4], 7, 4118548399)),
        (d = k(d, a, b, c, f[e + 5], 12, 1200080426)),
        (c = k(c, d, a, b, f[e + 6], 17, 2821735955)),
        (b = k(b, c, d, a, f[e + 7], 22, 4249261313)),
        (a = k(a, b, c, d, f[e + 8], 7, 1770035416)),
        (d = k(d, a, b, c, f[e + 9], 12, 2336552879)),
        (c = k(c, d, a, b, f[e + 10], 17, 4294925233)),
        (b = k(b, c, d, a, f[e + 11], 22, 2304563134)),
        (a = k(a, b, c, d, f[e + 12], 7, 1804603682)),
        (d = k(d, a, b, c, f[e + 13], 12, 4254626195)),
        (c = k(c, d, a, b, f[e + 14], 17, 2792965006)),
        (b = k(b, c, d, a, f[e + 15], 22, 1236535329)),
        (a = l(a, b, c, d, f[e + 1], 5, 4129170786)),
        (d = l(d, a, b, c, f[e + 6], 9, 3225465664)),
        (c = l(c, d, a, b, f[e + 11], 14, 643717713)),
        (b = l(b, c, d, a, f[e + 0], 20, 3921069994)),
        (a = l(a, b, c, d, f[e + 5], 5, 3593408605)),
        (d = l(d, a, b, c, f[e + 10], 9, 38016083)),
        (c = l(c, d, a, b, f[e + 15], 14, 3634488961)),
        (b = l(b, c, d, a, f[e + 4], 20, 3889429448)),
        (a = l(a, b, c, d, f[e + 9], 5, 568446438)),
        (d = l(d, a, b, c, f[e + 14], 9, 3275163606)),
        (c = l(c, d, a, b, f[e + 3], 14, 4107603335)),
        (b = l(b, c, d, a, f[e + 8], 20, 1163531501)),
        (a = l(a, b, c, d, f[e + 13], 5, 2850285829)),
        (d = l(d, a, b, c, f[e + 2], 9, 4243563512)),
        (c = l(c, d, a, b, f[e + 7], 14, 1735328473)),
        (b = l(b, c, d, a, f[e + 12], 20, 2368359562)),
        (a = m(a, b, c, d, f[e + 5], 4, 4294588738)),
        (d = m(d, a, b, c, f[e + 8], 11, 2272392833)),
        (c = m(c, d, a, b, f[e + 11], 16, 1839030562)),
        (b = m(b, c, d, a, f[e + 14], 23, 4259657740)),
        (a = m(a, b, c, d, f[e + 1], 4, 2763975236)),
        (d = m(d, a, b, c, f[e + 4], 11, 1272893353)),
        (c = m(c, d, a, b, f[e + 7], 16, 4139469664)),
        (b = m(b, c, d, a, f[e + 10], 23, 3200236656)),
        (a = m(a, b, c, d, f[e + 13], 4, 681279174)),
        (d = m(d, a, b, c, f[e + 0], 11, 3936430074)),
        (c = m(c, d, a, b, f[e + 3], 16, 3572445317)),
        (b = m(b, c, d, a, f[e + 6], 23, 76029189)),
        (a = m(a, b, c, d, f[e + 9], 4, 3654602809)),
        (d = m(d, a, b, c, f[e + 12], 11, 3873151461)),
        (c = m(c, d, a, b, f[e + 15], 16, 530742520)),
        (b = m(b, c, d, a, f[e + 2], 23, 3299628645)),
        (a = n(a, b, c, d, f[e + 0], 6, 4096336452)),
        (d = n(d, a, b, c, f[e + 7], 10, 1126891415)),
        (c = n(c, d, a, b, f[e + 14], 15, 2878612391)),
        (b = n(b, c, d, a, f[e + 5], 21, 4237533241)),
        (a = n(a, b, c, d, f[e + 12], 6, 1700485571)),
        (d = n(d, a, b, c, f[e + 3], 10, 2399980690)),
        (c = n(c, d, a, b, f[e + 10], 15, 4293915773)),
        (b = n(b, c, d, a, f[e + 1], 21, 2240044497)),
        (a = n(a, b, c, d, f[e + 8], 6, 1873313359)),
        (d = n(d, a, b, c, f[e + 15], 10, 4264355552)),
        (c = n(c, d, a, b, f[e + 6], 15, 2734768916)),
        (b = n(b, c, d, a, f[e + 13], 21, 1309151649)),
        (a = n(a, b, c, d, f[e + 4], 6, 4149444226)),
        (d = n(d, a, b, c, f[e + 11], 10, 3174756917)),
        (c = n(c, d, a, b, f[e + 2], 15, 718787259)),
        (b = n(b, c, d, a, f[e + 9], 21, 3951481745)),
        (a = h(a, q)),
        (b = h(b, r)),
        (c = h(c, s)),
        (d = h(d, t));
    return (p(a) + p(b) + p(c) + p(d)).toLowerCase();
  };
});
function delete_todo(e) {
  let token = localStorage.getItem("token");
  $.ajax(`${baseUrl}/event/${eventId}/industry/` + e, {
    type: "DELETE",
    processData: true,
    contentType: "application/json",
    headers: { token: token },
    success: function(res) {
      errorMessage = "با موفقیت حذف شد.";
      //   alert(errorMessage)
      $("#successNotification").trigger("click");
      $("#" + e).fadeOut();
      //   GetAllTags();
    },
    error: function(jqXHR, textStatus, errorThrown, error) {
      // set errorMessage
      var err = eval("(" + jqXHR.responseText + ")");
      errorMessage = "امکان حذف وجود ندارد.";
      $("#errorNotification").trigger("click");
    }
  });
}
