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


    let sections;
    GetSection();
    GetPayeha();

    let grades;
    let classes;

    let Students,kelasha,darsha,payeha;

    let sampleALert,studentALert;
    GetSampleAlert();

    let uploadedFile=false;

    const states={
        "Paye" :{
            DEFUALT : 'defualt',
            GRADEEDIT : 'gradeEdit',
        },
        "Classes" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        },
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
        "Paye" : states["Paye"].DEFUALT,
        "Classes" : states["Classes"].DEFUALT,
        "Course" : states["Course"].DEFUALT,
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

    const editItemsTuition={
        grades : {
            temp : {
                status: false,
                gradeId: 0,
                gradeName: "",
                gradeTuition: 0,
                sectionId: 0,
                sectionName: 0
            }
        }
    };

    const rawClass={
        id : 0,
        name :"",
        gradeName: '',
        sectionName : "",
        teachers : [],
        Students : [],
        sampleQuestion : [],
        gradeId : 0,
        sectionId : 0,
    }

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
    
    function createGradeTr(grade){
        return(
            '<tr>'+
                '<td><h6 class="mb-1">'+grade.gradeName+'</h6></td>'+
                '<td>'+tuition(grade.gradeId,grade.gradeTuition)+'</td>'+
                '<td>'+gradeToolbar(grade.gradeId)+'</td>'+
            '</tr>'
        );
    }
    
   
    function tuition(id,tuition){
        return(
            '<span id="tuition'+id+'"  Fact="'+tuition+'" class="pie_1">'+tuition.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'</span>'+
            '<input id="tuitionInp'+id+'" type="number" value="'+tuition+'" objectId="'+id+'" name="'+name+'" objectId="'+id+'" style="display:none" > '+
            '<lable>تومان</lable>'
        );
    }
    function tuitionChange(){
        let tuition=$(this).val();
        let objectId=$(this).attr('objectId');
        editItemsTuition.grades[objectId].gradeTuition=tuition;
    }

    function gradeToolbar(id){
        return(
            '<i id="gradeEdit'+id+'" class="fas fa-edit btn-primary label text-white" objectId="'+id+'"></i>'+
            '<i id="gradeSave'+id+'" class="fas fa-check-circle theme-bg btn- label text-white" objectId="'+id+'" style="display:none"></i>'+
            '<i id="gradeCancel'+id+'" class="fas fa-times-circle btn-danger label text-white" objectId="'+id+'" style="display:none"></i>'
        );
    }
    function gradeEditClick(){
        if(pageStatus["Paye"]==states["Paye"].DEFUALT){
            pageStatus["Paye"]=states["Paye"].GRADEEDIT;
            let objectId=$(this).attr('objectId');
            let id=objectId.match(/\d+/)[0];
            let type=objectId.replace(id, "");
            editItemsTuition.grades[objectId].status=true; 
            $("#tuitionInp"+id).val($("#tuition"+id).attr("Fact"))
            enableGradeEdit(objectId);
        }
    }
    function gradeSaveClick(){
        if(pageStatus["Paye"] ==states["Paye"].GRADEEDIT){
            pageStatus["Paye"]=states["Paye"].DEFUALT;
            let objectId=$(this).attr('objectId');
            let id=objectId.match(/\d+/)[0];
            let type=objectId.replace(id, "");
            let paye=payeha.find(x => x.gradeId==id)
            let data={
                "name": paye.gradeName,
                "tuition": $("#tuitionInp"+id).val()
              }
            PutGrade(paye.sectionId,paye.gradeId,data)
            $("#tuition"+id).text($("#tuitionInp"+id).val().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
            disableGradeEdit(objectId);
            editItemsTuition.grades[objectId]=JSON.parse(JSON.stringify(editItemsTuition.grades.temp));
        }
    }
    function gradeCancelClick(){
        if(pageStatus["Paye"]==states["Paye"].GRADEEDIT){
            pageStatus["Paye"]=states["Paye"].DEFUALT;
            objectId=$(this).attr('objectId');
            disableGradeEdit(objectId);
            editItemsTuition.grades[objectId]=JSON.parse(JSON.stringify(editItemsTuition.grades.temp));
        }
    }

    function addActionGrade(objectId){
        document.getElementById('tuitionInp'+objectId).onchange = tuitionChange;
        document.getElementById('gradeEdit'+objectId).onclick = gradeEditClick;
        document.getElementById('gradeSave'+objectId).onclick = gradeSaveClick;
        document.getElementById('gradeCancel'+objectId).onclick = gradeCancelClick;
    }
    function enableGradeEdit(objectId){
        $('#tuition'+objectId).hide();
        $('#tuitionInp'+objectId).show();

        $('#gradeEdit'+objectId).hide();
        $('#gradeSave'+objectId).show();
        $('#gradeCancel'+objectId).show();
    }
    function disableGradeEdit(objectId){
        $('#tuition'+objectId).show();
        $('#tuitionInp'+objectId).hide();

        $('#gradeEdit'+objectId).show();
        $('#gradeSave'+objectId).hide();
        $('#gradeCancel'+objectId).hide();
    }
    function PutGrade(sectionId,gradeId,data){
        $.ajax(`${baseUrl}/Section/${sectionId}/Grade/${gradeId}`, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetPayeha();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
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


    /**
     * FIXME:
     */

     $("#ClassesListFilter").click(function(){
         if(filterNav["Classes"].status==false)
            return;
        filterNav["Classes"].isFilter=true;
        GetClass(filterNav["Classes"].gradeId,"Classes");

     });
     $("#CourseListFilter").click(function(){
        if(filterNav["Course"].status==false)
           return;
        filterNav["Course"].isFilter=true;
        GetCourse(filterNav["Course"].gradeId,"Course")
    });
    function createCalcoTr(calco,type,sectionName,gradeName,gradeId){
        return(
            '<tr id="tr'+type+calco.id+'" >'+
                (type=="Classes"? "" : '<td>'+calcoImageUrl(calco.id,type,calco.imageUrl)+'</td>' )+
                '<td>'+calcoInformation(calco.id,type,calco.name,gradeId)+'</td>'+
                '<td><span id="nationalId'+type+calco.id+'" class="pie_1" objectId="'+type+calco.id+'" > '+sectionName+'</span></td>'+
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
    function calcoImageUrlClick(){
        // event.preventDefault();
        let objectId=$(this).find('img').attr('objectId');
        if(editCalcoItems[objectId].status===true){
            editCalcoItems[objectId].status=false;
            event.preventDefault();
            $("#imageUrlInp"+objectId).trigger("click");
        }
        
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
            
            //FIXME: //FIXME:
            if(type=="Classes"){
                 DeleteKelass(id)
                 // EnableKelass(id,true)
            }
            else if(type=="Course"){
                DeleteCourse(id)
                // EnableCourse(id,true)
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
          if (type == "Classes") {
            PutClass(data, editCalcoItems[objectId].id );
          } else if (type == "Course") {
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
              if (type == "Classes") {
                PostClass(data);
              } else if (type == "Course") {
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
            let tr=createCalcoTr(rawCourse,"Course",filterNav["Course"].sectionName,filterNav["Course"].gradeName,filterNav["Course"].gradeId);
            editCalcoItems["Course0"]=JSON.parse(JSON.stringify(rawCourse));
            $("#CourseList").append(tr);
            addActionCalco('Course0');
            $("#toolbarEditCourse0").trigger('click');
        }    
    });
    $("#addClass").click(function(){
        if(pageStatus["Classes"]==states["Classes"].DEFUALT && filterNav["Classes"].isFilter){
            pageStatus["Classes"]=states["Classes"].ADD;
            let tr=createCalcoTr(rawClass,"Classes",filterNav["Classes"].sectionName,filterNav["Classes"].gradeName,filterNav["Course"].gradeId);
            editCalcoItems["Classes0"]=JSON.parse(JSON.stringify(rawClass));
            $("#ClassesList").append(tr);
            addActionCalco('Classes0');
            $("#toolbarEditClasses0").trigger('click');
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
    

    /**
     * FIXME:
     * 
     */

    $("#StudentsListFilter").click(function(){
        if(filterNav["Students"].status==false)
           return;
        filterNav["Students"].isFilter=true;
        GetAllStudent();
    });

    function createStaffTr(person,type,tit){
        return(
            '<tr id="tr'+type+person.id+'" >'+
                '<td>'+imageUrl(person.id,type,person.avatarUrl)+'</td>'+
                '<td>'+information(person.id,type,person.firstName,person.lastName)+'</td>'+
                '<td>'+nationalId(person.id,type,person.nationalId)+'</td>'+
                '<td>'+title(person.id,type,tit)+'</td>'+
                '<td>'+phoneNumber(person.id,type,person.phoneNumber)+'</td>'+
                '<td>'+showClass(person.id,type)+'</td>'+
                '<td>'+toolbar(person.id,type)+'</td>'+
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
    function imageUrlClick(){
        // event.preventDefault();
        let objectId=$(this).find('img').attr('objectId');
        if(editItems[objectId].status===true){
            editItems[objectId].status=false;
            event.preventDefault();
            $("#imageUrlInp"+objectId).trigger("click");
        }
        
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
    
    function nationalId(id,type,code){
        return(
            '<span id="nationalId'+type+id+'" class="pie_1" objectId="'+type+id+'" > '+code+'</span>'+
            '<input id="nationalIdInp'+type+id+'" type="number" value="'+code+'" objectId="'+type+id+'" style="display:none" >'
        );
    }
    function nationalIdChange(){
        let nationalId=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].nationalId=nationalId;
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
    
    function showClass(id,type){
        return(
            '<p id="showClass'+type+id+'" objectId="'+type+id+'" key="'+id+' "class="theme-bg2 label text-white btn- " style="width:max-content;" >مشاهده</p>'
        );
    }
    function showClasslClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        recentStudent=Students.find(x => x.id == id)
        prepareStudentInfo(recentStudent);
        GetStudentAlert(id);
        $('#showStudentsDetail').trigger( "click" );
    }

    function prepareStudentInfo(recentStudent){
        $("#modalAvatar").attr('src',recentStudent.avatarUrl)
        $("#modalStudentName").text(recentStudent.firstName + " "+recentStudent.lastName);
        $("#modalStudentNationalId").text(recentStudent.nationalId);
        $("#modalStudentSection").text(filterNav["Students"].sectionName+"/"+filterNav["Students"].gradeName+"/"+filterNav["Students"].className);
        $("#modalStudentPhoneNumber").text("0"+recentStudent.phoneNumber);
        let paidTuition=recentStudent.paidTuition;
        let totalTuition=recentStudent.totalTuition;
        let progressBarWidth;
        $("#modalStudentTitution").text(paidTuition+" تومان");
        $("#modalStudentTotalTitution").text(totalTuition+ " تومان");

        if(paidTuition==0 || totalTuition==0)
            progressBarWidth=0;
        else
            progressBarWidth=Math.floor(100*paidTuition/totalTuition);
        $("#titutionProgress").css({"width":`${progressBarWidth}%`})
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

    function phoneNumberValidate(e){
        if (this.value.length < 2) {
            this.value = "09";
          } else if (this.value.indexOf("09") !== 0) {
            this.value = "09" + String.fromCharCode(e.which);
          }
    }
    function addActionPersons(objectId){

        // document.getElementById('phoneNumberInp'+objectId).onkeyup = phoneNumberValidate;

        document.getElementById('imageUrl'+objectId).addEventListener('click', () => {
            if(editItems[objectId].status===true){
                document.getElementById('imageUrlInp'+objectId).click()                
            }
        })
        
        document.getElementById('imageUrlInp'+objectId).onchange = imageUrlChange;
        document.getElementById('FirstInp'+objectId).onchange = firstNameChange;
        document.getElementById('informationLastInp'+objectId).onchange = LastNameChange;
        document.getElementById('nationalIdInp'+objectId).onchange = nationalIdChange;
        document.getElementById('phoneNumberInp'+objectId).onchange = phoneNumberChange;
        document.getElementById('toolbarEdit'+objectId).onclick = personEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = personDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = personSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = personCancelClick;
        document.getElementById('showClass'+objectId).onclick = showClasslClick;

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
            let classOpt=createMaghtaOpt(id,sections[i].name,"Classes");
            $("#maghtaClassesList").append(classOpt);
            document.getElementById('maghtaClassesList').onchange = maghtaOptClick;
            
            let StudentsOpt=createMaghtaOpt(id,sections[i].name,"Students");
            $("#maghtaStudentsList").append(StudentsOpt);
            document.getElementById('maghtaStudentsList').onchange = maghtaOptClick;
            
            let courseOpt=createMaghtaOpt(id,sections[i].name,"Course");
            $("#maghtaCourseList").append(courseOpt);
            document.getElementById('maghtaCourseList').onchange = maghtaOptClick;
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
            let tr=createCalcoTr(darsha[i],"Course",filterNav["Course"].sectionName,filterNav["Course"].gradeName,filterNav["Course"].gradeId);
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
    function EnableCourse(courseId,enable){
        $.ajax(`${baseUrl}/Course/${courseId}/Enable`, {
            data: JSON.stringify({ "enable": enable}),
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
            if(classes[i].isEnable==true)
                continue;
            const kelas=classes[i];
            const opt=createClassOpt(kelas.id,kelas.name,type,kelas.sectionId);
            $("#class"+type+"List").append(opt);
            document.getElementById('class'+type+'List').onchange = classOptClick;
        }
    }
    function AddKelass(){
        $('#ClassesList').empty();
        for(i in kelasha){
            if(kelasha[i].enable==true)
                continue;
            let tr=createCalcoTr(kelasha[i],"Classes",filterNav["Classes"].sectionName,filterNav["Classes"].gradeName,filterNav["Classes"].gradeId);
            let id=kelasha[i].id;
            editCalcoItems["Classes"+id]= JSON.parse(JSON.stringify(editCalcoItems.raw));
            $('#ClassesList').append(tr);
            addActionCalco('Classes'+id);
        }
    }
    function DeleteKelass(classId){
        $.ajax(`${baseUrl}/Class/${classId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );  
                GetClass(filterNav["Classes"].gradeId,"Classes");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function EnableKelass(classId,enable){
        $.ajax(`${baseUrl}/Class/${classId}/Enable`, {
            data: JSON.stringify({ "enable": enable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetClass(filterNav["Classes"].gradeId,"Classes");                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutClass(data,id){
        $.ajax(`${baseUrl}/Class/`+id, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetClass(data.schoolGradeId,"Classes");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PostClass(data){
        $.ajax(`${baseUrl}/Class`, {
            data: JSON.stringify(data),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                GetClass(data.schoolGradeId,"Classes");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
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

    function GetPayeha(){
        $.ajax(`${baseUrl}/Student/SectionGrade`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                    payeha=res;
                    AddPayeha();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function AddPayeha(){
        $("#GradeList").empty();        
        for(j in payeha){
            let currentGrade=payeha[j];
            let tr=createGradeTr(currentGrade);
            let id=currentGrade.gradeId;
            editItemsTuition.grades[id]=JSON.parse(JSON.stringify(editItemsTuition.grades.temp));
            $("#GradeList").append(tr);
            addActionGrade(id);
        }
    }

    
    function AddSampletAlert(){
        $("#StudentAlertSelect").empty().prop("disabled", false); 
        $("#StudentAlertSelect").append('<option value="یبس" disabled selected style="display:none;"></option>');
        for(i in sampleALert){
            let id=sampleALert[i].id;
            let StudentsOpt=createAlertOpt(id,sampleALert[i].text,"SampleAlert");
            $("#StudentAlertSelect").append(StudentsOpt);
        }
    }
    function createAlertOpt(id,name,type){
        return(
            '<option id="maghta'+type+id+'" value="'+type+id+'" objectId="'+type+id+'" sectionName="'+name+'" >'+name+'</option>'
        );
    }

    function AddStudentAlert(){
        $('#StudentAlertList').empty();
        for(i in studentALert){
            let tr=createStudentAlertTr(studentALert[i],"StudentAlert");
            let id=studentALert[i].id;
            $('#StudentAlertList').append(tr);
            addActionAlert('StudentAlert'+id);
        }
    }
    function createStudentAlertTr(person,type){
        return(
            '<tr id="tr'+type+person.id+'" >'+
                '<td>'+alertDate(person.id,type,person.creationDate.substring(0,10))+'</td>'+
                '<td>'+alertDetail(person.id,type,person.text)+'</td>'+
                '<td>'+alertToolbar(person.id,type)+'</td>'+
            '</tr>'
        );
    }
    function alertDate(id,type,code){
        return(
            '<span  id="date'+type+id+'" class="pie_1" objectId="'+type+id+'" style="color:black"> '+code+'</span>'+
            '<input id="dateInp'+type+id+'" type="text" dir="ltr" value="'+code+'" objectId="'+type+id+'" style="display:none" >'
        );
    }
    function alertDetail(id,type,detail){
        return(
            '<span id="informationText'+type+id+'" class="pie_1" objectId="'+type+id+'" >'+detail+'</span>'+
            '<textarea id="informationTextInp'+type+id+'" rows="2" cols="20" type="text" objectId="'+type+id+'" style="display:none" >'+detail+'</textarea>'
        );
    }
    function alertToolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn-primary label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-trash-alt btn-danger label text-white" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white" objectId="'+type+id+'" style="display:none"></i>'
        );;
    }
    function alertEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        // recentStaff=staffs.find(x => x.id == id)
        // editItems[objectId].status=true; 
        // setInpVal(objectId,recentStaff.phoneNumber,type=="Teacher"? recentStaff.major:recentStaff.title,recentStaff.text);
        $("#informationTextInp"+objectId).val($("#informationText"+objectId).text());
        enableEditAlert(objectId);
        // editItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');
        
    }
    function alertDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(!confirm("آیا مطمئن  هستید حذف شود؟"))
            return;
        DeleteStudentAlert(id);
    }
    function alertSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        datas={
            text: $("#informationTextInp"+objectId).val()
        }
        PutStudentAlert(datas,id,objectId);
    }
    function alertCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        disableEditAlert(objectId);
    }
    $("#addStudentAlert").click(function(){
        let objectId=$("#StudentAlertSelect").val();
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let text=sampleALert.find(x => x.id==id).text;
        if(text==""||text==undefined){
            alert("لطفا کادر را پر کنید")
        }
        else{
            let datas={
                "text":text
            }
            PostStudentAlert(recentStudent.id,datas);
        }
    });

    function addActionAlert(objectId){
        document.getElementById('toolbarEdit'+objectId).onclick = alertEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = alertDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = alertSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = alertCancelClick;

    }
    function enableEditAlert(objectId){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show();  
        
        $('#informationText'+objectId).hide();
        $('#informationTextInp'+objectId).show();

    }
    function disableEditAlert(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide(); 

        $('#informationText'+objectId).show();
        $('#informationTextInp'+objectId).hide();  
    }


    function GetSampleAlert(){
        $.ajax(`${baseUrl}/SampleAlert`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                sampleALert=res;
                AddSampletAlert();                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    function GetStudentAlert(studentId){
        $.ajax(`${baseUrl}/Student/${studentId}/Alert`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                studentALert=res;
                AddStudentAlert();                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteStudentAlert(alertId){
        $.ajax(`${baseUrl}/Student/Alert/${alertId}`, {
            data: JSON.stringify({"enable": true}),
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="با موفقیت حذف شد .";
                $("#successNotification").trigger( "click" );  
                GetStudentAlert(recentStudent.id);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutStudentAlert(data,alertId,objectId){
        $.ajax(`${baseUrl}/Student/Alert/${alertId}`, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت ویرایش شد .";
                $("#successNotification").trigger( "click" );
                GetStudentAlert(recentStudent.id);
                disableEditAlert()                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    
    function PostStudentAlert(studentId,alert){
        $.ajax(`${baseUrl}/Student/${studentId}/Alert`, {
            data: JSON.stringify(alert),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
                $("#StudentAlertSelect").val("");
                GetStudentAlert(studentId);                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                $("#errorNotification").trigger( "click" );
                GetStudentAlert(studentId);                                
            }
        });
    }

    $("#editTitution").click(function(){
        $(this).hide();
        $("#saveTitution").show();

        $("#modalStudentTitution").hide();
        $("#modalStudentTitutionInp").show().val(recentStudent.paidTuition);

        $("#modalStudentTotalTitution").hide();
        $("#modalStudentTotalTitutionInp").show().val(recentStudent.totalTuition);

    });
    $("#saveTitution").click(function(){
        let paidTuition=$("#modalStudentTitutionInp").val();
        let totalTitution=$("#modalStudentTotalTitutionInp").val();

        if(paidTuition!=recentStudent.paidTuition||totalTitution!=recentStudent.totalTitution){
            datas={
                "phoneNumber":recentStudent.phoneNumber,
                "paidTuition":paidTuition,
                "totalTuition":totalTitution
            }
            PutStudetTitution(recentStudent.id,datas);
        }
        else{
            $("#editTitution").show();
            $("#saveTitution").hide();
    
            $("#modalStudentTitution").show();
            $("#modalStudentTitutionInp").hide();
    
            $("#modalStudentTotalTitution").show();
            $("#modalStudentTotalTitutionInp").hide();
        }
        
    });
    function PutStudetTitution(id,datas){
        $.ajax(`${baseUrl}/User/Student/${id}`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت ویرایش شد .";
                $("#successNotification").trigger( "click" );

                $("#editTitution").show();
                $("#saveTitution").hide();
        
                $("#modalStudentTitution").show();
                $("#modalStudentTitutionInp").hide();
        
                $("#modalStudentTotalTitution").show();
                $("#modalStudentTotalTitutionInp").hide();
                let paidTuition=datas.paidTuition;
                let totalTuition=datas.totalTuition;
                let progressBarWidth;
                $("#modalStudentTitution").text(paidTuition+" تومان");
                $("#modalStudentTotalTitution").text(totalTuition+ " تومان");
        
                if(paidTuition==0 || totalTuition==0)
                    progressBarWidth=0;
                else
                    progressBarWidth=Math.floor(100*paidTuition/totalTuition);
                $("#titutionProgress").css({"width":`${progressBarWidth}%`})

                recentStudent.paidTuition=paidTuition;
                recentStudent.totalTuition=totalTuition;

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
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

