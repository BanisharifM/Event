/**
 *
 *  Created by MBD
 *  14/9/1398
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

  let Students,
    darsha,
    allSpeaker,
    recentPageStudents = 1,
    recentPageSpeakers = 1,
    userObj,
    speakerObj,
    modalType,
    recentUser,
    recentIndustry;

  let uploadedFile = false;

  const states = {
    Classes: {
      DEFUALT: "defualt",
      EDIT: "edit",
      ADD: "add",
      ADDED: "added"
    },
    Students: {
      DEFUALT: "defualt",
      EDIT: "edit",
      ADD: "add",
      ADDED: "added"
    }
  };
  let pageStatus = {
    Classes: states["Classes"].DEFUALT,
    Students: states["Students"].DEFUALT
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
  const editItems = {};

  const rawCourse = {
    id: 0,
    gradeName: "",
    name: "",
    imageUrl: "",
    teachers: [],
    isEnable: true,
    sampleQuestion: [],
    gradeId: 0
  };

  const filterNav = {
    temp: {
      status: false,
      industryName: false,
      industryId: false,
      isFilter: false
    },
    Students: {
      status: false,
      industryName: false,
      industryId: 0,
      isModal: false,
      isFilter: false,
      people: {}
    },
    Speakers: {
      status: false,
      industryName: false,
      industryId: 0,
      isModal: false,
      isFilter: false,
      people: {}
    }
  };
  const rawStudent = {
    status: false,
    industryName: false,
    industryId: 0,
    isModal: false,
    isFilter: false,
    people: {}
  };
  const rawUser = {
    name: "",
    lastname: "",
    imageUrl: "http://pghavin-s1.ir/events/files/da1.jpg",
    industryId: "",
    valid: false,
    speaker: false,
    editable: true,
    mobile: "",
    bio: "",
    gender: male
  };
  GetAllSpeaker();
  let industry;
  GetIndustry();

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
    filterNav[type].status = true;
  }

  function createCalcoTr(calco, type, industryName, gradeName, gradeId) {
    return (
      '<tr id="tr' +
      type +
      calco.id +
      '" >' +
      "<td>" +
      calcoImageUrl(calco.id, type, calco.imageUrl) +
      "</td>" +
      "<td>" +
      calcoInformation(calco.id, type, calco.name, gradeId) +
      "</td>" +
      '<td><span id="nationalId' +
      type +
      calco.id +
      '" class="pie_1" objectId="' +
      type +
      calco.id +
      '" > ' +
      industryName +
      "</span></td>" +
      '<td><h6 id="title' +
      type +
      calco.id +
      '" class="m-0" objectId="' +
      type +
      calco.id +
      '" > ' +
      gradeName +
      "</h6></td>" +
      "<td>" +
      calcoToolbar(calco.id, type) +
      "</td>" +
      "</tr>"
    );
  }

  function calcoImageUrl(id, type, src) {
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
  let CourseSelectImage;
  function calcoImageUrlChange() {
    CourseSelectImage = event.target.files[0];
    let objectId = $(this).attr("objectId");
    editCalcoItems[objectId].imageUrl = CourseSelectImage;
    $("#imageUrlImg" + objectId).attr(
      "src",
      URL.createObjectURL(CourseSelectImage)
    );
  }

  function calcoInformation(id, type, name, gradeId) {
    return (
      '<h6 id="FirstName' +
      type +
      id +
      '" class="mb-1" objectId="' +
      type +
      id +
      '" >' +
      name +
      "</h6>" +
      '<input id="informationInp' +
      type +
      id +
      '" type="text" value="' +
      name +
      '" gradeId="' +
      gradeId +
      '"objectId="' +
      type +
      id +
      '" style="display:none" > '
    );
  }
  function calcoFirstNameChange() {
    let name = $(this).val();
    let objectId = $(this).attr("objectId");
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    let gradeId = $(this).attr("gradeId");
    editCalcoItems[objectId].name = name;
    // editCalcoItems[objectId].id=id;
    editCalcoItems[objectId].gradeId = gradeId;
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
    if (pageStatus[type] == states[type].EDIT) {
      pageStatus[type] = states[type].DEFUALT;

      if (type == "Course" && editCalcoItems[objectId].imageUrl != false)
        PutCourseImage(id);

      let gradeId = filterNav[type].gradeId;
      data = {
        name: $("#informationInp" + objectId).val(),
        schoolGradeId: gradeId
      };
      if (type == "Course") {
        PutCourse(data, editCalcoItems[objectId].id);
      }

      editCalcoItems[objectId] = JSON.parse(JSON.stringify(editCalcoItems.raw));
    }
    if (pageStatus[type] == states[type].ADDED) {
      pageStatus[type] = states[type].DEFUALT;
      data = {
        name: editCalcoItems[objectId].name,
        schoolGradeId: filterNav[type].gradeId
      };
      if (type == "Course") {
        PostCourse(data, editCalcoItems[objectId].id);
      }
      editCalcoItems[objectId] = JSON.parse(JSON.stringify(editCalcoItems.raw));
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
    if (
      pageStatus["Course"] == states["Course"].DEFUALT &&
      filterNav["Course"].isFilter
    ) {
      pageStatus["Course"] = states["Course"].ADD;
      let tr = createCalcoTr(
        rawCourse,
        "Course",
        filterNav["Course"].industryName,
        filterNav["Course"].gradeName,
        filterNav["Course"].gradeId
      );
      editCalcoItems["Course0"] = JSON.parse(JSON.stringify(rawCourse));
      $("#CourseList").append(tr);
      addActionCalco("Course0");
      $("#toolbarEditCourse0").trigger("click");
    }
  });

  function addActionCalco(objectId) {
    if (objectId.includes("Course")) {
      document
        .getElementById("imageUrl" + objectId)
        .addEventListener("click", () => {
          if (editCalcoItems[objectId].status === true) {
            document.getElementById("imageUrlInp" + objectId).click();
          }
        });
      document.getElementById(
        "imageUrlInp" + objectId
      ).onchange = calcoImageUrlChange;
    }
    document.getElementById(
      "informationInp" + objectId
    ).onchange = calcoFirstNameChange;
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

    $("#FirstName" + objectId).hide();
    $("#informationInp" + objectId).show();
  }
  function disableEditCalco(objectId) {
    $("#toolbarEdit" + objectId).show();
    $("#toolbarSave" + objectId).hide();

    $("#toolbarDelete" + objectId).show();
    $("#toolbarCancel" + objectId).hide();

    $("#FirstName" + objectId).show();
    $("#informationInp" + objectId).hide();
  }

  $("#StudentsListFilter").click(function() {
    if (filterNav["Students"].status == false) return;
    recentIndustry = filterNav["Students"].industryId;
    filterNav["Students"].isFilter = true;
    recentPageStudents = 1;
    GetAllStudent();
  });

  function createStaffTr(person, type) {
    return (
      '<tr id="tr' +
      type +
      person.id +
      '" >' +
      "<td>" +
      imageUrl(person.id, type, person.imageUrl) +
      "</td>" +
      "<td>" +
      information(person.id, type, person.name, person.lastname) +
      "</td>" +
      "<td>" +
      phoneNumber(person.id, type, person.mobile) +
      "</td>" +
      //   "<td>" +
      //   detail(person.id, type, person.valid, person.speaker) +
      //   "</td>" +
      "<td>" +
      imageStatus(person.id, type, person.valid, person.speaker) +
      "</td>" +
      "<td>" +
      showSpeaker(person.id, type) +
      "</td>" +
      "</tr>"
    );
  }
  function imageUrl(id, type, src) {
    return (
      '<div id="imageUrl' +
      type +
      id +
      '" >' +
      '<img id="imageUrlImg' +
      type +
      id +
      '" class="rounded-circle" key="' +
      id +
      '" objectId="' +
      type +
      id +
      '" style="width:50px;height:50px;" src="' +
      src +
      '" alt="تصویر">' +
      "</div>"
    );
  }
  function information(id, type, firstName, lastName) {
    return (
      '<h6 id="FirstName' +
      type +
      id +
      '" class="mb-1" objectId="' +
      type +
      id +
      '" >' +
      firstName +
      "</h6>" +
      '<input id="FirstInp' +
      type +
      id +
      '" type="text" value="' +
      firstName +
      '" objectId="' +
      type +
      id +
      '" style="display:none" > ' +
      '<h6 id="informationLastName' +
      type +
      id +
      '" class="mb-1" objectId="' +
      type +
      id +
      '" >' +
      lastName +
      "</h6>" +
      '<input id="informationLastInp' +
      type +
      id +
      '" type="text" value="' +
      lastName +
      '" objectId="' +
      type +
      id +
      '" style="display:none" > '
    );
  }
  function phoneNumber(id, type, phoneNumber) {
    return (
      '<h6 id="phoneNumber' +
      type +
      id +
      '" class="m-0" dir="ltr" objectId="' +
      type +
      id +
      '" > 0' +
      phoneNumber +
      "</h6>" +
      '<input id="phoneNumberInp' +
      type +
      id +
      '" type="text" dir="ltr" value="0' +
      phoneNumber +
      '" objectId="' +
      type +
      id +
      '" style="display:none" >'
    );
  }
  function showSpeaker(id, type) {
    return (
      '<p id="show' +
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
    let type = objectId.replace(id, "");
    getUser(id, type);
  }
  function prepareModal(people, type) {
    pageStatus["Students"] = states["Students"].DEFUALT;
    disableEditPerson();
    $("#userImage").attr("src", people.imageUrl);
    !people.valid
      ? $("#validImage")
          .hide()
          .attr("src", "../assets/images/user/notValid.png")
      : $("#validImage")
          .show()
          .attr("src", "../assets/images/user/valid.png");

    !people.speaker
      ? $("#speakerImage")
          .hide()
          .attr("src", "../assets/images/user/notSpeaker.png")
      : $("#speakerImage")
          .show()
          .attr("src", "../assets/images/user/speaker.png");
    $("#userImage").attr("src", people.imageUrl);
    $("#userFirstName").text(people.name);
    $("#userLastName").text(people.lastname);
    $("#userMobile").text(people.mobile);
    $("#userBio")
      .val(people.bio)
      .prop("disabled", true);
    people.gender
      ? $("#genderList")
          .val("male")
          .prop("disabled", true)
      : $("#genderList")
          .val("female")
          .prop("disabled", true);

    let indust = industry.find(x => x.id == people.industryId).id;
    $("#industryList")
      .val("Modal" + indust)
      .prop("disabled", true);

    people.editable ? $("#deleteTitution").show() : null;
    $("#showStudentsDetail").trigger("click");
  }
  function imageStatus(id, type, valid, speaker) {
    return (
      '<div id="imageStatus' +
      type +
      id +
      '" >' +
      (!valid
        ? ""
        : '<img id="imageValid' +
          type +
          id +
          '" class="rounded-circle" key="' +
          id +
          '" objectId="' +
          type +
          id +
          '" style="width:20px;" src="../assets/images/user/valid.png" ' +
          'alt="تصویر">') +
      (!speaker
        ? ""
        : '<img id="imageSpeaker' +
          type +
          id +
          '" class="rounded-circle" key="' +
          id +
          '" objectId="' +
          type +
          id +
          '" style="width:20px;" src="../assets/images/user/speaker.png" ' +
          'alt="تصویر">') +
      "</div>"
    );
  }
  $("#editTitution").click(function() {
    pageStatus["Students"] = states["Students"].EDIT;
    enableEditPerson();
  });
  $("#deleteTitution").click(function() {
    let valid = filterNav[modalType].people.valid;
    let speaker = filterNav[modalType].people.speaker;
    let id = filterNav[modalType].people.id;

    if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
    if (modalType == "Students") DeleteStudent(id, Students, "Students");
    if (modalType == "Speakrs") DeleteStudent(id, allSpeaker, "Speakers");
  });
  $("#closeModal").click(function() {
    pageStatus["Students"] = states["Students"].DEFUALT;
    filterNav["Students"] = JSON.parse(JSON.stringify(rawStudent));
    disableEditPerson();
  });
  $("#saveTitution").click(function() {
    let valid = filterNav[modalType].people.valid;
    let speaker = filterNav[modalType].people.speaker;
    let id = filterNav[modalType].people.id;

    let industryObject = $("#industryList").val();
    let industryId = industryObject.match(/\d+/)[0];

    if (recentUser.valid != valid) PutSetValid(id, valid);
    if (recentUser.speaker != speaker) PutSetSpeaker(id, speaker);
    data = {
      name: recentUser.editable
        ? $("#userFirstNameInp").val()
        : recentUser.name,
      lastname: recentUser.editable
        ? $("#userLastNameInp").val()
        : recentUser.lastname,
      imageUrl: recentUser.imageUrl,
      industryId: industryId,
      mobile: recentUser.editable
        ? $("#userMobileInp").val()
        : recentUser.mobile,
      bio: $("#userBio").val(),
      gender: $("#genderList").val() == "male" ? true : false
    };
    if (!recentUser.editable) {
    }
    addImageMode ? PutImage(data, id) : PutAllStudent(data, id);
  });
  $("#validImage").click(function() {
    if (pageStatus["Students"] == states["Students"].DEFUALT) return;
    let userValid = filterNav[modalType].people.valid;
    let userSpeaker = filterNav[modalType].people.speaker;
    if (userValid) {
      if (!userSpeaker) {
        filterNav[modalType].people.valid = false;
        $("#validImage").attr("src", "../assets/images/user/notValid.png");
      }
    } else {
      filterNav[modalType].people.valid = true;
      $("#validImage").attr("src", "../assets/images/user/valid.png");
    }
  });
  $("#speakerImage").click(function() {
    if (pageStatus["Students"] == states["Students"].DEFUALT) return;
    let userValid = filterNav[modalType].people.valid;
    let userSpeaker = filterNav[modalType].people.speaker;
    if (!userSpeaker) {
      if (userValid) {
        filterNav[modalType].people.speaker = true;
        $("#speakerImage").attr("src", "../assets/images/user/speaker.png");
      }
    } else {
      filterNav[modalType].people.speaker = false;
      $("#speakerImage").attr("src", "../assets/images/user/notSpeaker.png");
    }
  });

  let uploadedImage;
  let addImageMode = false;
  document.getElementById("userImage").addEventListener("click", () => {
    if (pageStatus["Students"] == states["Students"].EDIT)
      document.getElementById("userImageInp").click();
  });
  document.getElementById("userImageInp").onchange = ImageChange;
  function ImageChange() {
    uploadedImage = event.target.files[0];
    $("#userImage").attr("src", URL.createObjectURL(uploadedImage));
    addImageMode = true;
  }

  function PutSetValid(id, valid) {
    $.ajax(`${baseUrl}/user/${id}/valid?value=${valid}`, {
      // data: JSON.stringify({ value: speaker }),
      type: "PUT",
      async: false,
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "وضعیت عضو تایید شده کاربر تغییر یافت .";
        $("#successNotification").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutSetSpeaker(id, speaker) {
    alert("msg");
    $.ajax(`${baseUrl}/user/${id}/speaker?value=${speaker}`, {
      // data: JSON.stringify({ value: speaker }),
      async: false,
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "وضعیت سخنران کاربر تغییر یافت .";
        $("#successNotification").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutImage(data, id) {
    errorMessage = "تا آپلود شدن تصویر منتظر بمانید !";
    $("#warningNotification").trigger("click");
    let fileType = uploadedImage.type;
    let suffix = fileType.substring(fileType.indexOf("/") + 1);
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
        addImageMode = false;
        uploadedImage = null;
        data.imageUrl = res.url;
        PutAllStudent(data, id);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "عکس آپلود نشد!";
        $("#errorNotification").trigger("click");
        return false;
      }
    });
  }

  $("#addStudents").click(function() {
    if (
      pageStatus["Students"] == states["Students"].DEFUALT &&
      filterNav["Students"].isFilter
    ) {
      pageStatus["Students"] = states["Students"].ADD;
      let tr = createStaffTr(rawStudent, "Students");
      editItems["Students0"] = JSON.parse(JSON.stringify(rawEditItem));
      $("#StudentsList").append(tr);
      //   addActionPersons("Students0");
      $("#toolbarEditStudents0").trigger("click");
    }
  });
  $("#firstPageStudents").click(function() {
    recentPageStudents = 1;
    checkIconVisiblility("Students");
    GetAllStudent();
  });
  $("#previosPageStudents").click(function() {
    recentPageStudents--;
    checkIconVisiblility("Students");
    GetAllStudent();
  });
  $("#nextPageStudents").click(function() {
    recentPageStudents++;
    checkIconVisiblility("Students");
    GetAllStudent();
  });
  $("#lastPageStudents").click(function() {
    recentPageStudents = userObj.totalPage;
    checkIconVisiblility("Students");
    GetAllStudent();
  });
  $("#firstPageSpeakers").click(function() {
    recentPageSpeakers = 1;
    checkIconVisiblility("Speakers");
    GetAllSpeaker();
  });
  $("#previosPageSpeakers").click(function() {
    recentPageSpeakers--;
    checkIconVisiblility("Speakers");
    GetAllSpeaker();
  });
  $("#nextPageSpeakers").click(function() {
    recentPageSpeakers++;
    checkIconVisiblility("Speakers");
    GetAllSpeaker();
  });
  $("#lastPageSpeakers").click(function() {
    recentPageSpeakers = speakerObj.totalPage;
    checkIconVisiblility("Speakers");
    GetAllSpeaker();
  });
  function checkIconVisiblility(type) {
    let obj;
    if (type == "Students") obj = userObj;
    else obj = speakerObj;

    $("#recentPage" + type).text(obj.pageNumber + " / ");
    $("#totalPage" + type).text(obj.totalPage);

    if (obj.pageNumber > 1) {
      $("#firstPage" + type).css("visibility", "visible");
      $("#previosPage" + type).css("visibility", "visible");
    } else {
      $("#firstPage" + type).css("visibility", "hidden");
      $("#previosPage" + type).css("visibility", "hidden");
    }

    if (obj.pageNumber - 1 <= 1)
      $("#firstPage" + type).css("visibility", "hidden");

    if (obj.pageNumber < obj.totalPage) {
      $("#lastPage" + type).css("visibility", "visible");
      $("#nextPage" + type).css("visibility", "visible");
    } else {
      $("#lastPage" + type).css("visibility", "hidden");
      $("#nextPage" + type).css("visibility", "hidden");
    }
    if (obj.pageNumber + 1 >= obj.totalPage)
      $("#lastPage" + type).css("visibility", "hidden");
  }
  function addActionPersons(objectId, editable) {
    document.getElementById("show" + objectId).onclick = showSpeakerlClick;
  }
  function enableEditPerson(objectId, mode) {
    if (filterNav[modalType].people.editable) {
      $("#userFirstName").hide();
      $("#userFirstNameInp")
        .show()
        .val($("#userFirstName").text());

      $("#userLastName").hide();
      $("#userLastNameInp")
        .show()
        .val($("#userLastName").text());

      $("#userMobile").hide();
      $("#userMobileInp")
        .show()
        .val(
          $("#userMobile")
            .hide()
            .text()
        );
    }

    $("#userBio")
      .prop("disabled", false)
      .css("background", "#f4f7fa");
    $("#genderList").prop("disabled", false);
    $("#industryList").prop("disabled", false);
    $("#validImage").show();
    $("#speakerImage").show();

    $("#saveTitution").show();
    $("#editTitution").hide();

    // $("#showClass" + objectId).hide();

    // if (mode == "add") {
    //   $("#FirstName" + objectId).hide();
    //   $("#FirstInp" + objectId).show();

    //   $("#informationLastName" + objectId).hide();
    //   $("#informationLastInp" + objectId).show();

    //   $("#nationalId" + objectId).hide();
    //   $("#nationalIdInp" + objectId).show();
    // }
  }
  function disableEditPerson(objectId) {
    $("#userFirstName").show();
    $("#userFirstNameInp").hide();

    $("#userLastName").show();
    $("#userLastNameInp").hide();

    $("#userMobile").show();
    $("#userMobileInp").hide();

    $("#userBio")
      .prop("disabled", true)
      .css("background", "#e9ecef");
    $("#genderList").prop("disabled", true);
    $("#industryList").prop("disabled", true);
    $("#validImage").show();
    $("#speakerImage").show();

    $("#saveTitution").hide();
    $("#editTitution").show();

    $("#deleteTitution").hide();
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

      let StudentsOpt = createIndustryOpt(id, industry[i].name, "Students");
      $("#industryStudentsList").append(StudentsOpt);
      document.getElementById(
        "industryStudentsList"
      ).onchange = industryOptClick;

      let modalIndustryOpt = createIndustryOpt(id, industry[i].name, "Modal");
      $("#industryList").append(modalIndustryOpt);
    }
  }
  function GetCourse(gradeId) {
    $.ajax({
      url: `${baseUrl}/Course`,
      data: { gradeId: gradeId },
      type: "GET",
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        darsha = res;
        AddCourse();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddCourse() {
    $("#CourseList").empty();
    for (i in darsha) {
      if (darsha[i].enable == true) continue;
      let tr = createCalcoTr(
        darsha[i],
        "Course",
        filterNav["Course"].industryName,
        filterNav["Course"].gradeName,
        filterNav["Course"].gradeId
      );
      let id = darsha[i].id;
      editCalcoItems["Course" + id] = JSON.parse(
        JSON.stringify(editCalcoItems.raw)
      );
      $("#CourseList").append(tr);
      addActionCalco("Course" + id);
    }
  }
  function DeleteCourse(courseId) {
    $.ajax(`${baseUrl}/Course/${courseId}`, {
      type: "DELETE",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetCourse(filterNav["Course"].gradeId);
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
    $.ajax(`${baseUrl}/Course/` + id, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetCourse(filterNav["Course"].gradeId);
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
    $.ajax(`${baseUrl}/Course`, {
      data: JSON.stringify(data),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        GetCourse(data.schoolGradeId);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutCourseImage(id) {
    const datas = new FormData();
    datas.append("file", CourseSelectImage);
    $.ajax({
      type: "PUT",
      url: `${baseUrl}/Course/${id}/Image`,
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        errorMessage = "تصویر به روز شد.";
        $("#successNotification").trigger("click");
        GetCourse(filterNav["Course"].gradeId);
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "fg";
        $("#errorNotification").trigger("click");
      }
    });
  }
  function GetAllStudent() {
    let classId = filterNav["Students"].industryId;
    $.ajax(`${baseUrl}/user/`, {
      data: { industry: recentIndustry, page: recentPageStudents },
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        userObj = res;
        Students = res.values;
        if (Students.length == 0) {
          errorMessage = "درحال حاضر شرکت کننده ای در این حوزه وجود ندارد!";
          $("#warningNotification").trigger("click");
        }
        AddAllStudents(Students, "Students");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function GetAllSpeaker() {
    $.ajax(`${baseUrl}/user/speaker`, {
      data: { page: recentPageSpeakers },
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        speakerObj = res;
        allSpeaker = res.values;
        checkIconVisiblility("Speakers");
        AddAllStudents(allSpeaker, "Speakers");
        $("#closeModal").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function getUser(id, type) {
    $.ajax(`${baseUrl}/user/${id}`, {
      type: "GET",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        let people = res;
        recentUser = JSON.parse(JSON.stringify(res));
        filterNav[type] = JSON.parse(JSON.stringify(rawStudent));
        filterNav[type].isModal = true;
        filterNav[type].people = people;
        modalType = type;
        prepareModal(people, type);
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
    $("#" + type + "List").empty();
    for (i in people) {
      let tr = createStaffTr(people[i], type);
      let id = people[i].id;
      $("#" + type + "List").append(tr);
      addActionPersons(type + id, people[i].editable);
    }
    $("#" + type + "PageHandelerIcon").css("display", "flex");
    checkIconVisiblility(type);
  }
  function DeleteStudent(userId, people, type) {
    $.ajax(`${baseUrl}/user/${userId}`, {
      type: "DELETE",
      processData: true,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        $("#closeModal").trigger("click");
        type == "Students" ? GetAllStudent() : GetAllSpeaker();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PutAllStudent(data, id) {
    $.ajax(`${baseUrl}/user/` + id, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        $("#closeModal").trigger("click");
        modalType == "Students" ? GetAllStudent() : GetAllSpeaker();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function PostStudent(student) {
    $.ajax(`${baseUrl}/user/StudentSignup`, {
      data: JSON.stringify(student),
      type: "POST",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        if (uploadedFile != false) {
          PutAvatar(res.userId);
        }
        GetAllStudent();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
        GetAllStudent();
      }
    });
  }
  function PutAvatar(id) {
    const datas = new FormData();
    datas.append("file", uploadedFile);
    $.ajax({
      type: "PUT",
      url: `${baseUrl}/User/${id}/Avatar`,
      data: { file: uploadedFile },
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        errorMessage = "تصویر به روز شد.";
        uploadedFile = false;
        // $("#successNotification").trigger( "click" );
        // GetAllStaff();
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
