$(document).ready(function() {
  var starting = true;
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
  eventId = localStorage.getItem("eventId");

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

  const filterNav = {
    temp: {
      status: false,
      industryName: false,
      industryId: false,
      isFilter: false
    },
    Students: {
      status: 0,
      industryName: false,
      reportId: 0,
      industryId: 0,
      isIndustry: false
    }
  };

  let allReports, industry;
  GetReport();
  GetIndustry();

  function AddReports() {
    for (i in allReports) {
      let id = allReports[i].id;
      let name = allReports[i].name;
      let type = "Students";

      let StudentsOpt = createIndustryOpt(id, name, type);
      $("#reportStudentsList").append(StudentsOpt);
    }
    document.getElementById("reportStudentsList").onchange = reportOptClick;
  }

  function createIndustryOpt(id, name, type) {
    return (
      '<option id="industry' +
      type +
      id +
      '" value="' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" industryName="' +
      name +
      '" >' +
      name +
      "</option>"
    );
  }

  function reportOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    filterNav[type].reportId = id;
    if (id == 4) {
      filterNav[type].state = 1;
      $("#industrySection").show();
    } else {
      filterNav[type].status = 2;
      $("#industrySection").hide();
    }
  }

  $("#downloadReport").click(function() {
    let status = filterNav["Students"].status;
    if (status == 0) {
      errorMessage = "نوع گزارش را انتخاب کنید!";
      $("#warningNotification").trigger("click");
      return;
    } else if (status == 1) {
      errorMessage = "حوزه فعالیت را انتخاب کنید!";
      $("#warningNotification").trigger("click");
      return;
    } else if (status == 2) {
      let url,
        id = filterNav["Students"].reportId;
      if (id == 4) {
        let industryId = filterNav["Students"].industryId;
        url = `4?value=${industryId}`;
      } else url = id;

      PostReport(url);
    }
  });

  function GetReport(mode) {
    $.ajax(`${baseUrl}/event/${eventId}/report`, {
      type: "GET",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        allReports = res;
        AddReports();
        // AddCallender();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function PostReport(id) {
    $.ajax(`${baseUrl}/event/${eventId}/report/${id}`, {
      //   data: JSON.stringify(datas),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(request) {
        a = document.createElement("a");
        a.href = request.url;
        // Give filename you wish to download
        a.download = "test-file.xls";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function AddIndustry() {
    for (i in industry) {
      let id = industry[i].id;

      let StudentsOpt = createIndustryOpt(id, industry[i].name, "Industry");
      $("#industryStudentsList").append(StudentsOpt);
    }
    document.getElementById("industryStudentsList").onchange = industryOptClick;
  }

  function GetIndustry() {
    $.ajax(`${baseUrl}/event/${eventId}/industry`, {
      type: "GET",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        industry = res;
        AddIndustry();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function industryOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    filterNav[type].status = 2;
  }

  let schoolEditMode = "default",
    uploadedFile,
    uploadedFileUrl,
    uploadedFileMap,
    uploadedFileMapUrl;
  // SchoolInformstatuson();

  function AddSchoolInformation() {
    $("#eventName").text(SchoolInformation.name);
    $("#eventAddress").text(SchoolInformation.address);
    // $("#eventMapUrl").val(SchoolInformation.mapUrl);
    $("#eventLat").val(SchoolInformation.lat);
    $("#eventLng").val(SchoolInformation.lng);
    $("#eventDetail").val(SchoolInformation.text);
    $("#imageUrl").attr("src", SchoolInformation.imageUrl);
    $("#imageUrlMap").attr("src", SchoolInformation.mapUrl);
  }

  document.getElementById("imageUrl").addEventListener("click", () => {
    if (schoolEditMode == "edit") {
      document.getElementById("imageUrlInp").click();
    }
  });
  document.getElementById("imageUrlInp").onchange = imageUrlChange;

  function imageUrlChange() {
    uploadedFile = event.target.files[0];
    $("#imageUrl").attr("src", URL.createObjectURL(uploadedFile));
  }

  document.getElementById("imageUrlMap").addEventListener("click", () => {
    if (schoolEditMode == "edit") {
      document.getElementById("imageUrlMapInp").click();
    }
  });
  document.getElementById("imageUrlMapInp").onchange = imageUrlMapChange;

  function imageUrlMapChange() {
    uploadedFileMap = event.target.files[0];
    $("#imageUrlMap").attr("src", URL.createObjectURL(uploadedFileMap));
  }

  function enableEditSchool() {
    $("#eventNameInp").val($("#eventName").text());
    $("#eventName").hide();
    $("#eventNameInp").show();

    $("#editEventIcon").hide();
    $("#saveEventIcon").show();
    $("#cancelEventIcon").show();

    $("#eventAddress").prop("disabled", false);
    $("#eventLat").prop("disabled", false);
    $("#eventLng").prop("disabled", false);
    $("#eventDetail").prop("disabled", false);
  }

  function disableEditSchool() {
    $("#eventName").show();
    $("#eventNameInp").hide();

    $("#editEventIcon").show();
    $("#saveEventIcon").hide();
    $("#cancelEventIcon").hide();

    $("#eventAddress").prop("disabled", true);
    $("#eventLat").prop("disabled", true);
    $("#eventLng").prop("disabled", true);
    $("#eventDetail").prop("disabled", true);
  }

  $("#editEventIcon").click(function() {
    if (schoolEditMode == "default") {
      schoolEditMode = "edit";
      enableEditSchool();
    }
  });
  $("#saveEventIcon").click(function() {
    if (schoolEditMode == "edit") {
      if ($("#imageUrl").attr("src") != SchoolInformation.imageUrl) {
        errorMessage = "تا آپلود شدن تصویر رویداد منتظر بمانید !";
        $("#warningNotification").trigger("click");
        PutAvatar(uploadedFile, false);
      } else uploadedFileUrl = SchoolInformation.imageUrl;
      if ($("#imageUrlMap").attr("src") != SchoolInformation.mapUrl) {
        errorMessage = "تا آپلود شدن نقشه منتظر بمانید !";
        $("#warningNotification").trigger("click");
        PutAvatar(uploadedFileMap, true);
      } else uploadedFileMapUrl = SchoolInformation.mapUrl;

      let name = $("#eventNameInp").val();
      let address = $("#eventAddress").val();
      let lat = $("#eventLat").val();
      let lng = $("#eventLng").val();
      let detail = $("#eventDetail").val();

      let datas = {
        name: name,
        text: detail,
        imageUrl: uploadedFileUrl,
        address: address,
        mapUrl: uploadedFileMapUrl,
        lat: lat,
        lng: lng
      };
      PutSchoolInformation(datas);
    }
  });
  $("#cancelEventIcon").click(function() {
    if (schoolEditMode == "edit") {
      schoolEditMode = "default";
      $("#imageUrl").attr("src", SchoolInformation.imageUrl);

      disableEditSchool();
    }
  });
  GetSchoolInformation();
  function GetSchoolInformation() {
    $.ajax(`${baseUrl}/event/${eventId}`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        SchoolInformation = res;
        AddSchoolInformation();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function PutSchoolInformation(datas) {
    $.ajax(`${baseUrl}/event/${eventId}`, {
      data: JSON.stringify(datas),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت ویرایش شد.";
        $("#successNotification").trigger("click");
        schoolEditMode = "default";
        disableEditSchool();
        SchoolInformation = res;
        AddSchoolInformation();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function PutAvatar(file, isMap) {
    let fileType = file.type;
    let suffix = fileType.substring(fileType.indexOf("/") + 1);
    const datas = new FormData();
    datas.append("file", file);
    $.ajax({
      type: "POST",
      url: `${baseUrl}/file/${suffix}`,
      data: datas,
      async: false,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        if (isMap) uploadedFileMapUrl = res.url;
        else uploadedFileUrl = res.url;
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "عکس آپلود نشد!";
        $("#errorNotification").trigger("click");
        return false;
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
    var nFrom = $(this).attr("data-from");
    var nAlign = $(this).attr("data-align");
    var nIcons = $(this).attr("data-notify-icon");
    var nType = $(this).attr("data-type");
    var nAnimIn = $(this).attr("data-animation-in");
    var nAnimOut = $(this).attr("data-animation-out");
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);
  });
});
