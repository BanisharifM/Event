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


    let industry;
    GetIndustry();

    let Students,darsha;

    let uploadedFile=false;

    const states={
        "Course" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        },
        "Students" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        }
    }
    let pageStatus={
        "Classes" : states["Classes"].DEFUALT,
        "Students" : states["Students"].DEFUALT
    }
    const editCalcoItems={
        raw : {
            status:false,
            imageUrl : false,
            imageDef:false,
            name : false,
            gradeId:false,
            id:false
        }
    };
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

    const rawCourse={
        id:0,
        gradeName : "",
        name: "",
        imageUrl : "",
        teachers : [],
        isEnable : true,
        sampleQuestion: [],
        gradeId: 0
    }

    const filterNav={
        temp :{
            status : false,
            industryName : false,
            industryId : false,
            isFilter: false
        },
        "Students" : {
            status : false,
            industryName : false,
            industryId : false,
            isFilter: false
        }
    }

    const rawStudent={
        id: 0,
        imageUrl:"../assets/images/user/avatar-2.jpg",
        firstName: "", 
        lastName:"", 
        phoneNumber: "",
        detail:"",
        industryName:"",
        industryId:"",
        isActive:true,
    }

    function createIndustryOpt(id,name,type){
        return(
            '<option id="industry'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" industryName="'+name+'" >'+name+'</option>'
        );
    }
    function industryOptClick(){
        
        let objectId=$(this).val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        filterNav[type].industryId=id;
        filterNav[type].industryName=$("#industry"+type+id).attr('industryName');
    }
     
    function createCalcoTr(calco,type,industryName,gradeName,gradeId){
        return(
            '<tr id="tr'+type+calco.id+'" >'+
                '<td>'+calcoImageUrl(calco.id,type,calco.imageUrl)+'</td>'+
                '<td>'+calcoInformation(calco.id,type,calco.name,gradeId)+'</td>'+
                '<td><span id="nationalId'+type+calco.id+'" class="pie_1" objectId="'+type+calco.id+'" > '+industryName+'</span></td>'+
                '<td><h6 id="title'+type+calco.id+'" class="m-0" objectId="'+type+calco.id+'" > '+gradeName+'</h6></td>'+
                '<td>'+calcoToolbar(calco.id,type)+'</td>'+
            '</tr>'
        );
    }

    function calcoImageUrl(id,type,src){
        return(
            '<div id="imageUrl'+type+id+'" >'+
                '<input id="imageUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<img id="imageUrlImg'+type+id+'" class="rounded-circle" key="'+id+'" objectId="'+type+id+'" style="width:40px;" src='+src+' alt="تصویر">'+
            '</div>'
        );
    }
    let CourseSelectImage;
    function calcoImageUrlChange(){
        CourseSelectImage=event.target.files[0];
        let objectId=$(this).attr('objectId');
        editCalcoItems[objectId].imageUrl=CourseSelectImage;
        $("#imageUrlImg"+objectId).attr('src', URL.createObjectURL(CourseSelectImage));
    }

    function calcoInformation(id,type,name,gradeId){
        return(
            '<h6 id="FirstName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'+
            '<input id="informationInp'+type+id+'" type="text" value="'+name+'" gradeId="'+gradeId+'"objectId="'+type+id+'" style="display:none" > '
        );
    }
    function calcoFirstNameChange(){
        let name=$(this).val();
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let gradeId=$(this).attr('gradeId');
        editCalcoItems[objectId].name=name;
        // editCalcoItems[objectId].id=id;
        editCalcoItems[objectId].gradeId=gradeId;
    }

    function calcoToolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn-primary label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-trash-alt btn-danger label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white" objectId="'+type+id+'" style="display:none"></i>'
        );
    }
    function calcoEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");

        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editCalcoItems[objectId].status=true; 
            editCalcoItems[objectId].id=id; 
            enableEditCalco(objectId);
            $("#informationInp"+objectId).val($("#FirstName"+objectId).text())
            if(type=="Course")
                editCalcoItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');
        }
        if(pageStatus[type]==states[type].ADD){
            pageStatus[type]=states[type].ADDED;
            let objectId=$(this).attr('objectId');
            editCalcoItems[objectId].status=true; 
            enableEditCalco(objectId);
        }
    }
    function calcoDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            if(!confirm("آیا مطمئن  هستید حذف شود؟"))
                return;
            if(type=="Course"){
                DeleteCourse(id)
            }
        }
    }
    function calcoSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if (pageStatus[type] == states[type].EDIT) {
          pageStatus[type] = states[type].DEFUALT;

          if(type=="Course"&&editCalcoItems[objectId].imageUrl!=false)
            PutCourseImage(id);

          let gradeId=filterNav[type].gradeId;
          data = {
            name: $("#informationInp"+objectId).val(),
            schoolGradeId: gradeId
          };
          if (type == "Course") {
            PutCourse(data,editCalcoItems[objectId].id );
          }

          editCalcoItems[objectId] = JSON.parse(
            JSON.stringify(editCalcoItems.raw)
          );
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            data = {
                name: editCalcoItems[objectId].name,
                schoolGradeId: filterNav[type].gradeId
              };
              if (type == "Course") {
                PostCourse(data,editCalcoItems[objectId].id);
              }
            editCalcoItems[objectId]=JSON.parse(JSON.stringify(editCalcoItems.raw));
        }        
    }
    function calcoCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            if(type=="Course")
                $("#imageUrlImg"+objectId).attr('src',editCalcoItems[objectId].imageDef);
            disableEditCalco(objectId);
            editCalcoItems[objectId]=JSON.parse(JSON.stringify(editCalcoItems.raw));
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            $('#tr'+objectId).remove();
            editCalcoItems[objectId]=JSON.parse(JSON.stringify(editCalcoItems.raw));;
        }
    }

    $("#addCourse").click(function(){
        if(pageStatus["Course"]==states["Course"].DEFUALT && filterNav["Course"].isFilter){
            pageStatus["Course"]=states["Course"].ADD;
            let tr=createCalcoTr(rawCourse,"Course",filterNav["Course"].industryName,filterNav["Course"].gradeName,filterNav["Course"].gradeId);
            editCalcoItems["Course0"]=JSON.parse(JSON.stringify(rawCourse));
            $("#CourseList").append(tr);
            addActionCalco('Course0');
            $("#toolbarEditCourse0").trigger('click');
        }    
    });

    function addActionCalco(objectId){

        
        if(objectId.includes('Course')){
            document.getElementById('imageUrl'+objectId).addEventListener('click', () => {
                if(editCalcoItems[objectId].status===true){
                    document.getElementById('imageUrlInp'+objectId).click()                
                }
            })
            document.getElementById('imageUrlInp'+objectId).onchange = calcoImageUrlChange;
        }        
        document.getElementById('informationInp'+objectId).onchange = calcoFirstNameChange;
        document.getElementById('toolbarEdit'+objectId).onclick = calcoEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = calcoDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = calcoSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = calcoCancelClick;
    }
    function enableEditCalco(objectId){
        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show(); 

        $('#FirstName'+objectId).hide();
        $('#informationInp'+objectId).show();
    }
    function disableEditCalco(objectId){
        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide(); 

        $('#FirstName'+objectId).show();
        $('#informationInp'+objectId).hide();
    }
    
    $("#StudentsListFilter").click(function(){
        if(filterNav["Students"].status==false)
           return;
        filterNav["Students"].isFilter=true;
        GetAllStudent();
    });

    function createStaffTr(person,type,tit){
        return(
            '<tr id="tr'+type+person.id+'" >'+
            '<td>'+testNomreCheckContent(id,type,person.isValidat)+'</td>'+
                '<td>'+imageUrl(person.id,type,person.avatarUrl)+'</td>'+
                '<td>'+information(person.id,type,person.firstName,person.lastName)+'</td>'+
                '<td>'+phoneNumber(person.id,type,person.phoneNumber)+'</td>'+
                '<td>'+detail(person.id,type,person.text)+'</td>'+
                '<td>'+title(person.id,type,tit)+'</td>'+
                '<td>'+toolbar(person.id,type)+'</td>'+
            '</tr>'
        );
    }
    function testNomreCheckContent(id,type,isValidat){
        let a=(isValidat ? "checked" : "");
        return(
            '<div class="form-group">'+
                '<div class="checkbox checkbox-fill d-inline">'+
                    '<input type="checkbox" name="checkbox-fill-'+type+id+'" id="checkbox-fill-'+type+id+'" objectId="'+type+id+'" '+a+'>'+
                '</div>'+
            '</div>'
        );
    }
    function testNomreCheckChange(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let needsEnable=$(this).prop("checked");
        let gradId=allExamGradeList.find(x => x.studentId==id);
        if(pageStatus[type]==states[type].DEFUALT){
            if(!confirm("آیا مطمئن  هستید تایید شود؟"))
                return;
            EnableExamGradeList(gradId.id,needsEnable)
        }
    }
    function imageUrl(id,type,src){
        return(
            '<div id="imageUrl'+type+id+'" >'+
                '<input id="imageUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<img id="imageUrlImg'+type+id+'" class="rounded-circle" key="'+id+'" objectId="'+type+id+'" style="width:40px;" src="'+src+'" alt="تصویر">'+
            '</div>'
        );
    }
    function imageUrlChange(){
        uploadedFile=event.target.files[0];
        let objectId=$(this).attr('objectId');
        editItems[objectId].imageUrl=uploadedFile;
        $("#imageUrlImg"+objectId).attr('src', URL.createObjectURL(uploadedFile));
    }
    function information(id,type,firstName,lastName){
        return(
            '<h6 id="FirstName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+firstName+'</h6>'+
            '<input id="FirstInp'+type+id+'" type="text" value="'+firstName+'" objectId="'+type+id+'" style="display:none" > '+
            '<h6 id="informationLastName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+lastName+'</h6>'+
            '<input id="informationLastInp'+type+id+'" type="text" value="'+lastName+'" objectId="'+type+id+'" style="display:none" > '
        );
    }
    function firstNameChange(){
        let firstName=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].firstName=firstName;
    }
    function LastNameChange(){
        let lastName=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].lastName=lastName;
    }
    function title(id,type,tit){
        return(
            '<h6 id="title'+type+id+'" class="m-0" objectId="'+type+id+'" > '+tit+'</h6>'
        );
    }
    function phoneNumber(id,type,phoneNumber){
        return(
            '<h6 id="phoneNumber'+type+id+'" class="m-0" dir="ltr" objectId="'+type+id+'" > 0'+phoneNumber+'</h6>'+
            '<input id="phoneNumberInp'+type+id+'" type="text" dir="ltr" value="0'+phoneNumber+'" objectId="'+type+id+'" style="display:none" >'
        );
    }
    function phoneNumberChange(){
        let phoneNumber=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].phoneNumber=phoneNumber;
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
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            let recetnPhoneNumber=$("#phoneNumberStudents"+id).text();
            console.log(recetnPhoneNumber)
            $("#phoneNumberInpStudents"+id).val(recetnPhoneNumber)
            enableEditPerson(objectId,"edit");
            editItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');

        }
        if(pageStatus[type]==states[type].ADD){
            pageStatus[type]=states[type].ADDED;
            editItems[objectId].status=true; 
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
                DeleteStudent(id);
        }
    }
    function personSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        
        if(pageStatus[type]==states[type].EDIT){
            if(editItems[objectId].imageUrl!=false)
                PutAvatar(id);
            recentStudent=Students.find(x => x.id == id)
            data={
                "phoneNumber": $("#phoneNumberInpStudents"+id).val().substring(2)
              }
            PutAllStudent(data,recentStudent.id);            
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            student={
                "classId": filterNav["Students"].classId,
                "phoneNumber": $("#phoneNumberInpStudents"+id).val().substring(1),
                "firstName": editItems[objectId].firstName,
                "lastName": editItems[objectId].lastName,
                "nationalId": editItems[objectId].nationalId,
                "birthday": "2019-09-18T04:31:40.375Z"
            }
            PostStudent(student)
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
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
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            $('#tr'+objectId).remove();
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
        }
    }

    $("#addStudents").click(function(){
        if(pageStatus["Students"]==states["Students"].DEFUALT&& filterNav["Students"].isFilter){
            pageStatus["Students"]=states["Students"].ADD;
            let tr=createStaffTr(rawStudent,"Students",filterNav["Students"].className);
            editItems["Students0"]=JSON.parse(JSON.stringify(rawEditItem));
            $("#StudentsList").append(tr);
            addActionPersons('Students0');
            $("#toolbarEditStudents0").trigger('click');
        }    
    });

    function addActionPersons(objectId){

        // document.getElementById('phoneNumberInp'+objectId).onkeyup = phoneNumberValidate;

        document.getElementById('imageUrl'+objectId).addEventListener('click', () => {
            if(editItems[objectId].status===true){
                document.getElementById('imageUrlInp'+objectId).click()                
            }
        })
        document.getElementById('checkbox-fill-'+objectId).onchange = testNomreCheckChange;   
        document.getElementById('imageUrlInp'+objectId).onchange = imageUrlChange;
        document.getElementById('FirstInp'+objectId).onchange = firstNameChange;
        document.getElementById('informationLastInp'+objectId).onchange = LastNameChange;
        document.getElementById('phoneNumberInp'+objectId).onchange = phoneNumberChange;
        document.getElementById('informationTextInp'+objectId).onchange = detailChange;
        document.getElementById('toolbarEdit'+objectId).onclick = personEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = personDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = personSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = personCancelClick;

    }
    function enableEditPerson(objectId,mode){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show(); 
        
        $('#phoneNumber'+objectId).hide();
        $('#phoneNumberInp'+objectId).show();  
        
        $('#showClass'+objectId).hide();

        if(mode=="add"){
            $('#FirstName'+objectId).hide();
            $('#FirstInp'+objectId).show();
    
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

        
        $('#phoneNumber'+objectId).show();
        $('#phoneNumberInp'+objectId).hide();  
        
    }

    function GetIndustry(){
        $.ajax(`${baseUrl}/industry`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                industry=res;
                AddIndustry();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddIndustry(){
        for(i in industry){
            let id=industry[i].id;
            
            let StudentsOpt=createIndustryOpt(id,industry[i].name,"Students");
            $("#industryStudentsList").append(StudentsOpt);
            document.getElementById('industyStudentsList').onchange = industryOptClick;
        }
    }
    function GetCourse(gradeId){
        $.ajax({
            url: `${baseUrl}/Course`,
            data:{"gradeId":gradeId},
            type: "GET",
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                darsha=res;
                AddCourse();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddCourse(){
        $('#CourseList').empty();
        for(i in darsha){
            if(darsha[i].enable==true)
                continue;
            let tr=createCalcoTr(darsha[i],"Course",filterNav["Course"].industryName,filterNav["Course"].gradeName,filterNav["Course"].gradeId);
            let id=darsha[i].id;
            editCalcoItems["Course"+id]= JSON.parse(JSON.stringify(editCalcoItems.raw));
            $('#CourseList').append(tr);
            addActionCalco('Course'+id);
        }
    }
    function DeleteCourse(courseId){
        $.ajax(`${baseUrl}/Course/${courseId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );  
                GetCourse(filterNav["Course"].gradeId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutCourse(data,id){
        $.ajax(`${baseUrl}/Course/`+id, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetCourse(filterNav["Course"].gradeId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PostCourse(data,id){
        $.ajax(`${baseUrl}/Course`, {
            data: JSON.stringify(data),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetCourse(data.schoolGradeId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutCourseImage(id){
        const datas = new FormData();
        datas.append("file",CourseSelectImage)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/Course/${id}/Image`,
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="تصویر به روز شد.";
                $("#successNotification").trigger( "click" );
                GetCourse(filterNav["Course"].gradeId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage="fg";
            $("#errorNotification").trigger( "click" );
            }
        });
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
            if(Students[i].isEnable==true)
                continue;
            let title=filterNav["Students"].className;
            let tr=createStaffTr(Students[i],"Students", title);
            let id=Students[i].id;
            editItems["Students"+id]= JSON.parse(JSON.stringify(rawEditItem));
            $('#StudentsList').append(tr);
                addActionPersons('Students'+id);
        }
    }
    function DeleteStudent(userId){
        $.ajax(`${baseUrl}/User/${userId}`, {
            data: JSON.stringify({"enable": true}),
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );  
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
    function PutAllStudent(data,id){
        console.log(data)
        $.ajax(`${baseUrl}/user/Student/`+id, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                pageStatus[type]=states[type].DEFUALT;
                editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
                GetAllStudent();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PostStudent(student){
        $.ajax(`${baseUrl}/user/StudentSignup`, {
            data: JSON.stringify(student),
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
                GetAllStudent();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                $("#errorNotification").trigger( "click" );
                GetAllStudent();
            }
        });
    }
    function PutAvatar(id){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/User/${id}/Avatar`,
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

