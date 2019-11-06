// "use strict";
$(document).ready(function() {

    let token=localStorage.getItem("token");
    if(token==""||null)
        window.location="signin.html"; 
        
    var baseUrl=localStorage.getItem("baseUrl");
        

    let newsTag;

    let pageStatus=localStorage.getItem("NEWS_Page_Status");
    let NEWS_Id=localStorage.getItem("NEWS_Id");
    GetNews(NEWS_Id);


    let recentNews;
    let rawnews={
        "id": 0,
        "title": "string",
        "text": "string",
        "creationTime": "2019-09-10T13:06:24.434Z",
        "isEnabled": true,
        "newsCategoryId": [
          0
        ],
        "newsClassId": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "newsSectionId": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "newsGradeId": [
          {
            "id": 0,
            "name": "string"
          }
        ]
    }
    let status={
        SHOW:"showNews",
        NEW : 'newNews'
    }

    function GetNews(newsId){
        $.ajax(`${baseUrl}/News/${newsId}`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                recentNews=res
                console.log(res);
                preparePage();                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function preparePage(){
        AddSchoolTags();    
        GetNewsTag();
        AddImages(recentNews.imageUrl);
        AddFiles(recentNews.fileUrl);
        AddBody();
        if(pageStatus==status.SHOW){
            disableEdit();
        }
        else if(pageStatus==status.NEW){
            disableEdit();
            enableEdit();
        }
        // else if(pageStatus==status.EDIT){
        //     enableEdit();
        // }
        // $("#newsBody").append(createNewsBody(recentNews,"newsBody"));
        // document.getElementById("sendNews").onclick=sendNews;
    }

    function AddSchoolTags(){
        $("#classTagsList").empty();
        for(i in recentNews.newsSectionId){
            let id=recentNews.newsSectionId[i].id;
            let name=recentNews.newsSectionId[i].name;
            let StudentsOpt=createMaghtaOpt(id,name,"SectionTags");
            $("#classTagsList").append(StudentsOpt);    
            $("#maghtaSectionTags"+id).prop("selected",true);
        }
        for(i in recentNews.newsGradeId){
            let id=recentNews.newsGradeId[i].id;
            let name=recentNews.newsGradeId[i].name;
            let StudentsOpt=createMaghtaOpt(id,name,"GradeTags");
            $("#classTagsList").append(StudentsOpt);    
            $("#maghtaGradeTags"+id).prop("selected",true);
        }
        for(i in recentNews.newsClassId){
            let id=recentNews.newsClassId[i].id;
            let name=recentNews.newsClassId[i].name;
            let StudentsOpt=createMaghtaOpt(id,name,"ClassTags");
            $("#classTagsList").append(StudentsOpt);    
            $("#maghtaClassTags"+id).prop("selected",true);
        }
    }
    function AddNewsTag(){
        // $("#tagsList").empty();
        for(i in recentNews.newsCategoryId){
            let id=recentNews.newsCategoryId[i];
            let name=newsTag.find(x => x.id==id).name
            let StudentsOpt=createMaghtaOpt(id,name,"NewsTags");
            $("#tagsList").append(StudentsOpt);    
            $("#maghtaNewsTags"+id).prop("selected",true);
        }
    }
    function AddImages(imageArr){
        let isActiveImg=true;
        $("#carouselBody").empty();
        $(".new-image").empty();
        for(i in imageArr){
            let src=imageArr[i].url;
            let id=imageArr[i].id
            //carousel
            let caroselitem=caroselItem(src,isActiveImg);
            $("#carouselBody").append(caroselitem);
            //image list
            addImgList(id,src,`تصویر ${parseInt(i)+1}`),
            
            isActiveImg=false;
        }
    }
    function caroselItem(src,isActive){
        return(
            '<div class="carousel-item '+(isActive==true ? 'active' : '') +'">'+
                '<img class="d-block" style="width:100%; height: 400px;"src="'+src+'" alt="'+src+'">'+
            '</div>'
        );
    }
    function AddFiles(fileArr){
        $(".new-file").empty();
        for(i in fileArr){
            let src=fileArr[i].url;
            let id=fileArr[i].id
            addFileList(id,src,`فایل ${parseInt(i)+1}`);
        }
    }
    function AddBody(){
        let body=createNewsBody(recentNews,"News")
        $("#newsBody").append(body);
    }

    function enableEdit(){
        if(pageStatus==status.SHOW)
            AddTags();
        $("#editIcon").hide();
        $("#deleteIcon").hide();

        $("#saveIcon").show();
        $("#cancelIcon").show();

        $("#schoolTagsFilter").show();

        $("#selectImageNav").show();
        $("#ImageLable").hide();
        
        $("#selectFileNav").show();
        $("#FileLable").hide();

        $(".deleteIcon").show();

        $('#newsTitle').attr('readonly', false); 
        $('#newsText').attr('readonly', false); 
        
        $("#classTagsList").prop("disabled", false); 
        $("#tagsList").prop("disabled", false); 

    }
    function disableEdit(){
        
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

        $('#newsTitle').attr('readonly', true); 
        $('#newsText').attr('readonly', true); 
        
        $("#classTagsList").prop("disabled", true); 
        $("#tagsList").prop("disabled", true); 
        
    }

    let newsTagList=[];
    let SchoolTagList=[];
    const filterNav={
        temp :{
            status1 : false,
            status2: false,
            status3 : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        },
        "Students" : {
            status1 : false,
            status2: false,
            status3 : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        }
    }

    let sections;
    let grades;
    let classes;
    GetSection();
    
    const rawStudent={
        id: 0,
        phoneNumber: "",
        firstName: "", 
        lastName:"", 
        nationalId:"",
        className:"",
        sectionName:"",
        gradeName:"",
        imageUrl:"../assets/images/user/avatar-2.jpg",
        totalTuition:"",
        paidTuution:"",
        transaction:"",
        grades:"",
        onlineGrades:"",
        alerts:"",
        isActive:true,
        classId:"",
        sectionId:"",
        gradeId:""
    }

    function createMaghtaOpt(id,name,type){
        return(
            '<option id="maghta'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" sectionName="'+name+'" >'+name+'</option>'
        );
    }
    function maghtaOptClick(){
        let objectId=$(this).val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].sectionId=id;
        filterNav[type].sectionName=$("#maghta"+type+id).attr('sectionName');
        
        $("#classStudentsList").empty().prop("disabled", true); 
        $("#classStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');
        filterNav[type].status1=true;        
        GetGrade(id,type);
        sectionOptChange=true;
    }

    function createPayeOpt(id,name,type,sectionId){
        return(
            '<option id="paye'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" gradeName="'+name+'">'+name+'</option>'            
        );
    }
    function payeOptClick(){
        let objectId=$(this).val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].gradeId=id;
        filterNav[type].gradeName=$("#paye"+type+id).attr('gradeName');
        if(type=="Students"){
            GetClass(id,type);
            filterNav[type].status2=true;
        }
        gradeOptChange=true;
    }

    function createClassOpt(id,name,type,sectionId){
        return(
            '<option id="class'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" className="'+name+'">'+name+'</option>'            
        );
    }
    function classOptClick(){
        let objectId=$(this).val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].classId=id;
        filterNav[type].className=$("#class"+type+id).attr('className');
        filterNav[type].status3=true;
        classOptChange=true;
    }

    function GetSection(){
        $.ajax(`${baseUrl}/Section`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                sections=res;
                AddSection();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddSection(){
        for(i in sections){
            let id=sections[i].id;
            
            let StudentsOpt=createMaghtaOpt(id,sections[i].name,"Students");
            $("#maghtaStudentsList").append(StudentsOpt);
            document.getElementById('maghtaStudentsList').onchange = maghtaOptClick;
        }
    }
    function GetGrade(sectionId,type){
        $.ajax(`${baseUrl}/Section/${sectionId}/Grade`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(type!="payeha"){
                    grades=res;
                    AddGrade(type);
                }
                else{
                    payeha=res;
                    AddPayeha();
                }
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddGrade(type){
        $("#paye"+type+"List").empty().prop("disabled", false); 
        $("#paye"+type+"List").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in grades){
            const paye=grades[i];
            let opt=createPayeOpt(paye.id,paye.name,type,paye.sectionId);
            $("#paye"+type+"List").append(opt);
            document.getElementById('paye'+type+'List').onchange = payeOptClick;
            //FIXME:
            // document.getElementById("select-paye"+type+"List-container").onclick = payeOptClicked;
        }
    }
    function GetClass(gradeId,type){
        $.ajax({
            url: `${baseUrl}/Class`,
            data:{"gradeId":gradeId},
            type: "GET",
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(type=="Students"){
                    classes=res;
                    AddClass(type);
                }
                else if(type=="Classes"){
                    kelasha=res;
                    AddKelass(type);
                }
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddClass(type){
        $("#class"+type+"List").empty().prop("disabled", false); 
        $("#class"+type+"List").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in classes){
            const kelas=classes[i];
            const opt=createClassOpt(kelas.id,kelas.name,type,kelas.sectionId);
            $("#class"+type+"List").append(opt);
            document.getElementById('class'+type+'List').onchange = classOptClick;
        }
    }

    function GetNewsTag(){
        $.ajax(`${baseUrl}/News/Category`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                newsTag=res;
                if(pageStatus==status.NEW)
                    AddTags();
                else if(pageStatus==status.SHOW)
                    AddNewsTag();                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddTags(){
            for(i in newsTag){
            if(newsTag[i].isEnabled==true)
                continue;
            let id=newsTag[i].id;
            if(recentNews.newsCategoryId.find(x => x==id))
                continue;
            let StudentsOpt=createMaghtaOpt(id,newsTag[i].name,"NewsTags");
            $("#tagsList").append(StudentsOpt);
            // $("#maghtanewsTags"+id).prop("selected",true);
            // document.getElementById('tagsList').onchange = newsTagChange;
        }
    }
    // function newsTagChange(){
        
    // }

    let sectionOptChange=false;
    let gradeOptChange=false;
    let classOptChange=false;

    $("#addSectionTag").click(function(){
        if(filterNav["Students"].status1==false||!sectionOptChange)
           return;
        sectionOptChange=false;

        let id=filterNav["Students"].sectionId;
        let StudentsOpt=createMaghtaOpt(id,filterNav["Students"].sectionName,"SectionTags");
        $("#classTagsList").append(StudentsOpt);    
        $("#maghtaSectionTags"+id).prop("selected",true);
    })
    $("#addGradeTag").click(function(){
        if(filterNav["Students"].status2==false || !gradeOptChange)
           return;
        
        let id=filterNav["Students"].gradeId;
        let StudentsOpt=createMaghtaOpt(id,filterNav["Students"].gradeName,"GradeTags");
        $("#classTagsList").append(StudentsOpt);    
        $("#maghtaGradeTags"+id).prop("selected",true);
    })
    $("#addClassTag").click(function(){
        if(filterNav["Students"].status3==false || !classOptChange)
           return;
        
        let id=filterNav["Students"].classId;
        let StudentsOpt=createMaghtaOpt(id,filterNav["Students"].className,"ClassTags");
        $("#classTagsList").append(StudentsOpt);    
        $("#maghtaClassTags"+id).prop("selected",true);
    });
    

    $("#editIcon").click(function(){
        enableEdit();
        // pageStatus=status.EDIT;
    });
    $("#deleteIcon").click(function(){
        if(!confirm("آیا مطمئن  هستید حذف شود؟"))
            return;
        DeleteNews();
    });
    $("#saveIcon").click(function(){
        if(!confirm("آیا مطمئن  هستید؟"))
            return;
        $.each($("#classTagsList"), function(){            
            SchoolTagList.push($(this).val());
        });
        $.each($("#tagsList"), function(){            
            newsTagList.push($(this).val());
        });
        console.log(newsTagList);
        let arr1=SchoolTagList[SchoolTagList.length-1];

        let arr2=newsTagList[newsTagList.length-1];
        if(arr2===undefined)
            arr2=[]
        for(i in arr2){
            arr2[i]=parseInt(arr2[i].replace("NewsTags",""));
        }
        let sectionTag=[];
        let gradeTag=[];
        let classTag=[];
        for(i in arr1){
            let objectId=arr1[i];
            let id=objectId.match(/\d+/)[0];
            id=parseInt(id);
            let type=objectId.replace(id, "");
            if(type=="SectionTags")
                sectionTag.push(id);
            else if(type=="GradeTags")
                gradeTag.push(id);
            else if(type=="ClassTags")
                classTag.push(id);
        }
        let data={
            "title": $("#newsTitle").val(),
            "text":$("#newsText").val() ,
            "newsCategory":arr2,
            "classId":classTag,
            "gradeId":gradeTag,
            "sectionId": sectionTag
        }
        console.log(data)
        PutNews(data);
    });
    $("#cancelIcon").click(function(){
        let stat=localStorage.getItem("NEWS_Page_Status");
        if(stat==status.NEW)
            DeleteNews();
        else
        window.location="newsContent.html";         

    });
    
    function PutNews(data){
        $.ajax(`${baseUrl}/News/${recentNews.id}`, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                localStorage.setItem("NEWS_Page_Status",status.SHOW);
                window.location="newsContent.html";                         
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteNews(){
        $.ajax(`${baseUrl}/News/${recentNews.id}`, {
            type: "DELETE",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                window.location="news.html";         
                // $("#closeModal1").click();

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    function createNewsBody(person,type){
        return(
            '<div class="card-body text-center">'+
                '<label style="float: right !important; margin-bottom:10px">عنوان :</label>'+
                firstName(person.id,type,person.title)+
                '<label style="float: right !important; margin-bottom:10px">متن :</label>'+
                detail(person.id,type,person.text)+
            '</div>'
        );
    }
    function firstName(id,type,firstName){
        return(
            '<input id="newsTitle" autocomplete="off" class="form-control mb-4" type="text" value="'+firstName+'" objectId="'+type+id+'" style="border: 1px solid #ced4da !important;" > '
        );
    }
    function detail(id,type,detail){
        return(
            '<textarea id="newsText" class="form-control mb-4" rows="9" type="text" objectId="'+type+id+'"  >'+detail+'</textarea>'
        );
    }

    let uploadedImage;
    let addImageMode=false;
    document.getElementById("selectImage").addEventListener('click', () => {
            document.getElementById('selectImageInp').click()               
    })
    document.getElementById('selectImageInp').onchange = ImageChange;
    function ImageChange(){
        uploadedImage=event.target.files[0]; 
        $("#selectImage").text(uploadedImage.name)
        addImageMode=true;       
    }
    $("#addImage-btn").click(function(){
        if(!addImageMode)
            return;
        PutImage(recentNews.id);
        $("#selectImage").text("انتخاب تصویر ...")  
        addImageMode=false;     
    });
    function PutImage(newsId){
        const datas = new FormData();
        datas.append("file",uploadedImage)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/News/${newsId}/Image`,
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                recentNews.imageUrl.push(res)
                AddImages(recentNews.imageUrl);
                errorMessage="تصویر افزوده شد.";
                $("#successNotification").trigger( "click" );
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
                $("#errorNotification").trigger( "click" );
                return false;
            }
        });
    }

    let uploadedFile;
    let addFileMode=false;
    document.getElementById("selectFile").addEventListener('click', () => {
            document.getElementById('selectFileInp').click()               
    })
    document.getElementById('selectFileInp').onchange = FileChange;
    function FileChange(){
        uploadedFile=event.target.files[0]; 
        $("#selectFile").text(uploadedFile.name)
        addFileMode=true;       
    }

    $("#addFile-btn").click(function(){
        if(!addFileMode)
            return;
        let fileType=uploadedFile.type;
        let suffix=fileType.substring(fileType.indexOf("/") + 1);
        PutFile(recentNews.id,suffix);
        $("#selectFile").text("انتخاب فایل ...")  
        addFileMode=false;     
    });
    function PutFile(newsId,suffix){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/News/${newsId}/File/Suffix/${suffix}`,
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                recentNews.fileUrl.push(res)
                AddFiles(recentNews.fileUrl);
                errorMessage="فایل افزوده شد.";
                $("#successNotification").trigger( "click" );
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
                $("#errorNotification").trigger( "click" );
                return false;
            }
        });
    }
    


//   var i;
  function addImgList(id,url,name) {
    task = name;
    i=id
    var add_todo = $(
        '<div class="to-do-list mb-3" id="Image' +
          i +
          '"><div class="d-inline-block"><label class="check-task custom-control custom-checkbox d-flex justify-content-center">'
          +'<a href="'+url+'" target="_blank"><span class="custom-control-label" for="checkbox' +
          i +
          '">' +
          task +
          '</span></a></label></div><div class="float-right"><a id="deleteImage'+i+'" href="#!" class="delete_imagelist"><i class="far fa-trash-alt deleteIcon"></i></a></div></div>'
      );
    
    $(add_todo)
      .appendTo(".new-image")
      .hide()
      .fadeIn(300);
    $(".add_image_todo").val("");
    document.getElementById("deleteImage"+i).onclick=delete_image;
  }
  $(".delete_imagelist").on("click", function() {
    $(this)
      .parent()
      .parent()
      .fadeOut();
  });
  function addFileList(id,url,name) {
    task = name;
    i=id
    var add_todo = $(
      '<div class="to-do-list mb-3" id="File' +
        i +
        '"><div class="d-inline-block"><label class="check-task custom-control custom-checkbox d-flex justify-content-center">'+
        '<a href="'+url+'" target="_blank"><span class="custom-control-label" for="checkbox' +
        i +
        '">' +
        task +
        '</span></a></label></div><div class="float-right"><a id="deleteFile'+i+'"  href="#!" class="delete_filelist"><i class="far fa-trash-alt deleteIcon"></i></a></div></div>'
    );
    $(add_todo)
      .appendTo(".new-file")
      .hide()
      .fadeIn(300);
    $(".add_file_todo").val("");
    document.getElementById("deleteFile"+i).onclick=delete_file;    
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
  function delete_image(e) {
    let objectId=$(this).attr('id');
    let id=objectId.match(/\d+/)[0];
    let type=objectId.replace(id, "");
    $.ajax(`${baseUrl}/Image/${id}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                for(i in recentNews.imageUrl){
                    if(recentNews.imageUrl[i].id==id)
                        recentNews.imageUrl.splice(i, 1);
                }
                AddImages(recentNews.imageUrl);
                $("#Image" + id).fadeOut();
                errorMessage="تصویر حذف شد.";
                $("#successNotification").trigger( "click" );
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
  }
  function delete_file(e) {
    let objectId=$(this).attr('id');
    let id=objectId.match(/\d+/)[0];
    let type=objectId.replace(id, "");
    $.ajax(`${baseUrl}/File/${id}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                for(i in recentNews.fileUrl){
                    if(recentNews.fileUrl[i].id==id)
                        recentNews.fileUrl.splice(i, 1);
                }
                AddFiles(recentNews.fileUrl);
                $("#File" + id).fadeOut();
                errorMessage="فایل حذف شد .";
                $("#successNotification").trigger( "click" );
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }

});


