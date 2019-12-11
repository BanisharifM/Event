$(document).ready(function() {
  let starting = true;
  let token = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refreshToken");
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
    document.getElementById("industryStudentsList").onchange = reportOptClick;
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
    uploadedFile;

  // SchoolInformstatuson();

  function AddSchoolInformation() {
    $("#schoolName").text(SchoolInformation.name);
    $("#schoolDetail").text(SchoolInformation.text);
    $("#imageUrl").attr("src", SchoolInformation.imageUrl);
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

  function enableEditSchool() {
    $("#schoolNameInp").val($("#schoolName").text());
    $("#schoolDetailInp").val($("#schoolDetail").text());

    $("#editSchoolIcon").hide();
    $("#saveSchoolIcon").show();
    $("#cancelSchoolIcon").show();

    $("#schoolName").hide();
    $("#schoolNameInp").css("display", "block");

    $("#schoolDetail").hide();
    $("#schoolDetailInp").css("display", "block");
  }

  function disableEditSchool() {
    let name = $("#schoolNameInp").val();
    let detail = $("#schoolDetailInp").val();

    $("#editSchoolIcon").show();
    $("#saveSchoolIcon").hide();
    $("#cancelSchoolIcon ").hide();

    $("#schoolName").show();
    $("#schoolNameInp").hide();

    $("#schoolDetail").show();
    $("#schoolDetailInp").hide();
  }

  $("#editSchoolIcon").click(function() {
    if (schoolEditMode == "default") {
      schoolEditMode = "edit";
      $("#schoolNameInp").val($("#schoolName").text());
      $("#schoolDetailInp").val($("#schoolDetail").text());
      enableEditSchool();
    }
  });
  $("#saveSchoolIcon").click(function() {
    if (schoolEditMode == "edit") {
      if ($("#imageUrl").attr("src") != SchoolInformation.imageUrl)
        PutAvatar(SchoolInformation.id);
      let name = $("#schoolNameInp").val();
      let text = $("#schoolDetailInp").val();
      if (name != SchoolInformation.name || text != SchoolInformation.text) {
        let datas = {
          name: name,
          text: text
        };
        PutSchoolInformation(SchoolInformation.id, datas);
      } else {
        schoolEditMode = "default";
        disableEditSchool();
      }
    }
  });
  $("#cancelSchoolIcon").click(function() {
    if (schoolEditMode == "edit") {
      schoolEditMode = "default";
      $("#imageUrl").attr("src", SchoolInformation.imageUrl);

      disableEditSchool();
    }
  });

  function GetSchoolInformation() {
    $.ajax(`${baseUrl}/event/${eventId}/School`, {
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

  function PutSchoolInformation(schoolId, datas) {
    $.ajax(`${baseUrl}/event/${eventId}/School/${schoolId}`, {
      data: JSON.stringify(datas),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت ویرایش شد.";
        $("#successNotification").trigger("click");
        schoolEditMode = "default";
        $("#schoolName").text($("#schoolNameInp").val());
        $("#schoolDetail").text($("#schoolDetailInp").val());
        disableEditSchool();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function PutAvatar(schoolId) {
    const datas = new FormData();
    datas.append("file", uploadedFile);
    $.ajax({
      type: "PUT",
      url: `${baseUrl}/event/${eventId}/School/${schoolId}/Image`,
      data: { file: uploadedFile },
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        errorMessage = "تصویر به روز شد.";
        uploadedFile = false;
        $("#successNotification").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "fg";
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
    var nFrom = $(this).attr("data-from");
    var nAlign = $(this).attr("data-align");
    var nIcons = $(this).attr("data-notify-icon");
    var nType = $(this).attr("data-type");
    var nAnimIn = $(this).attr("data-animation-in");
    var nAnimOut = $(this).attr("data-animation-out");
    notify(nFrom, nAlign, nIcons, nType, nAnimIn, nAnimOut);
  });
});
