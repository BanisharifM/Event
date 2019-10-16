/**
 * 
 *  Created by MBD
 *  7/6/1398
 */

$(document).ready(function(){

    let token=localStorage.getItem("token");
    if(token==""||null)
        window.location="signin.html"; 
        
    var baseUrl=localStorage.getItem("baseUrl");

    let recentUser=localStorage.getItem("userId");

    var enabelMessageId;
    var newPersonId;
    var mode="first"

    let cahtsArr;
    
    GetCaht();
    setInterval(function(){ GetCaht(); }, 60000);
    let sections;
    GetSection();

    let staffs;
    GetAllStaff();

    let grades;
    let classes;

    let Students;

    const rawEditItem={
        status:false,
        imageUrl : false,
        imageDef:false,
        firstName : "",
        text : "",
        nationalId : "",
        title : "",
        phoneNumber : ""
    }
    const editItems={};

    const filterNav={
        temp :{
            status : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        },
        "Classes" : {
            status : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        },
        "Course" : {
            status : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        },
        "Students" : {
            status : false,
            sectionName : false,
            sectionId : false,
            gradeName : false ,
            gradeId : false,
            className : false,
            classId : false,
            isFilter: false
        }
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
        GetGrade(id,type);
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
        }
        else
        filterNav[type].status=true;
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
        filterNav[type].status=true;
    }
    
    $("#StudentsListFilter").click(function(){
        if(filterNav["Students"].status==false)
           return;
        filterNav["Students"].isFilter=true;
        GetAllStudent();
    });

    function createStaffTr(person,type,tit){
        return(
            '<tr id="tr'+type+person.id+'"  objectId="'+type+person.id+'" >'+
                '<td>'+imageUrl(person.id,type,person.avatarUrl)+'</td>'+
                information(person.id,type,person.firstName,person.lastName)+
                '<td>'+title(person.id,type,type == "Staff" ? person.title : person.major)+'</td>'+
            '</tr>'
        );
    }
    function createStudentTr(person,type,){
        return(
            '<tr id="tr'+type+person.id+'" objectId="'+type+person.id+'"  >'+
                '<td>'+imageUrl(person.id,type,person.avatarUrl)+'</td>'+
                information(person.id,type,person.firstName,person.lastName)+
            '</tr>'
        );
    }

    function imageUrl(id,type,src){
        return(
            '<div id="imageUrl'+type+id+'" >'+
                '<input id="imageUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<img id="imageUrlImg'+type+id+'" class="rounded-circle" key="'+id+'" objectId="'+type+id+'" style="width:40px;" src="'+src+'" alt="تصویر">'+
            '</div>'
        );
    }

    function information(id,type,firstName,lastName){
        return(
            '<td><h6 id="informationFirstName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+firstName+'</h6></td>'+
            '<td><h6 id="informationLastName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+lastName+'</h6></td>'
        );
    }

    function title(id,type,title){
        return(
            '<h6 id="title'+type+id+'" class="m-0" objectId="'+type+id+'" > '+title+'</h6>'
        );
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
    function GetAllStudent(){
        let classId=filterNav["Students"].classId
        $.ajax(`${baseUrl}/user/student?classId=${classId}`, {
            // data: JSON.stringify({"classId":classId}),
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                Students=res;
                AddAllStudents();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddAllStudents(){
        $('#StudentsList').empty();
        for(i in Students){
            let title=filterNav["Students"].className;
            let tr=createStudentTr(Students[i],"Students", title);
            let id=Students[i].id;
            editItems["Students"+id]= JSON.parse(JSON.stringify(rawEditItem));
            $('#StudentsList').append(tr);
            addAction('Students'+id);
        }
    }
    function addAction(objectId){
        document.getElementById('tr'+objectId).onclick = startChat;
    }
  
    function GetAllStaff(){
        $.ajax(`${baseUrl}/user/staff?teacher=true&staff=true`, {
            // data: JSON.stringify({"teacher":true,"staff":true}),
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                staffs=res;
                AddStaff();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddStaff(){
        $('#StaffList').empty();
        for(i in staffs){
            let id=staffs[i].id;
            if(staffs[i].isTeacher===false || recentUser==id)
               continue;
            let tr=createStaffTr(staffs[i],"Staff");
            editItems["Staff"+id]= JSON.parse(JSON.stringify(rawEditItem));
            $('#StaffList').append(tr);
            addAction('Staff'+id);
        }
    }
    function startChat(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        newPersonId=id;
        PostChat(id);
    }
    function GetCaht(){
        $.ajax(`${baseUrl}/Chat`, {
            // data: JSON.stringify({"userId": id}),
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                cahtsArr=res;
                createPersonList();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PostChat(id){
        $.ajax(`${baseUrl}/Chat`, {
            data: JSON.stringify({"userId": id}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                $(".closes").trigger('click');
                mode="newCaht"
                GetCaht();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }

    let activeCaht=0
    function createPersonList(){
        $("#personList").empty();
        for(i in cahtsArr){
            let id=cahtsArr[i].id;
            let name=cahtsArr[i].userName;
            let image=cahtsArr[i].userAvatarUrl;
            let person=Persons(id,name,image);
            $("#personList").append(person);
            document.getElementById(id).onclick=ShowCaht;
        }
        if(mode=="first"){
            enabelMessageId=cahtsArr[0].id;
            activeChat(enabelMessageId);
            GetUserChats();
            mode="defualt"
        }
        else if(mode=="newCaht"){
            let x=cahtsArr.find(x => x.userId==newPersonId);
            enabelMessageId=x.id ;
            activeChat(newPersonId);
            GetUserChats();
            mode="default"
        }
        else {
            activeChat(enabelMessageId);
            GetUserChats();
        }
    }
    function Persons(id,name,src){
        return(
            '<div class="media userlist-box " id="'+id+'" data-id="2" data-status="online" data-username="Lary Doe"> <a class="media-left" href="#!"><img class="media-object img-radius" src="'+src+'" alt=" "> </a> <div class="media-body"> <h6 class="chat-header">'+name+' </h6> </div> </div>'
        );
    }
    function activeChat(id){
        $("#"+activeCaht).removeClass("active");
        $("#"+id).addClass("active");
        activeCaht=id;
    }
    function ShowCaht(){
        enabelMessageId=$(this).attr('id');
        activeChat(enabelMessageId);
        GetUserChats();
    }
    function GetUserChats(){
        $.ajax(`${baseUrl}/Chat/${enabelMessageId}/Message`, {
            // data: JSON.stringify({"teacher":true,"staff":true}),
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                UserCahtList=res;
                addCahtToBox("default");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function GetUserOtherChats(lastMessageId){
        $.ajax(`${baseUrl}/Chat/${enabelMessageId}/Message?lastMessageId=${lastMessageId}`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                res.reverse();
                UserCahtList=[...res,...UserCahtList];
                UserCahtList.reverse();
                addCahtToBox("update");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
        // alert("get user chat complete")
        // GetUserNewChate()
        // setInterval(GetUserNewChate(UserCahtList[0].id),10000);
    }
    function GetUserNewChate(firtMessageId){
        // alert(firtMessageId)
        $.ajax(`${baseUrl}/Chat/${enabelMessageId}/Message?firstMessageId=${firtMessageId}`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                res.splice(-1,1)
                res.reverse();
                UserCahtList=[...UserCahtList,...res];
                UserCahtList.reverse();
                addCahtToBox("refresh");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function addCahtToBox(mode){
        $("#chatBox").empty();
        let mess;
        let recentMessage={
            isFromStaff :"",
            messId:0,
            time: 10000000000000000000000000000,
            day:1397-10-11,
            messages:[],

        }
        UserCahtList.reverse();
        for(i in UserCahtList){
            let id=UserCahtList[i].id
            let text=UserCahtList[i].text;
            let date=UserCahtList[i].sendDate;
            let isFromStaff=UserCahtList[i].isFromStaff;
            let time=date.substr(11);
            // alert(time)
            // alert(time)
            let day=date.substr(0,10);
            // alert(day)
            time = time.split(/:/);
            let xdTime=time[0] * 3600 + time[1] * 60 + time[2];
            // alert(xdTime-recentMessage.time)
            if(isFromStaff===recentMessage.isFromStaff&&day==recentMessage.day && xdTime-recentMessage.time<300 ){
                recentMessage.messages.push(text);
            }
            else{
                if(recentMessage.messages.length!=0){
                    for(j in recentMessage.messages){
                        let cont=messageCont(recentMessage.messages[j]);
                        $("#mess"+recentMessage.messId).append(cont);
                    }
                }

                if(UserCahtList[i].isFromStaff)
                    mess=message(text,date.substr(11),id);
                else
                    mess=messageReply(text,date.substr(11),id);
                $("#chatBox").append(mess);
                recentMessage={
                    "isFromStaff" :isFromStaff,
                    "messId":id,
                    "time": xdTime,
                    "messages":[text],
                    "day":day
                }
            }
        }
        for(j in recentMessage.messages){
            let cont=messageCont(recentMessage.messages[j]);
            $("#mess"+recentMessage.messId).append(cont);
        }
        if(mode=="default"){
            var objDiv = document.getElementById("chatBox");
            let x=objDiv.scrollHeight
            $('.msg-user-chat.scroll-div').scrollTop(x);
        }
        else if(mode=="update"){
            if(Math.ceil(UserCahtList.length/20)==Math.floor(UserCahtList.length/20)){
                var objDiv = document.getElementById("chatBox");
                let x=objDiv.scrollHeight
                $('.msg-user-chat.scroll-div').scrollTop(x/Math.ceil(UserCahtList.length/20));
            }
        }
        else if(mode=="refresh"){
            
        }
        //add message
        //enable sending message
    }
    setInterval(function(){
        if(UserCahtList!=undefined || UserCahtList.length!=0){
            GetUserNewChate(UserCahtList[UserCahtList.length-1].id)
        }
    },5000);
    $('.msg-user-chat.scroll-div').scroll(function() {
        var wS = $(this).scrollTop();
        if (wS ==0){
            GetUserOtherChats(UserCahtList[0].id);
        }
     });
    function postMessage(text){
        $.ajax(`${baseUrl}/Chat/${enabelMessageId}/Message`, {
            data: JSON.stringify({"text": text}),
            type: "POST",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                let mess=newMessage(text,"now");
                $("#chatBox").append(mess);
                $("#messundefined")
                var objDiv = document.getElementById("chatBox");
                let x=objDiv.scrollHeight
                $('.msg-user-chat.scroll-div').scrollTop(x);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function message(text,date,id){
        return (
            '<div id="c'+id+'" class="media chat-messages"> <div class="media-body chat-menu-content"> <div class="" id="mess'+id+'">  </div> <p class="chat-time">'+date+'</p> </div> </div>'
        );
    }
    function messageReply(text,date,id){
        return (
            '<div id="c'+id+'" class="media chat-messages"> <div class="media-body chat-menu-reply"> <div class="" id="mess'+id+'">  </div> <p class="chat-time">'+date+'</p> </div> </div>'
        );
    }
    function messageCont(text){
        return '<p class="chat-cont">'+text+'</p>';
    }
    function newMessage(text,date,id){
        return (
            '<div id="c'+id+'" class="media chat-messages"> <div class="media-body chat-menu-content"> <div class="" id="mess'+id+'"> <p class="chat-cont">'+text+'</p> </div> <p class="chat-time">'+date+'</p> </div> </div>'
        );
    }
    $('.btn-msg-send').click(function(){
        let text=$("#cahtContent").val();
        if(text=="")
            return;
        $("#cahtContent").val("");
        postMessage(text);
    });


    //notification
    let errorMessage;
    function notify(from, align, icon, type, animIn, animOut) {
      $.growl(
        {
          icon: icon,
          title:"",
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