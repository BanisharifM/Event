// "use strict";
$(document).ready(function() {
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

  let newsTag;

  let pageStatus = localStorage.getItem("NEWS_Page_Status");
  let NEWS_Id = localStorage.getItem("NEWS_Id");
  GetNews(NEWS_Id);

  let recentNews;
  let rawnews = {
    id: 0,
    title: "string",
    text: "string",
    creationTime: "2019-09-10T13:06:24.434Z",
    isEnabled: true,
    newsCategoryId: [0],
    newsClassId: [
      {
        id: 0,
        name: "string"
      }
    ],
    newsSectionId: [
      {
        id: 0,
        name: "string"
      }
    ],
    newsGradeId: [
      {
        id: 0,
        name: "string"
      }
    ]
  };
  let status = {
    SHOW: "showNews",
    NEW: "newNews"
  };

  function GetNews(newsId) {
    $.ajax(`${baseUrl}/event/${eventId}/news/${newsId}`, {
      type: "GET",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        recentNews = res;
        newsImagesArr = res.images;
        newsFile = res.file;
        preparePage();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function preparePage() {
    GetNewsTag();
    AddImages(newsImagesArr);
    AddFiles(newsFile);
    AddBody();
    if (pageStatus == status.SHOW) {
      disableEdit();
    } else if (pageStatus == status.NEW) {
      disableEdit();
      enableEdit();
    }
  }

  function AddNewsTag() {
    for (i in recentNews.category) {
      let name = recentNews.category[i].name;
      let id = newsTag.find(x => x.name == name).id;
      let StudentsOpt = createMaghtaOpt(id, name, "NewsTags");
      $("#tagsList").append(StudentsOpt);
      $("#maghtaNewsTags" + id).prop("selected", true);
    }
  }
  function createMaghtaOpt(id, name, type) {
    return (
      '<option id="maghta' +
      type +
      id +
      '" value="' +
      type +
      id +
      '" objectId="' +
      type +
      id +
      '" sectionName="' +
      name +
      '" >' +
      name +
      "</option>"
    );
  }
  function maghtaOptClick() {
    let objectId = $(this).val();
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    filterNav[type].sectionId = id;
    filterNav[type].sectionName = $("#maghta" + type + id).attr("sectionName");

    $("#classStudentsList")
      .empty()
      .prop("disabled", true);
    $("#classStudentsList").append(
      '<option value="یبس" disabled selected style="display:none;"></option>'
    );
    filterNav[type].status1 = true;
    GetGrade(id, type);
    sectionOptChange = true;
  }

  function AddImages(imageArr) {
    let isActiveImg = true;
    $("#carouselBody").empty();
    $(".new-image").empty();
    for (i in imageArr) {
      let src = imageArr[i];
      // let id=imageArr[i].id
      //carousel
      let caroselitem = caroselItem(src, isActiveImg);
      $("#carouselBody").append(caroselitem);
      //image list
      addImgList(src, `تصویر ${parseInt(i) + 1}`), (isActiveImg = false);
    }
  }
  function caroselItem(src, isActive) {
    return (
      '<div class="carousel-item ' +
      (isActive == true ? "active" : "") +
      '">' +
      '<img class="d-block" style="width:100%; height: 400px;"src="' +
      src +
      '" alt="' +
      src +
      '">' +
      "</div>"
    );
  }
  function AddFiles(file) {
    $(".new-file").empty();
    if (file != null) {
      let src = file;
      addFileList(src, `فیلم`);
    }
  }
  function AddBody() {
    let body = createNewsBody(recentNews, "News");
    $("#newsBody").append(body);
  }

  function enableEdit() {
    if (pageStatus == status.SHOW) AddTags();
    $("#editIcon").hide();
    $("#deleteIcon").hide();

    $("#saveIcon").show();
    $("#cancelIcon").show();

    $("#schoolTagsFilter").show();

    $("#selectImageNav").show();
    $("#ImageLable").hide();

    if (newsFile == null) {
      $("#selectFileNav").show();
      $("#FileLable").hide();
    }

    $(".deleteIcon").show();

    $("#newsTitle").attr("readonly", false);
    $("#newsText").attr("readonly", false);

    // $("#classTagsList").prop("disabled", false);
    $("#tagsList").prop("disabled", false);
  }
  function disableEdit() {
    $("#editIcon").show();
    $("#deleteIcon").show();

    $("#saveIcon").hide();
    $("#cancelIcon").hide();

    $("#schoolTagsFilter").hide();

    $("#selectImageNav").hide();
    $("#ImageLable").show();

    $("#selectFileNav").hide();
    $("#FileLable").show();

    $(".deleteIcon").hide();

    $("#newsTitle").attr("readonly", true);
    $("#newsText").attr("readonly", true);

    // $("#classTagsList").prop("disabled", true);
    $("#tagsList").prop("disabled", true);
  }

  let newsTagList = [];
  let SchoolTagList = [];
  const filterNav = {
    temp: {
      status1: false,
      status2: false,
      status3: false,
      sectionName: false,
      sectionId: false,
      gradeName: false,
      gradeId: false,
      className: false,
      classId: false,
      isFilter: false
    },
    Students: {
      status1: false,
      status2: false,
      status3: false,
      sectionName: false,
      sectionId: false,
      gradeName: false,
      gradeId: false,
      className: false,
      classId: false,
      isFilter: false
    }
  };

  function GetNewsTag() {
    $.ajax(`${baseUrl}/event/${eventId}/news/category`, {
      type: "GET",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        newsTag = res;
        if (pageStatus == status.NEW) AddTags();
        else if (pageStatus == status.SHOW) AddNewsTag();
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function AddTags() {
    for (i in newsTag) {
      let name = newsTag[i].name;
      let id = newsTag.find(x => x.name == name).id;
      if (recentNews.category.find(x => x.name == name)) continue;
      let StudentsOpt = createMaghtaOpt(id, newsTag[i].name, "NewsTags");
      $("#tagsList").append(StudentsOpt);
      // $("#maghtanewsTags"+id).prop("selected",true);
      // document.getElementById('tagsList').onchange = newsTagChange;
    }
  }

  $("#editIcon").click(function() {
    enableEdit();
    // pageStatus=status.EDIT;
  });
  $("#deleteIcon").click(function() {
    if (!confirm("آیا مطمئن  هستید حذف شود؟")) return;
    DeleteNews();
  });
  $("#saveIcon").click(function() {
    if (!confirm("آیا مطمئن  هستید؟")) return;
    $.each($("#tagsList"), function() {
      newsTagList.push($(this).val());
    });
    let arr2 = [];
    for (i in newsTagList[0]) {
      let id = newsTagList[0][i].replace("NewsTags", "");
      arr2.push({ name: newsTag.find(x => x.id == id).name });
    }
    let data = {
      title: $("#newsTitle").val(),
      text: $("#newsText").val(),
      category: arr2,
      images: newsImagesArr,
      file: newsFile
    };
    console.log(data);
    PutNews(data);
  });
  $("#cancelIcon").click(function() {
    let stat = localStorage.getItem("NEWS_Page_Status");
    if (stat == status.NEW) DeleteNews();
    else window.location = "newsContent.html";
  });

  function PutNews(data) {
    $.ajax(`${baseUrl}/event/${eventId}/news/${recentNews.id}`, {
      data: JSON.stringify(data),
      type: "PUT",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        localStorage.setItem("NEWS_Page_Status", status.SHOW);
        window.location = "newsContent.html";
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        // set errorMessage
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }
  function DeleteNews() {
    $.ajax(`${baseUrl}/event/${eventId}/news/${recentNews.id}`, {
      type: "DELETE",
      processData: false,
      contentType: "application/json",
      headers: { token: token },
      success: function(res) {
        errorMessage = "با موفقیت انجام شد.";
        $("#successNotification").trigger("click");
        window.location = "news.html";
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = err.msg;
        $("#errorNotification").trigger("click");
      }
    });
  }

  function createNewsBody(person, type) {
    return (
      '<div class="card-body text-center">' +
      '<label style="float: right !important; margin-bottom:10px">عنوان :</label>' +
      firstName(person.id, type, person.title) +
      '<label style="float: right !important; margin-bottom:10px">متن :</label>' +
      detail(person.id, type, person.text) +
      "</div>"
    );
  }
  function firstName(id, type, firstName) {
    return (
      '<input id="newsTitle" autocomplete="off" class="form-control mb-4" type="text" value="' +
      firstName +
      '" objectId="' +
      type +
      id +
      '" style="border: 1px solid #ced4da !important;" > '
    );
  }
  function detail(id, type, detail) {
    return (
      '<textarea id="newsText" class="form-control mb-4" rows="9" type="text" objectId="' +
      type +
      id +
      '"  >' +
      detail +
      "</textarea>"
    );
  }

  let uploadedImage;
  let addImageMode = false;
  document.getElementById("selectImage").addEventListener("click", () => {
    document.getElementById("selectImageInp").click();
  });
  document.getElementById("selectImageInp").onchange = ImageChange;
  function ImageChange() {
    uploadedImage = event.target.files[0];
    $("#selectImage").text(uploadedImage.name);
    addImageMode = true;
  }
  $("#addImage-btn").click(function() {
    if (!addImageMode) return;
    let imageType = uploadedImage.type;
    let suffix = imageType.substring(imageType.indexOf("/") + 1);
    PutImage(suffix);
    $("#selectImage").text("انتخاب تصویر ...");
    addImageMode = false;
  });
  function PutImage(suffix) {
    const datas = new FormData();
    datas.append("file", uploadedImage);
    $.ajax({
      type: "POST",
      url: `${baseUrl}/event/${eventId}/file/${suffix}`,
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        newsImagesArr.push(res.url);
        AddImages(newsImagesArr);
        errorMessage = "تصویر آپلود شد!";
        $("#successNotification").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "fg";
        $("#errorNotification").trigger("click");
        return false;
      }
    });
  }

  let uploadedFile;
  let addFileMode = false;
  document.getElementById("selectFile").addEventListener("click", () => {
    document.getElementById("selectFileInp").click();
  });
  document.getElementById("selectFileInp").onchange = FileChange;
  function FileChange() {
    uploadedFile = event.target.files[0];
    $("#selectFile").text(uploadedFile.name);
    addFileMode = true;
  }

  $("#addFile-btn").click(function() {
    if (!addFileMode) return;
    let fileType = uploadedFile.type;
    let suffix = fileType.substring(fileType.indexOf("/") + 1);
    PutFile(suffix);
    $("#selectFile").text("انتخاب فایل ...");
    addFileMode = false;
  });
  function PutFile(suffix) {
    const datas = new FormData();
    datas.append("file", uploadedFile);
    $.ajax({
      type: "POST",
      url: `${baseUrl}/event/${eventId}/file/${suffix}`,
      data: datas,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      headers: { token: token },
      success: function(res) {
        newsFile = res.url;
        AddFiles(newsFile);
        errorMessage = "فایل آپلود شد!";
        $("#selectFileNav").hide();
        $("#FileLable").show();
        $("#successNotification").trigger("click");
      },
      error: function(jqXHR, textStatus, errorThrown, error) {
        var err = eval("(" + jqXHR.responseText + ")");
        errorMessage = "fg";
        $("#errorNotification").trigger("click");
        return false;
      }
    });
  }

  var i = 0;
  function addImgList(url, name) {
    task = name;
    i++;
    var add_todo = $(
      '<div class="to-do-list mb-3" id="Image' +
        i +
        '"><div class="d-inline-block"><label class="check-task custom-control custom-checkbox d-flex justify-content-center">' +
        '<a href="' +
        url +
        '" target="_blank"><span class="custom-control-label" for="checkbox' +
        i +
        '">' +
        task +
        '</span></a></label></div><div class="float-right"><a id="deleteImage' +
        i +
        '" url=' +
        url +
        ' href="#!" class="delete_imagelist"><i class="far fa-trash-alt deleteIcon"></i></a></div></div>'
    );

    $(add_todo)
      .appendTo(".new-image")
      .hide()
      .fadeIn(300);
    $(".add_image_todo").val("");
    document.getElementById("deleteImage" + i).onclick = delete_image;
  }
  $(".delete_imagelist").on("click", function() {
    $(this)
      .parent()
      .parent()
      .fadeOut();
  });
  function addFileList(url, name) {
    task = name;
    var add_todo = $(
      '<div class="to-do-list mb-3" id="File' +
        i +
        '"><div class="d-inline-block"><label class="check-task custom-control custom-checkbox d-flex justify-content-center">' +
        '<a href="' +
        url +
        '" target="_blank"><span class="custom-control-label" for="checkbox' +
        i +
        '">' +
        task +
        '</span></a></label></div><div class="float-right"><a id="deleteFile' +
        i +
        '" url=' +
        url +
        ' href="#!" class="delete_filelist"><i class="far fa-trash-alt deleteIcon"></i></a></div></div>'
    );
    $(add_todo)
      .appendTo(".new-file")
      .hide()
      .fadeIn(300);
    $(".add_file_todo").val("");
    document.getElementById("deleteFile" + i).onclick = delete_file;
  }
  $(".delete_filelist").on("click", function() {
    $(this)
      .parent()
      .parent()
      .fadeOut();
  });

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
  var errorMessage;
  var newsImagesArr,
    newsFile = null;
  function delete_image(e) {
    if (!confirm("آیا مطمئن  هستید؟")) return;
    let objectId = $(this).attr("id");
    let url = $(this).attr("url");
    newsImagesArr.splice(newsImagesArr.indexOf(url), 1);
    let id = objectId.match(/\d+/)[0];
    let type = objectId.replace(id, "");
    AddImages(newsImagesArr);
    $("#Image" + id).fadeOut();
  }
  function delete_file(e) {
    if (!confirm("آیا مطمئن  هستید؟")) return;
    let objectId = $(this).attr("id");
    let id = objectId.match(/\d+/)[0];
    newsFile = null;
    AddFiles(recentNews.fileUrl);
    $("#File" + id).fadeOut();
    $("#selectFileNav").show();
    $("#FileLable").hide();
  }
});
