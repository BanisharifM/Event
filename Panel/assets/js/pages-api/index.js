$(document).ready(function(){

    var starting=true;
    var token = localStorage.getItem("token");
    var refreshToken = localStorage.getItem("refreshToken");
    if(token==""||token==null||refreshToken==""||refreshToken==null)
        window.location="signin.html"; 
    baseUrl=localStorage.getItem("baseUrl");
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
    

    let allReports;
    GetReport();

    // let callenderList;
    // var nextWeekCount=0;
    
    // let days=["شنبه","یکشنبه","دو شنبه","سه شنبه","چهار شنبه","پنج شنبه","جمعه"]
    // GetStudentAlert("default");
    
    // function AddCallender(){
    //     $('#callender').empty();
    //     // callenderList.reverse()
    //     for(i in callenderList){
    //         let tr=createCallenderTr(callenderList[i],"Callender",days[i]);
    //         let id=callenderList[i].id;
    //         $('#callender').append(tr);
    //         addActionCallender("Callender"+id);
    //     }
    // }

    // function createCallenderTr(person,type,day,date){
    //     return(
    //         '<tr id="tr'+type+person.id+'" >'+
    //             '<td>'+callenderDay(person.id,type,day)+'</td>'+
    //             '<td>'+callenderDate(person.id,type,person.date.substring(0,10))+'</td>'+
    //             '<td>'+callenderTitle(person.id,type,person.title)+'</td>'+
    //             '<td>'+callenderDetail(person.id,type,person.text)+'</td>'+
    //             '<td>'+callenderToolbar(person.id,type)+'</td>'+
    //         '</tr>'
    //     );
    // }
    // function callenderDay(id,type,firstName){
    //     return(
    //         '<h6 id="informationFirstName'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+firstName+'</h6>'+
    //         '<input id="informationInp'+type+id+'" type="text" value="'+firstName+'" objectId="'+type+id+'" style="display:none" > '
            
    //     );
    // }
    // function callenderDate(id,type,code,phoneNumber){
    //     return(
    //         '<span  id="date'+type+id+'" class="pie_1" objectId="'+type+id+'" style="color:black"> '+code+'</span>'+
    //         '<input id="dateInp'+type+id+'" type="number" dir="ltr" value="'+code+'" objectId="'+type+id+'" style="display:none" >'
    //     );
    // }
    // function callenderTitle(id,type,title){
    //     return(
    //         '<h6 id="title'+type+id+'" class="m-0" objectId="'+type+id+'" > '+title+'</h6>'+
    //         '<input id="titleInp'+type+id+'" type="text" value="'+title+'" objectId="'+type+id+'" style="display:none" >'
    //     );
    // }
    // function callenderDetail(id,type,detail){
    //     return(
    //         '<span id="informationText'+type+id+'" class="text-c-green" objectId="'+type+id+'" >'+detail+'</span>'+
    //         '<textarea id="informationTextInp'+type+id+'" rows="2" cols="20" type="text" objectId="'+type+id+'" style="display:none" >'+detail+'</textarea>'
    //     );
    // }
    // function callenderToolbar(id,type){
    //     return(
    //         '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn- text-primary label text-white" objectId="'+type+id+'" style="margin-right:16px;"></i>'+
    //         '<i id="toolbarDelete'+type+id+'" class="fas fa-times btn- text-danger label text-white" objectId="'+type+id+'" style="display:none;font-size:16px;"></i>'+
    //         '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle text-success btn- label text-white" objectId="'+type+id+'" style="display:none;font-size:18px;"></i>'+
    //         '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn- text-danger label text-white" objectId="'+type+id+'" style="display:none;font-size:18px;"></i>'
    //     );
    // }
    // function callenderEditClick(){
    //     let objectId=$(this).attr('objectId');
    //     let id=objectId.match(/\d+/)[0];
    //     let type=objectId.replace(id, "");
    //     $("#informationTextInp"+objectId).val($("#informationText"+objectId).text());
    //     $("#titleInp"+objectId).val($("#title"+objectId).text());
    //     enableEditCallender(objectId);
    // }
    // function callenderDeleteClick(){
    //     let objectId=$(this).attr('objectId');
    //     let id=objectId.match(/\d+/)[0];
    //     let type=objectId.replace(id, "");
    //     if(!confirm("آیا مطمئن  هستید حذف شود؟"))
    //         return;
    //     DeleteStudentAlert(id);
    // }
    // function callenderSaveClick(){
    //     let objectId=$(this).attr('objectId');
    //     let id=objectId.match(/\d+/)[0];
    //     let type=objectId.replace(id, "");
    //     let recentCall=callenderList.find(x => x.id==id);
    //     let text=$("#informationTextInp"+objectId).val()=="null" ? " " :   $("#informationTextInp"+objectId).val();
    //     let title=$("#titleInp"+objectId).val()=="null" ? " " :   $("#titleInp"+objectId).val();

    //     datas={
    //         "text": text,
    //         "title": title,
    //         "dateTime": recentCall.date
    //     }
    //     PutStudentAlert(datas,id,objectId);
    // }
    // function callenderCancelClick(){
    //     let objectId=$(this).attr('objectId');
    //     let id=objectId.match(/\d+/)[0];
    //     let type=objectId.replace(id, "");
    //     disableEditCallender(objectId);
    // }

    // function addActionCallender(objectId){
    //     document.getElementById('toolbarEdit'+objectId).onclick = callenderEditClick;
    //     document.getElementById('toolbarDelete'+objectId).onclick = callenderDeleteClick;
    //     document.getElementById('toolbarSave'+objectId).onclick = callenderSaveClick;
    //     document.getElementById('toolbarCancel'+objectId).onclick = callenderCancelClick;

    // }
    // function enableEditCallender(objectId){

    //     $('#toolbarEdit'+objectId).hide();
    //     $('#toolbarSave'+objectId).show();

    //     // $('#toolbarDelete'+objectId).hide();
    //     $('#toolbarCancel'+objectId).show();  
        
    //     $('#informationText'+objectId).hide();
    //     $('#informationTextInp'+objectId).show();
        
    //     $('#title'+objectId).hide();
    //     $('#titleInp'+objectId).show();

    // }
    // function disableEditCallender(objectId){
    //     $('#toolbarEdit'+objectId).show();
    //     $('#toolbarSave'+objectId).hide();

    //     // $('#toolbarDelete'+objectId).show();
    //     $('#toolbarCancel'+objectId).hide(); 

    //     $('#informationText'+objectId).show();
    //     $('#informationTextInp'+objectId).hide(); 

    //     $('#title'+objectId).show();
    //     $('#titleInp'+objectId).hide();   
        
    // }

    // function GetStudentAlert(mode){
    //     let  vvv=nextWeekCount;
    //     if(mode=="previous")
    //         vvv=nextWeekCount-1;
    //     else if(mode=="next")
    //         vvv=nextWeekCount+1;

    //     $.ajax(`${baseUrl}/Calendar?nextWeekCount=${vvv}`, {
    //         type: "GET",
    //         processData: false,
    //         contentType: "application/json",
    //         headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
    //         success: function(res) {
    //             callenderList=res;
    //             nextWeekCount=vvv;
    //             AddCallender();                
    //         },
    //         error: function(jqXHR, textStatus, errorThrown,error) {
    //             // set errorMessage
    //             var err = eval("(" + jqXHR.responseText + ")");
    //             errorMessage=err.Message;
    //              $("#errorNotification").trigger( "click" );
    //         }
    //     });
    // }
    // function PutStudentAlert(data,calendarId,objectId){
    //     $.ajax(`${baseUrl}/Calendar/${calendarId}`, {
    //         data: JSON.stringify(data),
    //         type: "PUT",
    //         processData: false,
    //         contentType: "application/json",
    //         headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
    //         success: function(res) {
    //             errorMessage="با موفقیت ویرایش شد .";
    //             $("#successNotification").trigger( "click" );
    //             GetStudentAlert("default");
    //             disableEditCallender(objectId);                
    //         },
    //         error: function(jqXHR, textStatus, errorThrown,error) {
    //             // set errorMessage
    //             var err = eval("(" + jqXHR.responseText + ")");
    //             errorMessage=err.Message;
    //         $("#errorNotification").trigger( "click" );
    //         }
    //     });
    // }

    // $("#previous").click(function(){
    //     GetStudentAlert("previous");
    // })
    // $("#next").click(function(){
    //     GetStudentAlert("next");
    // })


    let sections;
    GetSection();
    
    let Students;

    let grades;
    let classes;
    let courses;
    
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
    function GetGrade(sectionId){
        $.ajax(`${baseUrl}/Section/${sectionId}/Grade`, {
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
                errorMessage=err.Message;
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
            url: `${baseUrl}/Course`,
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
                errorMessage=err.Message;
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
            url: `${baseUrl}/Class`,
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
                errorMessage=err.Message;
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

    function AddReports(){
        for(i in allReports){
            let id=allReports[i].id;
            let name=allReports[i].name;
            let parameters=allReports[i].parameters;
            let type="Report";

            let li=reportLi(id,type,name,"v-pills-");
            $("#v-pills-tab").append(li);

            let content=reportContent(id,type);
            $("#v-pills-tabContent").append(content);

            for(j in parameters){
                let paramId=parameters[j].id;
                let paramName=parameters[j].name;
                let paramType="ReportNav";
                let Navtype=parameters[j].type;
                let NaveItem,activateId;
                switch (Navtype) {
                  case "String":{
                      NaveItem = reportText(id,paramId, paramType, paramName);
                      $("#v-pills-nav-"+type+id).append(NaveItem);
                  }
                    break;
                  case "Number":{
                      NaveItem = reportNumber(id,paramId, paramType, paramName);
                      $("#v-pills-nav-"+type+id).append(NaveItem);
                  }
                    break;
                  case "DateTime":{
                      NaveItem = reporteDate(id,paramId, paramType, paramName);
                      $("#v-pills-nav-"+type+id).append(NaveItem);
                  }
                    break;
                  case "Grade":{
                      NaveItem = reportGrade(id,paramId, paramType, paramName);
                      $("#v-pills-nav-"+type+id).append(NaveItem);
                      activateId=id+"gradeBtn"+paramType+paramId;
                    document.getElementById(activateId).onclick=gradeBtnClick;
                  }
                    break;
                  case "Class":{
                    NaveItem = reportClass(id,paramId, paramType, paramName);
                    $("#v-pills-nav-"+type+id).append(NaveItem);
                    activateId=id+"classBtn"+paramType+paramId;
                    document.getElementById(activateId).onclick=classBtnClick;
                }
                    break;
                  case "Course":{
                    NaveItem = reportCourse(id,paramId, paramType, paramName);
                    $("#v-pills-nav-"+type+id).append(NaveItem);
                    activateId=id+"courseBtn"+paramType+paramId;
                    document.getElementById(activateId).onclick=courseBtnClick;
                }
                    break;
                  case "Student":{
                    NaveItem = reportStudent(id,paramId, paramType, paramName);
                    $("#v-pills-nav-"+type+id).append(NaveItem);
                    activateId=id+"studentBtn"+paramType+paramId;
                    document.getElementById(activateId).onclick=studentBtnClick;
                }
                    break;
                  case "Section":{
                    NaveItem = reportSection(id,paramId, paramType, paramName);
                    $("#v-pills-nav-"+type+id).append(NaveItem);
                    activateId=id+"sectionBtn"+paramType+paramId;
                    document.getElementById(activateId).onclick=sectionBtnClick;
                }
                    break;
                  default:
                    NaveItem = reportText(id,paramId, paramType, paramName);
                }
            }
            let downloadBtn=reportDownlodBtn(id,type);
            $("#v-pills-"+type+id).append(downloadBtn);  
            document.getElementById("download"+type+id).onclick=downloadBtnClick;   
            reportsParam[id]=JSON.parse(JSON.stringify(sampleParam));

            if(i==0){
                $("#v-pills-settings-tab"+type+id).addClass("active");
                $("#v-pills-"+type+id).addClass("show active");
                
            }
        }
    }


    function reporteDate(fatherId,id,type,name){
        return (
            '<div class="col-sm-3" >'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<input id="'+fatherId+'dateInp'+type+id+'" type="text" dir="ltr" objectId="'+type+id+'" placeholder="'+name+'" class="form-control autonumber" style="border: 1px solid #6c757d !important;background-color: inherit;">'+
            '</div>'
        );
    }
    function reportNumber(fatherId,id,type,name){
        return (
            '<div class="col-sm-3" >'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<input id="'+fatherId+'numberInp'+type+id+'" type="number" objectId="'+type+id+'" placeholder="'+name+'"  class="form-control autonumber" style="border: 1px solid #6c757d !important;background-color: inherit;">'+
            '</div>'
        );
    }
    function reportText(fatherId,id,type,name){
        return (
            '<div class="col-sm-3" >'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<input id="'+fatherId+'textInp'+type+id+'" type="text" objectId="'+type+id+'" placeholder="'+name+'" class="form-control autonumber" style="border: 1px solid #6c757d !important;background-color: inherit;">'+
            '</div>'
        );
    }
    function reportSection(fatherId,id,type,name){
        return (
            '<div class="col-sm-3">'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<button id="'+fatherId+'sectionBtn'+type+id+'" type="button" class="btn btn-outline-secondary" objectId="'+type+id+'" style="width: 90%;">مقطع </button>'+
            '</div>'
        );
    }
    function reportGrade(fatherId,id,type,name){
        return (
            '<div class="col-sm-3">'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<button id="'+fatherId+'gradeBtn'+type+id+'" type="button" class="btn btn-outline-secondary" objectId="'+type+id+'" style="width: 90%;">پایه </button>'+
            '</div>'
        );
    }
    function reportClass(fatherId,id,type,name){
        return (
            '<div class="col-sm-3">'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<button id="'+fatherId+'classBtn'+type+id+'" type="button" class="btn btn-outline-secondary" objectId="'+type+id+'" style="width: 90%;">کلاس </button>'+
            '</div>'
        );
    }
    function reportCourse(fatherId,id,type,name){
        return (
            '<div class="col-sm-3">'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<button id="'+fatherId+'courseBtn'+type+id+'" type="button" class="btn btn-outline-secondary" objectId="'+type+id+'" style="width: 90%;">درس </button>'+
            '</div>'
        );
    }
    function reportStudent(fatherId,id,type,name){
        return (
            '<div class="col-sm-3">'+
                '<label style="visibility:hidden;">'+name+'</label>'+
                '<button id="'+fatherId+'studentBtn'+type+id+'" type="button" class="btn btn-outline-secondary" objectId="'+type+id+'" style="width: 90%;">دانش آموز </button>'+
            '</div>'
        );
    }
    function reportDownlodBtn(id,type){
        return '<button type="button" id="download'+type+id+'" class="btn btn-primary btn-icon m-0" data-toggle="tooltip" data-placement="top" title="دانلود" style="float:left;padding: 10px 0px;position:relative;left:30px;bottom:20px;"> <i class="fas fa-cloud-download-alt" style="font-size: 20px;"></i> </button>';
    }

    function reportLi(id,type,name,href){
        return '<li><a class="nav-link align-right-imp" id="v-pills-settings-tab'+type+id+'" data-toggle="pill" href="#'+href+type+id+'" role="tab" aria-controls="v-pills-settings" aria-selected="false">'+name+'</a></li>'
    }

    function reportContent(id,type){
        return '<div class="tab-pane fade" id="v-pills-'+type+id+'" role="tabpanel" aria-labelledby="v-pills-settings-tab"> <div class="col-xl-12 col-md-12 filter-bar m-b-40 "> <nav class="navbar m-b-30 p-10 border border-info" id="v-pills-nav-'+type+id+'"> </nav> </div> </div>'
    }

    let modalClicked={
        "fatherId":false,
        "param":false,
        "id": false,
        "type" : false
    }
    let reportsParam={}
    let sampleParam={
        "parameters": []
    };
    function gradeBtnClick(){
        let fatherId=$(this).attr('id').replace(/(^\d+)(.+$)/i,'$1');
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $("#opt1").show();
        $("#opt2").show();
        $("#opt3").hide();
        $("#opt4").hide();
        modalClicked.fatherId=fatherId;
        modalClicked.id=id;
        modalClicked.type=type;
        modalClicked.param="Grade";
        $('#showAllClass').trigger( "click" );
    }
    function sectionBtnClick(){
        let fatherId=$(this).attr('id').replace(/(^\d+)(.+$)/i,'$1');
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $("#opt1").show();
        $("#opt2").hide();
        $("#opt3").hide();
        $("#opt4").hide();
        modalClicked.fatherId=fatherId;
        modalClicked.id=id;
        modalClicked.type=type;
        modalClicked.param="Section";
        $('#showAllClass').trigger( "click" );
    }
    function classBtnClick(){
        let fatherId=$(this).attr('id').replace(/(^\d+)(.+$)/i,'$1');
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $("#opt1").show();
        $("#opt2").show();
        $("#opt3").show();
        $("#opt4").hide();
        modalClicked.fatherId=fatherId;
        modalClicked.id=id;
        modalClicked.type=type;
        modalClicked.param="Class";
        $('#showAllClass').trigger( "click" );
    }
    function courseBtnClick(){
        let fatherId=$(this).attr('id').replace(/(^\d+)(.+$)/i,'$1');
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $("#opt1").show();
        $("#opt2").show();
        $("#opt3").hide();
        $("#opt4").show();
        modalClicked.fatherId=fatherId;
        modalClicked.id=id;
        modalClicked.type=type;
        modalClicked.param="Course";
        $('#showAllClass').trigger( "click" );
    }
    function downloadBtnClick(){
        let objectId=$(this).attr('id');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let recentReportParams=allReports.find(x => x.id==id).parameters;
        for(i in recentReportParams){
            let parameter=recentReportParams[i];
            if(parameter.type=="String"){
                reportsParam[id].parameters.push({
                    "parameterId": parameter.id,
                    "parameterValue": $("#"+id+"textInpReportNav"+parameter.id).val(),
                })
            }
            else if(parameter.type=="DateTime"){
                reportsParam[id].parameters.push({
                    "parameterId": parameter.id,
                    "parameterValue": $("#"+id+"dateInpReportNav"+parameter.id).val(),
                })
            }
            else if(parameter.type=="Number"){
                reportsParam[id].parameters.push({
                    "parameterId": parameter.id,
                    "parameterValue": $("#"+id+"numberInpReportNav"+parameter.id).val(),
                })
            }
        }
        let datas={"Parameters": reportsParam[id].parameters}
        PostReport(id,datas);
    }
    function studentBtnClick(){
        let fatherId=$(this).attr('id').replace(/(^\d+)(.+$)/i,'$1');
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $("#opt1").show();
        $("#opt2").show();
        $("#opt3").show();
        $("#opt4").hide();
        modalClicked.fatherId=fatherId;
        modalClicked.id=id;
        modalClicked.type=type;
        modalClicked.param="Student";
        $("#StudentsListFilter").show();

        $('#showAllClass').trigger( "click" );
    }
    $("#addClassButton").click(function(){
        $("#closeModal2").click();
        let mode=modalClicked.param;
        let fatherId=modalClicked.fatherId;
        let id=modalClicked.id;
        let type=modalClicked.type;
        if(mode=="Grade"){
            let x=filterNav["Students"].gradeName;
            $("#"+fatherId+"gradeBtnReportNav"+id).text(x);
            reportsParam[fatherId].parameters.push({
                "parameterId": id,
                "parameterValue": filterNav["Students"].gradeId,
            })
        }
        else if(mode=="Section"){
            let x=filterNav["Students"].sectionName;
            $("#"+fatherId+"sectionBtnReportNav"+id).text(x);
            reportsParam[fatherId].parameters.push({
                "parameterId": id,
                "parameterValue": filterNav["Students"].sectionId,
            })
        }
        else if(mode=="Course"){
            let x=filterNav["Students"].courseName;
            $("#"+fatherId+"courseBtnReportNav"+id).text(x);
            reportsParam[fatherId].parameters.push({
                "parameterId": id,
                "parameterValue": filterNav["Students"].courseId,
            })
        }
        else if(mode=="Class"){
            let x=filterNav["Students"].className;
            $("#"+fatherId+"classBtnReportNav"+id).text(x.replace("کلاس",""));
            reportsParam[fatherId].parameters.push({
                "parameterId": id,
                "parameterValue": filterNav["Students"].classId,
            })
        }
    });

    $("#StudentsListFilter").click(function(){
        if(filterNav["Students"].status==false)
           return;
        filterNav["Students"].isFilter=true;
        GetAllStudent();
    });
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
            $('#StudentsList').append(tr);
            addAction('Students'+id);
        }
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
    function addAction(objectId){
        document.getElementById('tr'+objectId).onclick = startChat;
    }
    function startChat(){
        $("#StudentsListFilter").hide();
        $('#StudentsList').empty();
        $("#closeModal2").click();
        let objectId=$(this).attr('objectId');
        let studentId=objectId.match(/\d+/)[0];
        let type=objectId.replace(studentId, "");
        let recentStudent=Students.find(y => y.id==studentId);
        let x=recentStudent.firstName+" "+recentStudent.lastName;
        let id=modalClicked.id;        
        let fatherId=modalClicked.fatherId;
        $("#"+fatherId+"studentBtnReportNav"+id).text(x);
        reportsParam[fatherId].parameters.push({
            "parameterId": id,
            "parameterValue": recentStudent.id,
        })
    }

    function GetReport(mode){
        $.ajax(`${baseUrl}/Report`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                allReports=res;
                AddReports();
                // AddCallender();                
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PostReport(reportId,datas){
        $.ajax(`${baseUrl}/Report/${reportId}`, {
            data: JSON.stringify(datas),
            type: "POST",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(request) {
                a = document.createElement('a');
                a.href = window.URL.createObjectURL(xhttp.response);
                // Give filename you wish to download
                a.download = "test-file.xls";
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );

            }
        });
    }

    let schoolEditMode="default",uploadedFile,SchoolInformation;    
    GetSchoolInformation();

    function AddSchoolInformation(){
        $("#schoolName").text(SchoolInformation.name);
        $("#schoolDetail").text(SchoolInformation.text);
        $("#imageUrl").attr('src',SchoolInformation.imageUrl);
    }
    document.getElementById('imageUrl').addEventListener('click', () => {
        if(schoolEditMode=="edit"){
            document.getElementById('imageUrlInp').click()                
        }
    })
    document.getElementById('imageUrlInp').onchange = imageUrlChange;

    function imageUrlChange(){
        uploadedFile=event.target.files[0];
        $("#imageUrl").attr('src', URL.createObjectURL(uploadedFile));
    }
    function enableEditSchool(){
        $("#schoolNameInp").val($("#schoolName").text());
        $("#schoolDetailInp").val($("#schoolDetail").text());

        $("#editSchoolIcon").hide();
        $("#saveSchoolIcon").show();
        $("#cancelSchoolIcon").show();
        

        $("#schoolName").hide();
        $("#schoolNameInp").css("display","block");
        
        $("#schoolDetail").hide();
        $("#schoolDetailInp").css("display","block");
    }
    function disableEditSchool(){

        let name=$("#schoolNameInp").val();
        let detail=$("#schoolDetailInp").val();


        $("#editSchoolIcon").show();
        $("#saveSchoolIcon").hide();
        $("#cancelSchoolIcon ").hide();

        $("#schoolName").show();
        $("#schoolNameInp").hide();
        
        $("#schoolDetail").show();
        $("#schoolDetailInp").hide()
    }
    $("#editSchoolIcon").click(function(){
        if(schoolEditMode=="default"){
            schoolEditMode="edit"
            $("#schoolNameInp").val($("#schoolName").text());
            $("#schoolDetailInp").val($("#schoolDetail").text());
            enableEditSchool();
        }
    });
    $("#saveSchoolIcon").click(function(){
        if(schoolEditMode=="edit"){
            if($("#imageUrl").attr('src')!=SchoolInformation.imageUrl)
                PutAvatar(SchoolInformation.id);
            let name=$("#schoolNameInp").val();
            let text=$("#schoolDetailInp").val();
            if(name!=SchoolInformation.name||text!=SchoolInformation.text){
                let datas={
                    "name" :name ,
                    "text": text,
                }
                PutSchoolInformation(SchoolInformation.id,datas);
            }
            else{
                schoolEditMode="default";
                disableEditSchool();
            }
        }
    });
    $("#cancelSchoolIcon").click(function(){
        if(schoolEditMode=="edit"){
            schoolEditMode="default"
            $("#imageUrl").attr('src',SchoolInformation.imageUrl);

            disableEditSchool();
        }
    });
    function GetSchoolInformation(){
        $.ajax(`${baseUrl}/School`, {
            type: "GET",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                SchoolInformation=res;
                AddSchoolInformation();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutSchoolInformation(schoolId,datas){
        $.ajax(`${baseUrl}/School/${schoolId}`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت ویرایش شد.";
                $("#successNotification").trigger( "click" );
                schoolEditMode="default";
                $("#schoolName").text($("#schoolNameInp").val());
                $("#schoolDetail").text($("#schoolDetailInp").val());
                disableEditSchool();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutAvatar(schoolId){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/School/${schoolId}/Image`,
            data : {"file":uploadedFile},
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="تصویر به روز شد.";
                uploadedFile=false;
                $("#successNotification").trigger( "click" );
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
