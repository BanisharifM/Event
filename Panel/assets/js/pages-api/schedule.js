/**
 *
 *  Created by MBD
 *  13/9/1398
 */

$(document).ready(function() {
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
      async: false,
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        if (res.expire < 20) refreshingToken();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        refreshingToken();
      }
    });
  }
  function refreshToken() {
    $.ajax(`${baseUrl}/auth/token/refresh`, {
      data: JSON.stringify({ refresh_token: refreshToken }),
      type: "POST",
      processData: true,
      contentType: "application/json",
      success: function(res) {
        token = res.access_token;
        localStorage.setItem("token", token);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // window.location="signin.html";
      }
    });
  }

  let industry;
  // GetIndustry();
  GetSpeakers();
  GetSchedule();

  let barname, roidad, Allspeakers, programSpeaker;

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
    },
    Speakers: {
      status: false,
      programId: 0,
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
      '" onClick="this.select();" type="text" value="' +
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
      '" onClick="this.select();" type="text" value="' +
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
      '" onClick="this.select();" type="text" value="' +
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
    GetAllProgram();
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
      '" onClick="this.select();" type="text" value="' +
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
      '" onClick="this.select();" type="text" value="' +
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
      '" rows="2" cols="20" onClick="this.select();" type="text" objectId="' +
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
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    programSpeaker = JSON.parse(
      JSON.stringify(barname.find(x => x.id == id).speakers)
    );
    filterNav["Speakers"].programId = id;
    addSpeakerModal(programSpeaker, true);
  }
  function addSpeakerModal(speakers, start) {
    $("#speakerList").empty();
    if (speakers.length != 0)
      for (i in speakers) {
        let speaker = Allspeakers.find(x => x.id == speakers[i]);
        let tr = createClassTr(speaker, "Speaker", true);
        $("#speakerList").append(tr);
        addActionSpeakers("Speaker" + speaker.id);
      }
    if (start) $("#showSpeakers").trigger("click");
  }
  function createClassTr(speaker, type, isToolbar) {
    return (
      '<tr id="tr' +
      type +
      speaker.id +
      '" objectId="' +
      type +
      speaker.id +
      '" >' +
      "<td>" +
      imageUrl(speaker.id, type, speaker.imageUrl) +
      "</td>" +
      "<td>" +
      speakerName(speaker.id, type, speaker.name) +
      "</td>" +
      "<td>" +
      speakerLastName(speaker.id, type, speaker.lastname) +
      "</td>" +
      (!isToolbar ? "" : "<td>" + classtoolbar(speaker.id, type) + "</td>") +
      "</tr>"
    );
  }
  function imageUrl(id, type, src) {
    return (
      '<div id="imageUrl' +
      type +
      id +
      '" >' +
      '<input id="imageUrlInp' +
      type +
      id +
      '" type="file" key="' +
      id +
      '" objectId="' +
      type +
      id +
      '" accept="image/*" style="display: none" />' +
      '<img id="imageUrlImg' +
      type +
      id +
      '" class="rounded-circle" key="' +
      id +
      '" objectId="' +
      type +
      id +
      '" style="width:40px;" src=' +
      src +
      ' alt="تصویر">' +
      "</div>"
    );
  }
  function speakerName(id, type, name) {
    return (
      '<h6 id="speakerName' +
      type +
      id +
      '" class="m-0" objectId="' +
      type +
      id +
      '" > ' +
      name +
      "</h6>"
    );
  }
  function speakerLastName(id, type, lastName) {
    return (
      '<h6 id="speakerLastName' +
      type +
      id +
      '" class="m-0" objectId="' +
      type +
      id +
      '" > ' +
      lastName +
      "</h6>"
    );
  }
  function classtoolbar(id, type) {
    return (
      '<i id="toolbarDelete' +
      type +
      id +
      '" class="fas fa-user-times btn-danger label text-white" objectId="' +
      type +
      id +
      '"></i>'
    );
  }
  function speakerDeleteClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
    programSpeaker.splice(
      programSpeaker.findIndex(x => x == id),
      1
    );
    addSpeakerModal(programSpeaker, false);
  }
  function speakerAddClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    // if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
    programSpeaker = [...programSpeaker, id];
    $("#closeModal2").click();
    addSpeakerModal(programSpeaker, true);
  }
  function addActionSpeakers(objectId) {
    document.getElementById(
      "toolbarDelete" + objectId
    ).onclick = speakerDeleteClick;
  }
  function addActionSpeakerSelected(objectId) {
    document.getElementById("tr" + objectId).onclick = speakerAddClick;
  }
  $("#addSpeaker").click(function() {
    if (programSpeaker.length == Allspeakers.length) {
      alert("همه سخنران ها انتخاب شده اند.");
      return;
    }
    $("#speakerList").empty();
    $("#allSpeakerList").empty();
    for (i in Allspeakers) {
      if (programSpeaker.find(x => x == Allspeakers[i].id)) continue;
      let tr = createClassTr(Allspeakers[i], "Speaker", false);
      $("#allSpeakerList").append(tr);
      addActionSpeakerSelected("Speaker" + Allspeakers[i].id);
    }
    $("#closeModal1").click();
    $("#showAllSpeakers").trigger("click");
  });
  $("#addClassButton").click(function() {
    if (!confirm("آیا مطمئن  هستید ذخیره شود؟")) return;
    let program = barname.find(x => x.id == filterNav["Speakers"].programId);
    data = {
      title: program.title,
      location: program.location,
      text: program.text,
      speakers: programSpeaker
    };
    $("#closeModal1").click();
    PutProgram(data, program.id);
  });
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
  function programEditClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].DEFUALT) {
      pageStatus[type] = states[type].EDIT;
      let recetnTitle = $("#titlePrograms" + id).text();
      $("#titleInpPrograms" + id).val(recetnTitle);
      enableEditProgram(objectId, "edit");
    }
    if (pageStatus[type] == states[type].ADD) {
      pageStatus[type] = states[type].ADDED;
      enableEditProgram(objectId, "add");
    }
  }
  function programDeleteClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].DEFUALT) {
      if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
      DeleteProgram(id);
    }
  }
  function programSaveClick() {
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
      PutProgram(data, recentProgram.id);
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      PostProgram(scheduleId, data);
    }
  }
  function programCancelClick() {
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    if (pageStatus[type] == states[type].EDIT) {
      pageStatus[type] = states[type].DEFUALT;
      disableEditProgram(objectId);
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
      addActionPrograms("Programs0");
      $("#toolbarEditPrograms0").trigger("click");
    }
  });

  function addActionPrograms(objectId) {
    document.getElementById(
      "showSpeaker" + objectId
    ).onclick = showSpeakerlClick;
    document.getElementById(
      "toolbarEdit" + objectId
    ).onclick = programEditClick;
    document.getElementById(
      "toolbarDelete" + objectId
    ).onclick = programDeleteClick;
    document.getElementById(
      "toolbarSave" + objectId
    ).onclick = programSaveClick;
    document.getElementById(
      "toolbarCancel" + objectId
    ).onclick = programCancelClick;
  }
  function enableEditProgram(objectId, mode) {
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
  function disableEditProgram(objectId) {
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

    $("#showSpeaker" + objectId).show();
  }

  function GetSpeakers() {
    $.ajax({
      url: `${baseUrl}/user/speaker`,
      type: "GET",
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        Allspeakers = res;
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
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
        errorMessage = err.msg;
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
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddScheduleDate() {
    $("#CourseList").empty();

    $("#roidadDateList").empty();
    $("#roidadDateList").append(
      '<option value="یبس" disabled selected style="display:none;"></option>'
    );
    $("#roidadTimeList")
      .empty()
      .prop("disabled", true);
    $("#roidadTimeList").append(
      '<option value="یبس" disabled selected style="display:none;"></option>'
    );
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
        roidad[i].start.substring(0, 5) +
          " تا " +
          roidad[i].end.substring(0, 5),
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
        errorMessage = err.msg;
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
        errorMessage = err.msg;
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
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function GetAllProgram() {
    let id = filterNav["ScheduleTime"].industryId;
    $.ajax(`${baseUrl}/schedule/${id}/program`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        barname = res;
        if (barname.length == 0) {
          errorMessage = "درحال حاضر برنامه ای در این محدوده وجود ندارد!";
          $("#warningNotification").trigger("click");
        }
        AddAllPrograms();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddAllPrograms() {
    $("#ProgramsList").empty();
    for (i in barname) {
      let tr = createStaffTr(barname[i], "Programs");
      let id = barname[i].id;
      $("#ProgramsList").append(tr);
      addActionPrograms("Programs" + id);
    }
  }
  function DeleteProgram(programId) {
    let scheduleId = filterNav["ScheduleTime"].industryId;
    $.ajax(`${baseUrl}/schedule/${scheduleId}/program/${programId}`, {
      type: "DELETE",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        barname.splice(
          barname.findIndex(x => x.id == programId),
          1
        );
        AddAllPrograms();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutProgram(data, programId) {
    let scheduleId = filterNav["ScheduleTime"].industryId;
    $.ajax(`${baseUrl}/schedule/${scheduleId}/program/${programId}`, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        pageStatus["Programs"] = states["Programs"].DEFUALT;
        GetAllProgram();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PostProgram(id, Program) {
    $.ajax(`${baseUrl}/schedule/${id}/program`, {
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
        errorMessage = err.msg;
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
