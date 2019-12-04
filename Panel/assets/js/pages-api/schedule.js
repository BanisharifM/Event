/**
 *
 *  Created by MBD
 *  13/9/1398
 */

$(document).ready(function() {
  var starting = true;
  var token = localStorage.getItem("token");
  var refreshToken = localStorage.getItem("refreshToken");
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

  let industry;
  // GetIndustry();
  GetSchedule();

  let barname, roidad;

  let uploadedFile = false;

  const states = {
    Course: {
      DEFUALT: "defualt",
      EDIT: "edit",
      ADD: "add",
      ADDED: "added"
    },
    Programs: {
      DEFUALT: "defualt",
      EDIT: "edit",
      ADD: "add",
      ADDED: "added"
    }
  };
  let pageStatus = {
    Course: states["Course"].DEFUALT,
    Programs: states["Programs"].DEFUALT
  };
  const editCalcoItems = {
    raw: {
      status: false,
      imageUrl: false,
      imageDef: false,
      name: false,
      gradeId: false,
      id: false
    }
  };
  const rawEditItem = {
    status: false,
    imageUrl: false,
    imageDef: false,
    firstName: "",
    text: "",
    nationalId: "",
    title: "",
    phoneNumber: ""
  };

  const rawCourse = {
    id: 0,
    date: "0000-00-00",
    start: "00:00",
    end: "00:00"
  };

  const filterNav = {
    temp: {
      status: false,
      industryName: false,
      industryId: false,
      isFilter: false
    },
    ScheduleTime: {
      status: false,
      industryName: false,
      industryId: false,
      isFilter: false
    }
  };

  const rawProgram = {
    id: 0,
    title: "",
    location: "",
    text: "",
    isActive: true
  };

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
  function industryOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    filterNav[type].industryId = id;
    filterNav[type].industryName = $("#industry" + type + id).attr(
      "industryName"
    );
  }
  function scheduleDateOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    // filterNav[type].industryId = id;
    // filterNav[type].industryName = $("#industry" + type + id).attr(
    //   "industryName"
    // );
    AddScheduleTime($("#industry" + type + id).attr("industryName"));
  }
  function scheduleTimeOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    filterNav["ScheduleTime"].industryId = id;
    filterNav["ScheduleTime"].industryName = $("#industry" + type + id).attr(
      "industryName"
    );
    filterNav["ScheduleTime"].status = true;
  }

  function createCalcoTr(calco, type) {
    return (
      '<tr id="tr' +
      type +
      calco.id +
      '" >' +
      "<td>" +
      date(calco.id, type, calco.date) +
      "</td>" +
      "<td>" +
      timeStart(calco.id, type, calco.start) +
      "</td>" +
      "<td>" +
      timeEnd(calco.id, type, calco.end) +
      "</td>" +
      "<td>" +
      calcoToolbar(calco.id, type) +
      "</td>" +
      "</tr>"
    );
  }

  function date(id, type, detail) {
    return (
      '<span id="date' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" >' +
      detail +
      "</span>" +
      '<input id="dateInp' +
      type +
      id +
      '" type="text" value="' +
      detail +
      '" "objectId="' +
      type +
      id +
      '" style="display:none" > '
    );
  }
  function dateChange() {
    let detail = $(this).val();
    let objectId = $(this).attr("objectId");
  }
  function timeStart(id, type, detail) {
    return (
      '<span id="timeStart' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" >' +
      detail +
      "</span>" +
      '<input id="timeStartInp' +
      type +
      id +
      '" type="text" value="' +
      detail +
      '" "objectId="' +
      type +
      id +
      '" style="display:none" > '
    );
  }
  function timeStartChange() {
    let detail = $(this).val();
    let objectId = $(this).attr("objectId");
  }
  function timeEnd(id, type, detail) {
    return (
      '<span id="timeEnd' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" >' +
      detail +
      "</span>" +
      '<input id="timeEndInp' +
      type +
      id +
      '" type="text" value="' +
      detail +
      '" "objectId="' +
      type +
      id +
      '" style="display:none" > '
    );
  }
  function timeEndChange() {
    let detail = $(this).val();
    let objectId = $(this).attr("objectId");
  }

  function calcoToolbar(id, type) {
    return (
      '<i id="toolbarEdit' +
      type +
      id +
      '" class="fas fa-edit btn-primary label text-white" objectId="' +
      type +
      id +
      '"></i>' +
      '<i id="toolbarDelete' +
      type +
      id +
      '" class="fas fa-trash-alt btn-danger label text-white" objectId="' +
      type +
      id +
      '"></i>' +
      '<i id="toolbarSave' +
      type +
      id +
      '" class="fas fa-check-circle theme-bg btn- label text-white" objectId="' +
      type +
      id +
      '" style="display:none"></i>' +
      '<i id="toolbarCancel' +
      type +
      id +
      '" class="fas fa-times-circle btn-danger label text-white" objectId="' +
      type +
      id +
      '" style="display:none"></i>'
    );
  }
  function calcoEditClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");

    if (pageStatus[type] == states[type].DEFUALT) {
      pageStatus[type] = states[type].EDIT;
      editCalcoItems[objectId].status = true;
      editCalcoItems[objectId].id = id;
      enableEditCalco(objectId);
      $("#informationInp" + objectId).val($("#FirstName" + objectId).text());
      if (type == "Course")
        editCalcoItems[objectId].imageDef = $("#imageUrlImg" + objectId).attr(
          "src"
        );
    }
    if (pageStatus[type] == states[type].ADD) {
      pageStatus[type] = states[type].ADDED;
      let objectId = $(this).attr("objectId");
      editCalcoItems[objectId].status = true;
      enableEditCalco(objectId);
    }
  }
  function calcoDeleteClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].DEFUALT) {
      if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
      if (type == "Course") {
        DeleteCourse(id);
      }
    }
  }
  function calcoSaveClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    data = {
      date: $("#dateInp" + objectId).val(),
      start: $("#timeStartInp" + objectId)
        .val()
        .substring(0, 5),
      end: $("#timeEndInp" + objectId)
        .val()
        .substring(0, 5),
      programs: []
    };

    if (pageStatus[type] == states[type].EDIT) {
      pageStatus[type] = states[type].DEFUALT;
      if (type == "Course") {
        PutCourse(data, id);
      }
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      if (type == "Course") {
        PostCourse(data);
      }
    }
  }
  function calcoCancelClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].EDIT) {
      pageStatus[type] = states[type].DEFUALT;
      if (type == "Course")
        $("#imageUrlImg" + objectId).attr(
          "src",
          editCalcoItems[objectId].imageDef
        );
      disableEditCalco(objectId);
      editCalcoItems[objectId] = JSON.parse(JSON.stringify(editCalcoItems.raw));
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      $("#tr" + objectId).remove();
      editCalcoItems[objectId] = JSON.parse(JSON.stringify(editCalcoItems.raw));
    }
  }

  $("#addCourse").click(function() {
    if (pageStatus["Course"] == states["Course"].DEFUALT) {
      pageStatus["Course"] = states["Course"].ADD;
      let tr = createCalcoTr(rawCourse, "Course");
      editCalcoItems["Course0"] = JSON.parse(JSON.stringify(rawCourse));
      $("#CourseList").append(tr);
      addActionCalco("Course0");
      $("#toolbarEditCourse0").trigger("click");
    }
  });

  function addActionCalco(objectId) {
    document.getElementById("dateInp" + objectId).onchange = dateChange;
    document.getElementById(
      "timeStartInp" + objectId
    ).onchange = timeStartChange;
    document.getElementById("timeEndInp" + objectId).onchange = timeEndChange;
    document.getElementById("toolbarEdit" + objectId).onclick = calcoEditClick;
    document.getElementById(
      "toolbarDelete" + objectId
    ).onclick = calcoDeleteClick;
    document.getElementById("toolbarSave" + objectId).onclick = calcoSaveClick;
    document.getElementById(
      "toolbarCancel" + objectId
    ).onclick = calcoCancelClick;
  }
  function enableEditCalco(objectId) {
    $("#toolbarEdit" + objectId).hide();
    $("#toolbarSave" + objectId).show();

    $("#toolbarDelete" + objectId).hide();
    $("#toolbarCancel" + objectId).show();

    $("#date" + objectId).hide();
    $("#dateInp" + objectId).show();

    $("#timeStart" + objectId).hide();
    $("#timeStartInp" + objectId).show();

    $("#timeEnd" + objectId).hide();
    $("#timeEndInp" + objectId).show();
  }
  function disableEditCalco(objectId) {
    $("#toolbarEdit" + objectId).show();
    $("#toolbarSave" + objectId).hide();

    $("#toolbarDelete" + objectId).show();
    $("#toolbarCancel" + objectId).hide();

    $("#date" + objectId).show();
    $("#dateInp" + objectId).hide();

    $("#timeStart" + objectId).show();
    $("#timeStartInp" + objectId).hide();

    $("#timeEnd" + objectId).show();
    $("#timeEndInp" + objectId).hide();
  }

  $("#ScheduleListFilter").click(function() {
    if (filterNav["ScheduleTime"].status == false) return;
    filterNav["ScheduleTime"].isFilter = true;
    let id = filterNav["ScheduleTime"].industryId;
    GetAllprograms(id);
  });

  function createStaffTr(program, type) {
    return (
      '<tr id="tr' +
      type +
      program.id +
      '" >' +
      "<td>" +
      title(program.id, type, program.title) +
      "</td>" +
      "<td>" +
      location(program.id, type, program.location) +
      "</td>" +
      "<td>" +
      detail(program.id, type, program.text) +
      "</td>" +
      "<td>" +
      showSpeaker(program.id, type) +
      "</td>" +
      "<td>" +
      toolbar(program.id, type) +
      "</td>" +
      "</tr>"
    );
  }
  function title(id, type, title) {
    return (
      '<h6 id="title' +
      type +
      id +
      '" class="m-0" objectId="' +
      type +
      id +
      '" > ' +
      title +
      "</h6>" +
      '<input id="titleInp' +
      type +
      id +
      '" type="text" value="' +
      title +
      '" objectId="' +
      type +
      id +
      '" style="display:none" >'
    );
  }
  function location(id, type, location) {
    return (
      '<h6 id="location' +
      type +
      id +
      '" class="m-0" objectId="' +
      type +
      id +
      '" > ' +
      location +
      "</h6>" +
      '<input id="locationInp' +
      type +
      id +
      '" type="text" value="' +
      location +
      '" objectId="' +
      type +
      id +
      '" style="display:none" >'
    );
  }
  function detail(id, type, detail) {
    return (
      '<span id="informationText' +
      type +
      id +
      '" class="text-c-green" objectId="' +
      type +
      id +
      '" >' +
      detail +
      "</span>" +
      '<textarea id="informationTextInp' +
      type +
      id +
      '" rows="2" cols="20" type="text" objectId="' +
      type +
      id +
      '" style="display:none" >' +
      detail +
      "</textarea>"
    );
  }
  function showSpeaker(id, type) {
    return (
      '<p id="showSpeaker' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" key="' +
      id +
      ' "class="theme-bg2 label text-white btn- " style="width:max-content;" >مشاهده</p>'
    );
  }
  function showSpeakerlClick() {
    let id = $(this).attr("key");
    let teacher = staffs.find(teacher => teacher.id == id);
    GetStaffClass(teacher.id);
    filterNav["ScheduleTime"].staffId = teacher.id;
  }
  function toolbar(id, type) {
    return (
      '<i id="toolbarEdit' +
      type +
      id +
      '" class="fas fa-edit btn-primary label text-white" objectId="' +
      type +
      id +
      '"></i>' +
      '<i id="toolbarDelete' +
      type +
      id +
      '" class="fas fa-trash-alt btn-danger label text-white" objectId="' +
      type +
      id +
      '"></i>' +
      '<i id="toolbarSave' +
      type +
      id +
      '" class="fas fa-check-circle theme-bg btn- label text-white" objectId="' +
      type +
      id +
      '" style="display:none"></i>' +
      '<i id="toolbarCancel' +
      type +
      id +
      '" class="fas fa-times-circle btn-danger label text-white" objectId="' +
      type +
      id +
      '" style="display:none"></i>'
    );
  }
  function personEditClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].DEFUALT) {
      pageStatus[type] = states[type].EDIT;
      let recetnTitle = $("#titlePrograms" + id).text();
      $("#titleInpPrograms" + id).val(recetnTitle);
      enableEditPerson(objectId, "edit");
    }
    if (pageStatus[type] == states[type].ADD) {
      pageStatus[type] = states[type].ADDED;
      enableEditPerson(objectId, "add");
    }
  }
  function personDeleteClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].DEFUALT) {
      if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
      DeleteProgram(id);
    }
  }
  function personSaveClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    let scheduleId = filterNav["ScheduleTime"].industryId;
    data = {
      title: $("#titleInpPrograms" + id).val(),
      location: $("#locationInpPrograms" + id).val(),
      text: $("#informationTextInpPrograms" + id).val(),
      speakers: []
    };

    if (pageStatus[type] == states[type].EDIT) {
      recentProgram = barname.find(x => x.id == id);
      PutAllProgram(data, recentProgram.id);
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      PostProgram(scheduleId, date);
    }
  }
  function personCancelClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].EDIT) {
      pageStatus[type] = states[type].DEFUALT;
      disableEditPerson(objectId);
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      $("#tr" + objectId).remove();
    }
  }

  $("#addPrograms").click(function() {
    if (
      pageStatus["Programs"] == states["Programs"].DEFUALT &&
      filterNav["ScheduleTime"].isFilter
    ) {
      pageStatus["Programs"] = states["Programs"].ADD;
      let tr = createStaffTr(rawProgram, "Programs");
      $("#ProgramsList").append(tr);
      addActionPersons("Programs0");
      $("#toolbarEditPrograms0").trigger("click");
    }
  });

  function addActionPersons(objectId) {
    document.getElementById(
      "showSpeaker" + objectId
    ).onclick = showSpeakerlClick;
    document.getElementById("toolbarEdit" + objectId).onclick = personEditClick;
    document.getElementById(
      "toolbarDelete" + objectId
    ).onclick = personDeleteClick;
    document.getElementById("toolbarSave" + objectId).onclick = personSaveClick;
    document.getElementById(
      "toolbarCancel" + objectId
    ).onclick = personCancelClick;
  }
  function enableEditPerson(objectId, mode) {
    $("#toolbarEdit" + objectId).hide();
    $("#toolbarSave" + objectId).show();

    $("#toolbarDelete" + objectId).hide();
    $("#toolbarCancel" + objectId).show();

    $("#title" + objectId).hide();
    $("#titleInp" + objectId).show();

    $("#location" + objectId).hide();
    $("#locationInp" + objectId).show();

    $("#informationText" + objectId).hide();
    $("#informationTextInp" + objectId).show();

    $("#showSpeaker" + objectId).hide();
  }
  function disableEditPerson(objectId) {
    $("#toolbarEdit" + objectId).show();
    $("#toolbarSave" + objectId).hide();

    $("#toolbarDelete" + objectId).show();
    $("#toolbarCancel" + objectId).hide();

    $("#title" + objectId).show();
    $("#titleInp" + objectId).hide();

    $("#location" + objectId).show();
    $("#locationInp" + objectId).hide();

    $("#informationText" + objectId).show();
    $("#informationTextInp" + objectId).hide();
  }

  function GetIndustry() {
    $.ajax(`${baseUrl}/industry`, {
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
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddIndustry() {
    for (i in industry) {
      let id = industry[i].id;

      let ProgramsOpt = createIndustryOpt(id, industry[i].name, "Programs");
      $("#industryProgramsList").append(ProgramsOpt);
      document.getElementById(
        "industyProgramsList"
      ).onchange = industryOptClick;
    }
  }
  function GetSchedule() {
    $.ajax({
      url: `${baseUrl}/schedule`,
      type: "GET",
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        roidad = res;
        AddScheduleDate();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddScheduleDate() {
    $("#CourseList").empty();
    let roidad2 = [];
    for (i in roidad) {
      //first tab -> زمان های رویداد
      let tr = createCalcoTr(roidad[i], "Course");
      let id = roidad[i].id;
      editCalcoItems["Course" + id] = JSON.parse(
        JSON.stringify(editCalcoItems.raw)
      );
      $("#CourseList").append(tr);
      addActionCalco("Course" + id);

      //second tab -> برنامه های رویداد

      if (roidad2.includes(roidad[i].date)) {
        continue;
      } else roidad2 = [...roidad2, roidad[i].date];
      let ScheduleOpt = createIndustryOpt(id, roidad[i].date, "ScheduleDate");
      $("#roidadDateList").append(ScheduleOpt);
      document.getElementById("roidadDateList").onchange = scheduleDateOptClick;
    }
  }
  function AddScheduleTime(roidadDate) {
    $("#roidadTimeList")
      .empty()
      .prop("disabled", false);
    $("#roidadTimeList").append(
      '<option value="یبس" disabled selected style="display:none;"></option>'
    );
    for (i in roidad) {
      if (roidad[i].date != roidadDate) continue;
      let opt = createIndustryOpt(
        roidad[i].id,
        roidad[i].end.substring(0, 5) +
          " تا " +
          roidad[i].start.substring(0, 5),
        "ScheduleTime"
      );
      $("#roidadTimeList").append(opt);
      document.getElementById("roidadTimeList").onchange = scheduleTimeOptClick;
    }
  }
  function DeleteCourse(courseId) {
    $.ajax(`${baseUrl}/schedule/${courseId}`, {
      type: "DELETE",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetSchedule();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutCourse(data, id) {
    $.ajax(`${baseUrl}/schedule/` + id, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetSchedule();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PostCourse(data, id) {
    $.ajax(`${baseUrl}/schedule`, {
      data: JSON.stringify(data),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetSchedule(data.schoolGradeId);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function GetAllprograms(id) {
    $.ajax(`${baseUrl}/schedule/${id}/program`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        barname = res;
        AddAllPrograms();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddAllPrograms() {
    $("#ProgramsList").empty();
    for (i in barname) {
      let tr = createStaffTr(barname[i], "Program");
      let id = barname[i].id;
      $("#ProgramsList").append(tr);
      //   addActionPersons("Program" + id);
    }
  }
  function DeleteProgram(userId) {
    $.ajax(`${baseUrl}/User/${userId}`, {
      data: JSON.stringify({ enable: true }),
      type: "DELETE",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        AddAllPrograms();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutAllProgram(data, id) {
    $.ajax(`${baseUrl}/user/Program/` + id, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        pageStatus[type] = states[type].DEFUALT;
        GetAllProgram();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PostProgram(id, Program) {
    $.ajax(`${baseUrl}/schedule/${id}/program/`, {
      data: JSON.stringify(Program),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetAllProgram();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.Message;
        $("#errorNotification").trigger("click");
        GetAllProgram();
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
