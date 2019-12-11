/**
 * 
 *  Created by MBD
 *  24/7/1398
 */

$(document).ready(function(){

    var starting=true;
    var token = localStorage.getItem("token");
    var refreshToken = localStorage.getItem("refreshToken");
    if(token==""||token==null||refreshToken==""||refreshToken==null)
        window.location="signin.html"; 
    baseUrl=localStorage.getItem("baseUrl");
    let eventId = localStorage.getItem("eventId");
    tokenValidate();

    function tokenValidate(){
        $.ajax(`${baseUrl}/auth/token/check`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'token': token},            
            success: function(res) {
                starting=false;
                if(res.expire<20)        
                    refreshingToken();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                refreshingToken();
            }
        });
    }
    function refreshingToken(){
        $.ajax(`${baseUrl}/auth/token/refresh`, {
            data: JSON.stringify({"refresh_token":refreshToken}),
            type: "POST",
            processData: true,
            contentType: "application/json",           
            success: function(res) {
                token=res.access_token;
                localStorage.setItem('token',token);
                starting=false;
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                window.location="signin.html";                 
            }
        });
    }

    let staffs,staff,recentStaff,staffCorses=[];
    GetAllStaff();

    let sections;
    GetSection();
    
    let grades;
    let classes;
    let courses;

    const states={
        "Staff" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        },
        "Teacher" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        },
    }
    let pageStatus={
        "Staff" : states["Staff"].DEFUALT,
        "Teacher" : states["Teacher"].DEFUALT
    }

    const rawEditItem={
        status:false,
        avatarUrl : "",
        imageDef : "",
        firstName : "",
        lastName:"",
        text : "",
        major:"",
        nationalId : "",
        title : "",
        phoneNumber : ""
    }
    const editItems={};

    let uploadedFile=false;

    const filterNav={
        temp :{
            status : false,
            staffId:false,
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
    const rawSataff={
        id: 0,
        phoneNumber : "",
        firstName : "",
        lastName: "",
        title: "",
        text : "",
        isTeacher : false,
        isStaff :false,
        avatarUrl : '../assets/images/user/avatar-2.jpg',
        nationalId : ""
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
        $("#courseStudentsList").empty().prop("disabled", true); 
        $("#courseStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');
        $("#classStudentsList").empty().prop("disabled", true); 
        $("#classStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');

        GetGrade(id);
    }

    function createPayeOpt(id,name,type,sectionId){
        return(
            '<option id="paye'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" gradeName="'+name+'">'+name+'</option>'            
        );
    }
    function payeOptClick(){
        let objectId=$(this).val();
        console.log(objectId)
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].gradeId=id;
        filterNav[type].gradeName=$("#paye"+type+id).attr('gradeName');
        GetCourse(id);
        GetClass(id);
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
    function createCourseOpt(id,name,type,sectionId){
        return(
            '<option id="course'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" courseName="'+name+'">'+name+'</option>'            
        );
    }
    function courseOptClick(){
        let objectId=$(this).val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].courseId=id;
        filterNav[type].courseName=$("#course"+type+id).attr('courseName');
        filterNav[type].status=true;
    }

    function createStaffTr(person,type){
        return(
            '<tr id="tr'+type+person.id+'" >'+
                '<td>'+imageUrl(person.id,type,person.avatarUrl)+'</td>'+
                '<td>'+information(person.id,type,person.firstName,person.lastName)+'</td>'+
                '<td>'+nationalId(person.id,type,person.nationalId,person.phoneNumber)+'</td>'+
                '<td>'+title(person.id,type,type == "Staff" ? person.title : person.major)+'</td>'+
                '<td>'+detail(person.id,type,person.text)+'</td>'+
                (type=="Staff"? "" : '<td>'+showClass(person.id,type)+'</td>' )+
                '<td>'+toolbar(person.id,type)+'</td>'+
            '</tr>'
        );
    }

    function imageUrl(id,type,src){
        return(
            '<div id="imageUrl'+type+id+'" >'+
                '<input id="imageUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<img id="imageUrlImg'+type+id+'" class="rounded-circle" key="'+id+'" objectId="'+type+id+'" style="width:40px;" src='+src+' alt="تصویر">'+
            '</div>'
        );
    }

    function imageUrlChange(){
        uploadedFile=event.target.files[0];
        let objectId=$(this).attr('objectId');
        editItems[objectId].avatarUrl=uploadedFile;
        $("#imageUrlImg"+objectId).attr('src', URL.createObjectURL(uploadedFile));
    }

    function information(id,type,firstName,lastName){
        return(
            '<h6 id="informationFirstName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+firstName+'</h6>'+
            '<input id="informationInp'+type+id+'" type="text" value="'+firstName+'" objectId="'+type+id+'" style="display:none" > '+
            '<h6 id="informationLastName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+lastName+'</h6>'+
            '<input id="informationLastInp'+type+id+'" type="text" value="'+lastName+'" objectId="'+type+id+'" style="display:none" > '
            
        );
    }
    function firstNameChange(){
        let firstName=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].firstName=firstName;
    }
    function lastNameChange(){
        let lastName=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].lastName=lastName;
    }
    
    function nationalId(id,type,code,phoneNumber){
        return(
            '<p class="m-0" >کدملی :  '+
                '<span  id="nationalId'+type+id+'" class="pie_1" objectId="'+type+id+'" style="color:black"> '+code+'</span>'+
                '<input id="nationalIdInp'+type+id+'" type="number" dir="ltr" value="'+code+'" objectId="'+type+id+'" style="display:none" >'+
            '</p>'+
            '<p class="m-0">شماره موبایل :  '+
                '<span id="phoneNumber'+type+id+'" class="pie_1" objectId="'+type+id+'" style="color:black" > 0'+phoneNumber+'</span>'+
                '<input id="phoneNumberInp'+type+id+'" type="number" dir="ltr" value="0'+phoneNumber+'" objectId="'+type+id+'" style="display:none" >'+
            '</p>'
        );
    }
    function nationalIdChange(){
        let nationalId=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].nationalId=nationalId;
    }

    function detail(id,type,detail){
        return(
            '<span id="informationText'+type+id+'" class="text-c-green" objectId="'+type+id+'" >'+detail+'</span>'+
            '<textarea id="informationTextInp'+type+id+'" rows="2" cols="20" type="text" objectId="'+type+id+'" style="display:none" >'+detail+'</textarea>'
        );
    }
    function detailChange(){
        let detail=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].text=detail;
    }

    function title(id,type,title){
        return(
            '<h6 id="title'+type+id+'" class="m-0" objectId="'+type+id+'" > '+title+'</h6>'+
            '<input id="titleInp'+type+id+'" type="text" value="'+title+'" objectId="'+type+id+'" style="display:none" >'
        );
    }
    function titleChange(){
        let title=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].title=title;
    }

    function phoneNumberChange(){
        let phoneNumber=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].phoneNumber=phoneNumber;
    }
    function showClass(id,type){
        return(
            '<p id="showClass'+type+id+'" objectId="'+type+id+'" key="'+id+' "class="theme-bg2 label text-white btn- " style="width:max-content;" >مشاهده</p>'
        );
    }
    function showClasslClick(){
        let id=$(this).attr('key');
        let teacher=staffs.find(teacher => teacher.id==id);
        GetStaffClass(teacher.id);
        filterNav["Students"].staffId = teacher.id;    
    }

    function addClassModal(){
        $('#classList').empty();
        if (staffCorses.length != 0)
          for (i = 0; i < staffCorses.length; i++) {
            let tr = createClassTr(
              staffCorses[i],
              "Class",
              staffCorses[i].className
            );
            $("#classList").append(tr);
            addActionClass("Class" + staffCorses[i].id);
          }
        $("#showClass").trigger("click");
    }
    function toolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-user-edit btn-primary label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-user-times btn-danger label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white" objectId="'+type+id+'" style="display:none"></i>'
        );
    }
    function personEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        recentStaff=staffs.find(x => x.id == id)
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            setInpVal(objectId,recentStaff.phoneNumber,type=="Teacher"? recentStaff.major:recentStaff.title,recentStaff.text);
            enableEditPerson(objectId,"edit");
            editItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');
        }
        if(pageStatus[type]==states[type].ADD){
            pageStatus[type]=states[type].ADDED;
            editItems[objectId].status=true; 
            setInpVal(objectId,"","","")
            enableEditPerson(objectId,"add");
        }
    }
    function personDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            if(!confirm("آیا مطمئن  هستید حذف شود؟"))
                return;

            let nationalId=$("#nationalIdInp"+objectId).val();
            recentStaff=staffs.find(x => x.nationalId ==nationalId )
            if(!(recentStaff.isTeacher&&recentStaff.isStaff)){
                DeleteStaff(recentStaff.id);
            }
            else{
                staff={
                    "isTeacher": type=="Teacher" ? false : true,
                    "isStaff": type=="Staff" ? false : true,
                    "title":recentStaff.title,
                    "text": recentStaff.text,
                    "major": recentStaff.major,
                    "phoneNumber":recentStaff.phoneNumber ,
                    "password": "1234",
                    "firstName":recentStaff.firstName,
                    "lastName": recentStaff.lastName,
                    "nationalId":recentStaff.nationalId
                };
                PutStaff(staff,recentStaff.id,type)
            }   
        }
    }
    function personSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].EDIT){
            if(editItems[objectId].avatarUrl!=false)
            PutAvatar(id);
            recentStaff=staffs.find(x => x.id == id)
            staff={
                "isTeacher": type=="Teacher" ? true : false,
                "isStaff": type=="Staff" ? true : false,
                "title": type=="Staff" ? $("#titleInpStaff"+id).val() : recentStaff.title ,
                "text": $("#informationTextInp"+objectId).val() ,
                "major": type=="Teacher" ?  $("#titleInpTeacher"+id).val()  : recentStaff.major ,
                "phoneNumber":$("#phoneNumberInp"+objectId).val().substring(1) ,
                "password": "1234",
                "firstName": recentStaff.firstName ,
                "lastName":recentStaff.lastName ,
                "nationalId": recentStaff.nationalId 
            };
            PutStaff(staff,recentStaff.id,type);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
        }
        if(pageStatus[type]==states[type].ADDED){
            let nationalId=$("#nationalIdInp"+objectId).val();
            recentStaff=staffs.find(x => x.nationalId ==nationalId )
            if(recentStaff=== undefined){
                staff={
                    "isTeacher": type=="Teacher" ? true : false,
                    "isStaff": type=="Staff" ? true : false,
                    "title":type=="Teacher" ? "" : $("#titleInp"+objectId).val(),
                    "text":  $("#informationTextInp"+objectId).val(),
                    "major": type=="Teacher" ? $("#titleInp"+objectId).val() : "",
                    "phoneNumber": $("#phoneNumberInp"+objectId).val().substring(1) ,
                    "password": "1234",
                    "firstName": $("#informationInp"+objectId).val(),
                    "lastName":  $("#informationLastInp"+objectId).val(),
                    "nationalId":  $("#nationalIdInp"+objectId).val(),
                };
                // console.log(staff)
                PostStaff(staff,type)
            }
            else if(recentStaff.isEnable==true){
                EnableUser(recentStaff.id,false);
            }
            else {
                staff={
                    "isTeacher": type=="Teacher" ? true : recentStaff.isTeacher,
                    "isStaff": type=="Staff" ? true : recentStaff.isStaff,
                    "title": $("#titleInp"+objectId).val(),
                    "text": recentStaff.text,
                    "major": recentStaff.major ,                    
                    "phoneNumber":recentStaff.phoneNumber ,
                    "password": "1234",
                    "firstName":recentStaff.firstName,
                    "lastName": recentStaff.lastName,
                    "nationalId":recentStaff.nationalId
                };
                PutStaff(staff,recentStaff.id,type)
            }
            
            // disableEditPerson(objectId);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
        }        

    }
    function personCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            disableEditPerson(objectId);
            $("#imageUrlImg"+objectId).attr('src',editItems[objectId].imageDef);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            $('#tr'+objectId).remove();
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
        }
    }

    $("#addStaff").click(function(){
        if(pageStatus["Staff"]==states["Staff"].DEFUALT){
            pageStatus["Staff"]=states["Staff"].ADD;
            let tr=createStaffTr(rawSataff,"Staff");
            editItems["Staff0"]=JSON.parse(JSON.stringify(rawEditItem));
            $("#StaffList").append(tr);
            addActionPersons('Staff0');
            $("#toolbarEditStaff0").trigger('click');
        }    
    });
    $("#addTeacher").click(function(){
        if(pageStatus["Teacher"]==states["Teacher"].DEFUALT){
            pageStatus["Teacher"]=states["Teacher"].ADD;
            let tr=createStaffTr(rawSataff,"Teacher");
            editItems["Teacher0"]=JSON.parse(JSON.stringify(rawEditItem));
            $("#TeacherList").append(tr);
            addActionPersons('Teacher0');
            $("#toolbarEditTeacher0").trigger('click');
        }    
    });
    
    function phoneNumberValidate(e){
        if (this.value.length < 2) {
            this.value = "09";
          } else if (this.value.indexOf("09") !== 0) {
            this.value = "09" + String.fromCharCode(e.which);
          }
    }
    function addActionPersons(objectId){

        document.getElementById('imageUrl'+objectId).addEventListener('click', () => {
            if(editItems[objectId].status===true){
                document.getElementById('imageUrlInp'+objectId).click()                
            }
        })

        // let log = document.getElementById('log');
        // document.addEventListener('keyup', logKey);
        // document.getElementById('phoneNumberInp'+objectId).onkeyup = phoneNumberValidate;

        document.getElementById('imageUrlInp'+objectId).onchange = imageUrlChange;
        document.getElementById('informationInp'+objectId).onchange = firstNameChange;
        document.getElementById('informationLastInp'+objectId).onchange = lastNameChange;
        document.getElementById('informationTextInp'+objectId).onchange = detailChange;
        document.getElementById('nationalIdInp'+objectId).onchange = nationalIdChange;
        document.getElementById('titleInp'+objectId).onchange = titleChange;
        document.getElementById('phoneNumberInp'+objectId).onchange = phoneNumberChange;
        document.getElementById('toolbarEdit'+objectId).onclick = personEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = personDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = personSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = personCancelClick;
        if(objectId.includes('Teacher'))
            document.getElementById('showClass'+objectId).onclick = showClasslClick;

    }
    function enableEditPerson(objectId,mode){
        $('#phoneNumber'+objectId).hide();
        $('#phoneNumberInp'+objectId).show();  

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show();

        $('#title'+objectId).hide();
        $('#titleInp'+objectId).show();

        $('#informationText'+objectId).hide();
        $('#informationTextInp'+objectId).show();

        if(objectId.includes('Teacher'))
            $('#showClass'+objectId).hide();

        if(mode=="add"){

            $('#informationFirstName'+objectId).hide();
            $('#informationInp'+objectId).show();

            $('#informationLastName'+objectId).hide();
            $('#informationLastInp'+objectId).show();

            $('#nationalId'+objectId).hide();
            $('#nationalIdInp'+objectId).show();

        }
    }
        
    function disableEditPerson(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide(); 

        $('#informationFirstName'+objectId).show();
        $('#informationInp'+objectId).hide();

        $('#informationText'+objectId).show();
        $('#informationTextInp'+objectId).hide();

        $('#nationalId'+objectId).show();
        $('#nationalIdInp'+objectId).hide();

        $('#title'+objectId).show();
        $('#titleInp'+objectId).hide();

        $('#phoneNumber'+objectId).show();
        $('#phoneNumberInp'+objectId).hide();  
        
        if(objectId.includes('Teacher'))
            $('#showClass'+objectId).show();
    }

    function setInpVal(objectId,phoneNumber,title,text){
        $('#phoneNumberInp'+objectId).val("0"+phoneNumber); 
        // let title=type=="Teacher"? person.major:person.title; 
        // console.log(person)
        $('#titleInp'+objectId).val(title);
        $('#informationTextInp'+objectId).val(text);        
    }
    function createClassTr(course,type,section){
        return(
            '<tr>'+
                '<td>'+imageUrl(course.id,type,course.courseImageUrl)+'</td>'+
                '<td>'+title(course.id,type,course.courseName)+'</td>'+
                '<td>'+classSection(course.id,type,section)+'</td>'+
                '<td>'+classtoolbar(course.id,type)+'</td>'+
            '</tr>'
        );
    }
    function classSection(id,type,section){
        return(
            '<h6 id="clasaSection'+type+id+'" class="m-0" objectId="'+type+id+'" > '+section+'</h6>'
        );
    }
    function classtoolbar(id,type){
        return(
            '<i id="toolbarDelete'+type+id+'" class="fas fa-user-times btn-danger label text-white" objectId="'+type+id+'"></i>'
        );
    }
    function classDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(!confirm("آیا مطمئن  هستید حذف شود؟"))
            return;
        let staffcorses=staffCorses.find(item => item.id==id)
        DeleteClass(staffcorses.staffId,staffcorses.classId,staffcorses.courseId);
            
    }
    function addActionClass(objectId){
        document.getElementById('toolbarDelete'+objectId).onclick = classDeleteClick;
    }
    function DeleteClass(staffId,classId,courseId){
        $.ajax(`${baseUrl}/event/${eventId}/User/Staff/${staffId}/Class/${classId}/Course/${courseId}`, {
            type: "DELETE",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                $("#closeModal1").click();

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    $("#addClass").click(function(){
        $("#closeModal1").click();
        $('#showAllClass').trigger( "click" );
        
    });
    $("#addClassButton").click(function(){
        let staffId=filterNav["Students"].staffId;
        let classId=filterNav["Students"].classId;
        let courseId=filterNav["Students"].courseId;
        $.ajax(`${baseUrl}/event/${eventId}/User/Staff/${staffId}/Class/${courseId}/Course/${classId}`, {
            data: JSON.stringify(staff),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );                
                $("#closeModal2").click();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
            $("#errorNotification").trigger( "click" );
            }
        });
    });

    function GetAllStaff(){
        $.ajax(`${baseUrl}/event/${eventId}/user/staff?teacher=true&staff=true`, {
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
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddStaff(){
        $('#StaffList').empty();
        $('#TeacherList').empty();
        for(i in staffs){
            if(staffs[i].isEnable==true)
                continue;
            if(staffs[i].isStaff){
                let tr=createStaffTr(staffs[i],"Staff");
                let id=staffs[i].id;
                editItems["Staff"+id]= JSON.parse(JSON.stringify(rawEditItem));
                $('#StaffList').append(tr);
                addActionPersons('Staff'+id);
            }
            if(staffs[i].isTeacher){
                let tr=createStaffTr(staffs[i],"Teacher");
                let id=staffs[i].id;
                editItems["Teacher"+id]=JSON.parse(JSON.stringify(rawEditItem));        
                $('#TeacherList').append(tr);
                addActionPersons('Teacher'+id);
            }
        }
    }
    function PostStaff(staff,type){
        $.ajax(`${baseUrl}/event/${eventId}/user/StaffSignup`, {
            data: JSON.stringify(staff),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                if(uploadedFile!=false){
                    PutAvatar(res.userId)
                }

                GetAllStaff();
                pageStatus[type]=states[type].DEFUALT;
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
            $("#errorNotification").trigger( "click" );

            }
        });
    }
    function PutStaff(staff,id,type){
        $.ajax(`${baseUrl}/event/${eventId}/user/staff/`+id, {
            data: JSON.stringify(staff),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetAllStaff();
                pageStatus[type]=states[type].DEFUALT;
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function EnableUser(id,enable){
        $.ajax(`${baseUrl}/event/${eventId}/User/${id}/Enable`, {
            data: JSON.stringify({"enable": enable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetAllStaff();
                pageStatus[type]=states[type].DEFUALT;
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutAvatar(id){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/event/${eventId}/User/${id}/Avatar`,
            data : {"file":uploadedFile},
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="تصویر به روز شد.";
                uploadedFile=false;
                // $("#successNotification").trigger( "click" );
                // GetAllStaff();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function GetStaffClass(id){
        $.ajax(`${baseUrl}/event/${eventId}/User/Staff/${id}/Class`, {
            // data: JSON.stringify({"teacher":true,"staff":true}),
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                staffCorses=res;
                addClassModal();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteStaff(userId){
        //FIXME:
        $.ajax(`${baseUrl}/event/${eventId}/User/${userId}`, {
            data: JSON.stringify({"enable": true}),
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );  
                GetAllStaff();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    function GetSection(){
        $.ajax(`${baseUrl}/event/${eventId}/Section`, {
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
                errorMessage=err.msg
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
    function GetGrade(sectionId){
        $.ajax(`${baseUrl}/event/${eventId}/Section/${sectionId}/Grade`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                grades=res;
                AddGrade();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddGrade(typ){
        $("#payeStudentsList").empty().prop("disabled", false); 
        $("#payeStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in grades){
            const paye=grades[i];
            let opt=createPayeOpt(paye.id,paye.name,"Students",paye.sectionId);
            $("#payeStudentsList").append(opt);
            document.getElementById('payeStudentsList').onchange = payeOptClick;
        }
    }
    function GetCourse(gradeId){
        $.ajax({
            url: `${baseUrl}/event/${eventId}/Course`,
            data:{"gradeId":gradeId},
            type: "GET",
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                courses=res;
                AddCourse();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddCourse(){
        $("#courseStudentsList").empty().prop("disabled", false); 
        $("#courseStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in courses){
            const kelas=courses[i];
            const opt=createCourseOpt(kelas.id,kelas.name,"Students",kelas.sectionId);
            $("#courseStudentsList").append(opt);
            document.getElementById('courseStudentsList').onchange = courseOptClick;
        }
    }
    function GetClass(gradeId){
        $.ajax({
            url: `${baseUrl}/event/${eventId}/Class`,
            data:{"gradeId":gradeId},
            type: "GET",
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                classes=res;
                AddClass();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.msg
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddClass(){
        $("#classStudentsList").empty().prop("disabled", false); 
        $("#classStudentsList").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in classes){
            const kelas=classes[i];
            const opt=createClassOpt(kelas.id,kelas.name,"Students",kelas.sectionId);
            $("#classStudentsList").append(opt);
            document.getElementById('classStudentsList').onchange = classOptClick;
        }
    }

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

//FIXME:  delete staff class didnt work
//FIXME:  edit staff