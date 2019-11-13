$(document).ready(function(){

    var baseUrl=localStorage.getItem("baseUrl");
    
    let token = localStorage.getItem("token");

    var isManager=localStorage.getItem("isManager");
    isManager=JSON.parse(isManager); 
    
    if(isManager==false){
        $(".main-body").empty();
        token="";
        setTimeout(() => {
            alert("دسترسی برای شما وجود ندارد .")
            window.location="index.html"
        }, 100); 
    }

   

    let allClass;
    GetALlClass();

    let allCourse;
    // GetALlCourse();

    let allExam;
    // GetExam();

    let allNemuneSoal;
    // GetNemuneSoal();

    let allOnlineExam;
    // GetOnlineExam();

    let allExamGrade;
    // GetExamGrade();
    
    let recentExamGrade={
        id:0
    };

    let allExamGradeList;
    // GetExamGradeList();


    const states={
        "TestDate" :{
            DEFUALT : 'defualt',
            EDIT : 'edit'
        },
        "TestNomre" :{
            DEFUALT : 'defualt',
            EDIT : 'edit'
        },
        "TestNomreList" :{
            DEFUALT : 'defualt',
            EDIT : 'edit'
        },
        "Azmoon":{
            DEFUALT : 'defualt',
            EDIT : 'edit'
        },
    }
    let pageStatus={
        "TestDate" : states["TestDate"].DEFUALT,
        "TestNomreList" : states["TestNomreList"].DEFUALT,
        "Azmoon":states["Azmoon"].DEFUALT,
    }

    const rawEditItem={
        "TestDateTemp" :{
            "title": false,
            "examDate":false,
            "fullMark": false,
            "text": false,
            "status": false,
            "needsEnable": false
        },
        "TestDateResult" :{

        },
        "TestNomreListTemp":{
            "id": 0,
            "studentId": 0,
            "studentName": "",
            "examId": 0,
            "grade": 0,
            "enable": false,
            "creationDate": "",
            "enableDate": ""
        },
        "AzmoonTemp":{
            "id": 0,
            "name": "",
            "duration": 0,
            "needsEnable": true,
            "enable": true,
            "classId": 0,
            "courseId": 0,
            "examDate": "",
            "creationDate": "",
            "endDate": "",
            "description": ""
        },
        "Azmoon":{

        },
        

    }
    const editItems={};
    const exampRes=[
        {
            id:1,
            name : 'ریاضی',
            grade : 'دبیرستان',
            date : "1397/12/12",
            detail : "توضیحات",
            isValidat : false,
            isRead : false
        },{
            id:2,
            name : 'فیزیک',
            grade : 'دبیرستان',
            date : "22/11/1397",
            detail : "توضیحات",
            isValidat : false,
            isRead : true
        },{
            id:3,
            name : 'عربی',
            grade : 'دبیرستان',
            date : "1397/12/12",
            detail : "توضیحات",
            isValidat : true,
            isRead : true
        },
    ]


    // تایید تاریخ امتحان

    function AddTestDate(exampRes){
        $('#TestDateList').empty();
        for(i in exampRes){
            let id=exampRes[i].id;
            let isRead=exampRes[i].status==0 ? false : true;
            let isValidat=exampRes[i].enable;
            let name=exampRes[i].title;
            let date=exampRes[i].examDate.substring(0,10);
            let fullmark=exampRes[i].fullMark;
            let text=exampRes[i].text;

            let classname=allClass.find(x => x.id==exampRes[i].classId).name;
            let coursename=allCourse.find(x => x.id==exampRes[i].courseId).name;
            let ClassCourse=classname+"/ "+coursename;
            // let ClassCourse=classname;
    
            let tr=createTestDateTr(id,"TestDate",isRead,isValidat,name,date,fullmark,text,ClassCourse);
            editItems["TestDate"+id]= JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));
            $('#TestDateList').append(tr);
            addActionTestDate('TestDate'+id);
        }
    }
    function createTestDateTr(id,type,isRead,isValidat,name,date,fullmark,text,ClassCourse){
        return(
            '<tr id="tr'+type+id+'" >'+
                '<td>'+testDateCheckContent(id,type,isRead,isValidat)+'</td>'+
                '<td>'+testDateName(id,type,name)+'</td>'+
                '<td>'+testDateSection(id,type,ClassCourse)+'</td>'+
                '<td>'+testDateDate(id,type,date)+'</td>'+
                '<td>'+testDateFullmark(id,type,fullmark)+'</td>'+
                '<td>'+testDateDetail(id,type,text)+'</td>'+
                '<td>'+toolbar(id,type)+'</td>'+
            '</tr>'
        );
    }

    function testDateCheckContent(id,type,isRead,isValidat){
        let a=(isValidat ? "checked" : "");
        let b=(!isRead ? '<span class="badge badge-danger">جدید</span></label>' : '');
        return(
            '<div class="form-group">'+
                '<div class="checkbox checkbox-fill d-inline">'+
                    '<input type="checkbox" name="checkbox-fill-'+type+id+'" id="checkbox-fill-'+type+id+'" objectId="'+type+id+'" '+a+'>'+
                    '<label for="checkbox-fill-'+type+id+'"  objectId="'+type+id+'" class="cr"></label>'+b+
                '</div>'+
            '</div>'
        );
    }
    function testDateCheckChange(){
        let needsEnable=$(this).prop("checked")
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        PutExamEnable(id,needsEnable);
    }
    function testDateName(id,type,name){
        return(
            '<h6 id="Name'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'
        );
    }
    function testDateSection(id,type,title){
        return(
            '<span id="section'+type+id+'" objectId="'+type+id+'" class="pie_1">'+title+'</span>'
        );
    }
    
    function testDateFullmark(id,type,name){
        return(
            '<h6 id="fullmark'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'+
            '<input id="fullmarkInp'+type+id+'" type="text" value="'+name+'" objectId="'+type+id+'" style="display:none" > '
        );
    }
    function testDateFullmarkChange(){
        let fullmark=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].fullmark=fullmark;
    }
    function testDateDate(id,type,date){
        return(
            '<div class="col-sm-6 col-md-6" style="margin:0 auto;">'+
                '<input  id="DateInp'+type+id+'" objectId="'+type+id+'" dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" disabled style="background-color:inherit;">'+
                '<input  id="DateInpHide'+type+id+'" objectId="'+type+id+'" dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" style="display:none;background-color:white;">'+
            '</div>'
        );
    }
    function testDateDateChange(){
        let date=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].date=date;
    }
    function testDateDetail(id,type,name){
        return(
            '<h6 id="detail'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'+
            '<input id="detailInp'+type+id+'" type="text" value="'+name+'" objectId="'+type+id+'" style="display:none" > '
        );
    }
    function testDateDetailChange(){
        let detail=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].detail=detail;
    }
    function toolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn-primary label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-trash-alt btn-danger label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'
        );
    }

    function testDateEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            enableEditTestDate(objectId);
        }
        if(pageStatus[type]==states[type].ADD){
            pageStatus[type]=states[type].ADDED;
            editItems[objectId].status=true; 
            enableEditTestDate(objectId);
        }
    }
    function testDateDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            if(!confirm("آیا مطمئن  هستید حذف شود؟"))
                return;
            DeleteExam(id);
        }
    }
    function testDateSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let exam=allExam.find(x =>x.id==id);
        if(pageStatus[type]==states[type].EDIT){
            let cc=editItems[objectId].date+exam.examDate.substr(10);

            datas={
                "title": exam.title,
                "examDate": editItems[objectId].date==false? exam.examDate :cc,
                "fullMark": exam.fullMark,
                "text": exam.text ,
                "status": exam.status,
                "needsEnable": exam.needsEnable
            }
            PutExam(id,datas,objectId);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));
        }      
    }
    function testDateCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            disableEditTestDate(objectId);
            $("#imageUrlImg"+objectId).attr('src',editItems[objectId].imageDef);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));;
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            $('#tr'+objectId).remove();
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));;
        }
    }

    function addActionTestDate(objectId){

        document.getElementById('checkbox-fill-'+objectId).onchange = testDateCheckChange;
        document.getElementById('DateInpHide'+objectId).onchange = testDateDateChange;
        document.getElementById('detailInp'+objectId).onchange = testDateDetailChange;
        document.getElementById('fullmarkInp'+objectId).onchange = testDateFullmarkChange;

        document.getElementById('toolbarEdit'+objectId).onclick = testDateEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = testDateDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = testDateSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = testDateCancelClick;
    }
    function enableEditTestDate(objectId){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show();

        let curentDate=$("#DateInp"+objectId).hide().val();
        $("#DateInpHide"+objectId).val(curentDate).show();

        // $('#detail'+objectId).hide();
        // $('#detailInp'+objectId).show();
    }
    function disableEditTestDate(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide();

        $("#DateInp"+objectId).show();
        $("#DateInpHide"+objectId).hide();

        // $('#detail'+objectId).show();
        // $('#detailInp'+objectId).hide();
    }


    //تایید نمونه سوال
    
    const tests=[
        {
            id:1,
            name : "فیزیک",
            fileName: "ali.pdf",
            url : "google.com",
            isValidat : false,
            isRead: false
        },
        {
            id:2,
            name : "ریاضی",
            fileName: "hoo.pdf",
            url : "google.com",
            isValidat : false,
            isRead: true
        },
        {
            id:3,
            name : "عربی",
            fileName: "ali.pdf",
            url : "google.com",
            isValidat : true,
            isRead: true
        },
    ]
    function addNemuneSoal(tests){
        $('#NemuneSoalList').empty();
        for(i in tests){
            let id=tests[i].id;
            let isRead=tests[i].isRead;
            let isValidat=tests[i].enable;
            let url=tests[i].fileUrl;
            let fileName=GetFilename(url);
            let name=tests[i].title;

            let tr=createNemuneSoalTr(id,"NemuneSoal",false,isValidat,name,fileName,url);
            $('#NemuneSoalList').append(tr);
            addActionNemuneSoal('NemuneSoal'+id);
        }
    }
    function createNemuneSoalTr(id,type,isRead,isValidat,name,fileName,url){
        return(
            '<tr id="tr'+type+id+'" >'+
                '<td>'+testDateCheckContent(id,type,isRead,isValidat)+'</td>'+
                '<td>'+testDateName(id,type,name)+'</td>'+
                '<td>'+nemuneSoalFile(id,type,fileName,url)+'</td>'+
                '<td>'+nemuneSoalToolbar(id,type)+'</td>'+
            '</tr>'
        );
    }

    function nemuneSoalCheckChange(){
        let needsEnable=$(this).prop("checked");
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");

        // if(needsEnable)
        //     errorMessage="الکی مثلا نمونه سوال رد شد :))";
        // else
        //     errorMessage="الکی مثلا نمونه سوال تایید شد :))";
        // $("#successNotification").trigger( "click" );
        EnableNemuneSoal(id,needsEnable)
    }
    function nemuneSoalFile(id,type,fileName,url){
        return(
            '<div id="filrUrl'+type+id+'" >'+
                '<input id="fileUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<span id="fileUrlText'+type+id+'" objectId="'+type+id+'" class="pie_1">'+
                    '<a id="fileUrlA'+type+id+'" objectId="'+type+id+'"  href="'+url+'"  target="_blank"> '+fileName+'</a>'+
                '</span>'+
            '</div>'
        );
    }
    function fileUrlChange(){
        // alert("file changed");
        let uploadedFile=event.target.files[0];
        let objectId=$(this).attr('objectId');
        $("#fileUrlA"+objectId).attr('href', URL.createObjectURL(uploadedFile));
        /**
         * FIXME:
         *  after selsect filr requested
         */
    }
    function nemuneSoalToolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn-primary label text-white user-list-style" style="display:none"objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-trash-alt btn-danger label text-white user-list-style" objectId="'+type+id+'"></i>'
        );
    }
    function nemuneSoalDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(!confirm("آیا مطمئن  هستید حذف شود؟"))
            return;
        DeleteNemuneSoal(id);        
    }
    function addActionNemuneSoal(objectId){
        document.getElementById('toolbarEdit'+objectId).addEventListener('click', () => {
                document.getElementById('fileUrlInp'+objectId).click()                
        })
        document.getElementById('checkbox-fill-'+objectId).onchange = nemuneSoalCheckChange;
        document.getElementById('fileUrlInp'+objectId).onchange = fileUrlChange;
        document.getElementById('toolbarDelete'+objectId).onclick = nemuneSoalDeleteClick;
    }


    // تایید نمرات
    /**
     * FIXME: FIXME:      TEST NOMRE
     * 
     * 
     */

    const tests1=[
        {
            id:1,
            name : "فیزیک",
            nomreList:[
                {
                    id:1,
                    name : "علی",
                    nomre :20,
                    isValidat : false,
                    isRead: false
                },
                {
                    id:2,
                    name : "حسین",
                    nomre :18,
                    isValidat : false,
                    isRead: true
                },
                {
                    id:3,
                    name : "مهدی",
                    nomre :17,
                    isValidat : true,
                    isRead: true
                },
            ]
        },
        {
            id:2,
            name : "عربی",
            nomreList:[
                {
                    id:1,
                    name : "علی",
                    nomre :20,
                    isValidat : false,
                    isRead: false
                },
                {
                    id:2,
                    name : "حسین",
                    nomre :18,
                    isValidat : false,
                    isRead: true
                },
                {
                    id:3,
                    name : "مهدی",
                    nomre :17,
                    isValidat : true,
                    isRead: true
                },
            ]
        },
        
    ]

    function addExamGrade(tests1){
        $("#collapse4").empty();
        for(i in tests1){
            
            let id=tests1[i].id;
            let classname=allClass.find(x => x.id==tests1[i].classId).name;
            let coursename=allCourse.find(x => x.id==tests1[i].courseId).name;
            let ClassCourse=classname+"/ "+coursename;

            let card=creatTestCard(id,"TestNomre",tests1[i].title,ClassCourse);
            $("#collapse4").append(card);
            document.getElementById("listNomreTestNomre"+id).onclick=examGradeListClick;
        }
    }
    function addExamGradeList(list,objectId,nextExamGradeId,mode){
        if(mode=="click"){
            $("#ListTestNomre"+recentExamGrade.id).empty();
            $('#collapseTestNomre'+recentExamGrade.id).collapse('hide');	
            recentExamGrade=allExamGrade.find(x => x.id==nextExamGradeId);
        }
        $('#List'+objectId).empty();
        for(i in list){
            let nomrelistdd=list[i];
            let id=nomrelistdd.studentId;
            let name=nomrelistdd.studentName;
            let nomre=nomrelistdd.grade!=null ? nomrelistdd.grade : "-" ;
            let isRead=nomrelistdd.isRead;
            let isValidat=nomrelistdd.enable;
            let checkVisibility=nomrelistdd.grade!=null ? true :false;
            let tr=createTestNomreTr(id,"TestNomreList",isRead,isValidat,name,nomre,checkVisibility);
            editItems["TestNomreList"+id]= JSON.parse(JSON.stringify(rawEditItem["TestNomreListTemp"]));
            $('#List'+objectId).append(tr);
            addActionTestNomre("TestNomreList"+id);
        }
    }
    function creatTestCard(id,type,testName,section){
        return(
            '<div class="card">'+
                '<div class="card-header" id="listNomre'+type+id+'" objectId="'+type+id+'">'+
                    '<h5 class="mb-0">'+
                        '<a href="#!" data-toggle="collapse" data-target="#collapse'+type+id+'" aria-expanded="true" aria-controls="collapse'+type+id+'">'+testName+'</a>'+
                    '</h5>'+
                    '<span>'+section+'</span>'+
                '</div>'+
                '<div id="collapse'+type+id+'" class=" card-body collapse "aria-labelledby="headingOne" >'+ 
                '<div class="table-responsive"> <table class="table table-hover"> <thead> <tr> <th class="border-top-0">وضعیت</th> <th class="border-top-0">اسم</th> <th class="border-top-0" >نمره</th> <th class="border-top-0"></th> </tr> </thead> <tbody id="List'+type+id+'"> </tbody> </table></div>'+
                '</div>'+
            '</div>'
        );
    }
    function createTestNomreTr(id,type,isRead,isValidat,name,nomre,checkVisibility){
        return(
            '<tr id="tr'+type+id+'" >'+
                '<td>'+testNomreCheckContent(id,type,isRead,isValidat,checkVisibility)+'</td>'+
                '<td>'+testNomreName(id,type,name)+'</td>'+
                '<td>'+testNomreDetail(id,type,nomre)+'</td>'+
                '<td>'+testNomretoolbar(id,type,isValidat)+'</td>'+
            '</tr>'
        );
    }
    function testNomreCheckContent(id,type,isRead,isValidat,checkVisibility){
        let a=(isValidat ? "checked" : "");
        return(
            '<div class="form-group" '+(!checkVisibility ? 'style="display:none"' : '')+'>'+
                '<div class="checkbox checkbox-fill d-inline">'+
                    '<input type="checkbox" name="checkbox-fill-'+type+id+'" id="checkbox-fill-'+type+id+'" objectId="'+type+id+'" '+a+'>'+
                    '<label for="checkbox-fill-'+type+id+'"  objectId="'+type+id+'" class="cr"></label>'+
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
    function testNomreName(id,type,name){
        return(
            '<h6 id="Name'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'
        );
    }
    function testNomreDetail(id,type,name){
        return(
            '<h6 id="detail'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'+
            '<input id="detailInp'+type+id+'" type="text" value="'+name+'" objectId="'+type+id+'" style="display:none" > '
        );
    }
    function testNomreDetailChange(){
        let detail=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].detail=detail;
    }
    function testNomretoolbar(id,type,isValidat){
        return(
            '<i id="toolbarEdit'+type+id+'" '+(isValidat ? 'style="display:none"' : '')+' class="fas fa-edit btn-primary label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" '+(isValidat ? 'style="display:none"' : '')+' class="fas fa-trash-alt btn-danger label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'
        );
    }

    function testNomreEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        type="TestNomreList";
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            enableEditTestNomre(objectId);
        }
    }
    function testNomreDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        type="TestNomreList";
        if(pageStatus[type]==states[type].DEFUALT){
            if(!confirm("آیا مطمئن  هستید حذف شود؟"))
                return;
            let gradId=allExamGradeList.find(x => x.studentId==id);
            DeleteExamGradeList(gradId.id)
        }
    }
    function testNomreSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        type="TestNomreList";
        let exam=allExamGradeList.find(x =>x.studentId==id);
        if(pageStatus[type]==states[type].EDIT){

            // let cc=editItems[objectId].date+exam.examDate.substr(10);

            datas=[ {
                "studentId": exam.studentId,
                "grade": $("#detailInp"+objectId).val()
            }]
            PutExamGradeList(recentExamGrade.id,datas,objectId);
        }       
    }
    function testNomreCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        type="TestNomreList";
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            disableEditTestNomre(objectId);
            // editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));;
        }
    }

    function addActionTestNomre(objectId){

        document.getElementById('checkbox-fill-'+objectId).onchange = testNomreCheckChange;
        document.getElementById('detailInp'+objectId).onchange = testNomreDetailChange;

        document.getElementById('toolbarEdit'+objectId).onclick = testNomreEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = testNomreDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = testNomreSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = testNomreCancelClick;
    }
    function enableEditTestNomre(objectId){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show();

        $('#detail'+objectId).hide();
        $('#detailInp'+objectId).show();
    }
    function disableEditTestNomre(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide();

        $('#detail'+objectId).show();
        $('#detailInp'+objectId).hide();
    }

    //   ازمون انلاین

    
    const OnlineExamTest=[
        {
            "id": 1,
            "name": "test 1",
            "duration": 10,
            "needsEnable": true,
            "enable": false,
            "classId": 1,
            "courseId": 1,
            "examDate": "2019-09-13T10:07:51.228Z",
            "creationDate": "2019-09-13T10:07:51.228Z",
            "endDate": "2019-09-13T10:07:51.228Z",
            "description": "توضسحات "
          },
          {
            "id": 2,
            "name": "test 2",
            "duration": 20,
            "needsEnable": true,
            "enable": false,
            "classId": 2,
            "courseId": 2,
            "examDate": "2019-09-13T10:07:51.228Z",
            "creationDate": "2019-09-13T10:07:51.228Z",
            "endDate": "2019-09-13T10:07:51.228Z",
            "description": "توضیحات "
          },
          {
            "id": 3,
            "name": "test 3",
            "duration": 30,
            "needsEnable": true,
            "enable": false,
            "classId": 3,
            "courseId": 3,
            "examDate": "2019-09-13T10:07:51.228Z",
            "creationDate": "2019-09-13T10:07:51.228Z",
            "endDate": "2019-09-13T10:07:51.228Z",
            "description": "توضیحات "
          }
    ]
    
    function AddTestAzmoon(exampRes){
        $('#AzmoonStatusTable').empty();
        for(i in exampRes){
            let id=exampRes[i].id;
            let isRead=exampRes[i].status==0 ? false : true;
            let isValidat=exampRes[i].enable;
            let name=exampRes[i].name;
            let startDate=exampRes[i].examDate.substring(0,10);
            let endDate=exampRes[i].endDate.substring(0,10);
            let duration=exampRes[i].duration;
            let detail=exampRes[i].description;

            let classname=allClass.find(x => x.id==exampRes[i].classId).name;
            let coursename=allCourse.find(x => x.id==exampRes[i].courseId).name;
            let ClassCourse=classname+"/ "+coursename;
            // let ClassCourse=classname;
    
            let tr= createAzmoonTr(id,"Azmoon",isRead,isValidat,name,ClassCourse,startDate,endDate,duration,detail);
            editItems["Azmoon"+id]= JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));
            $('#AzmoonStatusTable').append(tr);
            addActionTestAzmoon('Azmoon'+id);
        }
    }

    function createAzmoonTr(id,type,isRead,isValidat,name,section,startDate,endDate,duration,detail){
        return(
            '<tr id="tr'+type+id+'" >'+
                '<td>'+testAzmoonCheckContent(id,type,isRead,isValidat)+'</td>'+
                '<td>'+testAzmoonName(id,type,name)+'</td>'+
                '<td>'+testAzmoonSection(id,type,section)+'</td>'+
                '<td>'+testAzmoonStartDate(id,type,startDate)+'</td>'+
                '<td>'+testAzmoonEndDate(id,type,endDate)+'</td>'+
                '<td>'+testAzmoonDuration(id,type,duration)+'</td>'+
                '<td>'+testAzmoonDetail(id,type,detail)+'</td>'+
                '<td>'+testAzmoontoolbar(id,type)+'</td>'+
            '</tr>'
        );
    }
    function testAzmoonCheckContent(id,type,isRead,isValidat){
        let a=(isValidat ? "checked" : "");
        let b=(!isRead ? '<span class="badge badge-danger">جدید</span></label>' : '');
        return(
            '<div class="form-group">'+
                '<div class="checkbox checkbox-fill d-inline">'+
                    '<input type="checkbox" name="checkbox-fill-'+type+id+'" id="checkbox-fill-'+type+id+'" objectId="'+type+id+'" '+a+'>'+
                    '<label for="checkbox-fill-'+type+id+'"  objectId="'+type+id+'" class="cr"></label>'+b+
                '</div>'+
            '</div>'
        );
    }
    function testAzmoonCheckChange(){
        let needsEnable=$(this).prop("checked")
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let exam=allOnlineExam.find(x =>x.id==id);
        // if(needsEnable)
        //     errorMessage="الکی مثلا آزمون آنلاین تایید شد :))";
        // else
        //     errorMessage="الکی مثلا آزمون آنلاین رد شد :))";
        // $("#successNotification").trigger( "click" );
        EnableOnlineExam(id,needsEnable);
    }
    
    
    function testAzmoonName(id,type,name){
        return(
            '<h6 id="Name'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'
        );
    }
    function testAzmoonSection(id,type,title){
        return(
            '<span id="section'+type+id+'" objectId="'+type+id+'" class="pie_1" style="font-size:12px;">'+title+'</span>'
        );
    }

    function testAzmoonStartDate(id,type,date){
        return(
                '<input  id="StartDateInp'+type+id+'" objectId="'+type+id+'"  dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" disabled style="background-color:inherit; width:auto;font-size:14px;">'+
                '<input  id="StartDateInpHide'+type+id+'" objectId="'+type+id+'"  dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" style="display:none;background-color:white; width:auto;font-size:14px;">'
        );
    }
    function testAzmoonStartDateChange(){
        let date=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].startDate=date;
    }

    function testAzmoonEndDate(id,type,date){
        return(
                '<input  id="EndDateInp'+type+id+'" objectId="'+type+id+'" dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" disabled style="background-color:inherit;width:auto;font-size:14px;">'+
                '<input  id="EndDateInpHide'+type+id+'" objectId="'+type+id+'" dir="ltr" type="text" class="form-control date" data-mask="99/99/9999" value="'+date+'" style="display:none;background-color:white;width:auto;font-size:14px;">'
        );
    }
    function testAzmoonEndDateChange(){
        let date=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].endDate=date;
    }

    function testAzmoonDuration(id,type,name){
        return(
            '<h6 id="duration'+type+id+'" class="mb-1" objectId="'+type+id+'" >'+name+'</h6>'+
            '<input id="durationInp'+type+id+'" type="text" value="'+name+'" objectId="'+type+id+'" style="display:none" > '
        );
    }
    function testAzmoonDurationChange(){
        let detail=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].duration=detail;
    }

    function testAzmoonDetail(id,type,name){
        return(
            '<textarea id="detail'+type+id+'" class="mb-1" objectId="'+type+id+'" readonly style="border:none; background-color:inherit; font-size:12px;">'+name+'</textarea>'
        );
    }
    function testAzmoontoolbar(id,type){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-edit btn-primary label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarDelete'+type+id+'" class="fas fa-trash-alt btn-danger label text-white user-list-style" objectId="'+type+id+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle theme-bg btn- label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle btn-danger label text-white user-list-style" objectId="'+type+id+'" style="display:none"></i>'
        );
    }
    function testAzmoonEditClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            $("#StartDateInpHide"+objectId).val($("#StartDateInp"+objectId).val());
            $("#EndDateInpHide"+objectId).val($("#EndDateInp"+objectId).val());
            enableEditTestAzmoon(objectId);
        }
    }
    function testAzmoonDeleteClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
            if(!confirm("آیا مطمئن  هستید حذف شود؟"))
                return;
            DeleteOnlineExam(id);
    }
    function testAzmoonSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        
        let onlineexam=allOnlineExam.find(x => x.id==id);
        let datas={
            "name": onlineexam.name ,
            "duration": onlineexam.duration,
            "examDate": $("#StartDateInpHide"+objectId).val()+onlineexam.examDate.substr(10),
            "endDate": $("#EndDateInpHide"+objectId).val()+onlineexam.endDate.substr(10),
            "description": onlineexam.description
        }
        PutOnlineExam(id,datas,objectId)
    }
    function testAzmoonCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        type="Azmoon";
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            disableEditTestAzmoon(objectId);
            // editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));;
        }
    }

    function addActionTestAzmoon(objectId){

        document.getElementById('checkbox-fill-'+objectId).onchange = testAzmoonCheckChange;
        document.getElementById('StartDateInpHide'+objectId).onchange = testAzmoonStartDateChange;
        document.getElementById('EndDateInpHide'+objectId).onchange = testAzmoonEndDateChange;
        document.getElementById('durationInp'+objectId).onchange = testAzmoonDurationChange;

        document.getElementById('toolbarEdit'+objectId).onclick = testAzmoonEditClick;
        document.getElementById('toolbarDelete'+objectId).onclick = testAzmoonDeleteClick;
        document.getElementById('toolbarSave'+objectId).onclick = testAzmoonSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = testAzmoonCancelClick;
    }
    function enableEditTestAzmoon(objectId){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show();

        $('#EndDateInp'+objectId).hide();
        $('#EndDateInpHide'+objectId).show();

        $('#StartDateInp'+objectId).hide();
        $('#StartDateInpHide'+objectId).show();
        
    }
    function disableEditTestAzmoon(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarDelete'+objectId).show();
        $('#toolbarCancel'+objectId).hide();

        $('#EndDateInp'+objectId).show();
        $('#EndDateInpHide'+objectId).hide();

        $('#StartDateInp'+objectId).show();
        $('#StartDateInpHide'+objectId).hide();
    }


    // function createAzmoonContent(){
    //    return('<div id="smartwizard-left" class="sw-vertical-left"><ul id="azmoonSoalatShomare"></ul><div id="azmoonSoalatMatn"></div></div>' );
    // }
    // function createSooratSoal(radif,shomareSoal){
    //     return(
    //         '<li><a href="#step-l-'+radif+'"><h6>'+shomareSoal+'</h6></a></li>'
    //     );
    // }
    // function createMatneSoal(radif,title,text){
    //     return(
    //         '<div id="step-l-'+radif+'"><h5>'+title+'</h5><hr><p>'+text+'</p></div>'
    //     );
    // }



    function GetALlClass(){
        $.ajax(`${baseUrl}/class`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allClass=res;
                GetALlCourse();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function GetALlCourse(){
        $.ajax(`${baseUrl}/course`, {
            type: "GET",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allCourse=res;
                GetExam();
                GetExamGrade();
                GetNemuneSoal();
                GetOnlineExam();
                // AddTestAzmoon(OnlineExamTest);

            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    function GetExam(){
        $.ajax(`${baseUrl}/Exam/WaitingList`, {
            type: "GET",
            processData: false,
            async: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allExam=res;
                AddTestDate(allExam);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutExam(examId,datas,objectId){
       
        $.ajax(`${baseUrl}/Exam/${examId}`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="تاریخ امتحان تغییر کرد .";
                $("#successNotification").trigger( "click" );
                GetExam();
                pageStatus["TestDate"]=states["TestDate"].DEFUALT;
                disableEditTestDate(objectId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutExamEnable(examId,needsEnable){
        $.ajax(`${baseUrl}/Exam/${examId}/Enable`, {
            data: JSON.stringify({"enable": needsEnable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(needsEnable)
                    errorMessage="تاریخ آزمون تایید شد .";
                else
                    errorMessage="تاریخ آزمون رد شد.";
                $("#successNotification").trigger( "click" );
                GetExam();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteExam(examId){
        $.ajax(`${baseUrl}/Exam/${examId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="امتحان حذف شد .";
                $("#successNotification").trigger( "click" );  
                GetExam();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }


    function GetExamGrade(){
        $.ajax(`${baseUrl}/Exam/Grade/WaitingList`, {
            type: "GET",
            processData: false,
            async: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allExamGrade=res;
                addExamGrade(allExamGrade)
                // AddTestDate(allExam);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }

    function examGradeListClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        GetExamGradeList(objectId,"click");
    }
    function GetExamGradeList(objectId,mode){
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        $.ajax(`${baseUrl}/Exam/${id}/Grade`, {
            type: "GET",
            processData: false,
            async: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allExamGradeList=res;
                addExamGradeList(allExamGradeList,objectId,id,mode);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutExamGradeList(examId,datas,objectId){
        $.ajax(`${baseUrl}/Exam/${examId}/Grade`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage=`نمره دانش آموز ویرایش شد .`;
                $("#successNotification").trigger( "click" );
                GetExamGradeList("TestNomre"+examId,"update");
                pageStatus["TestNomreList"]=states["TestNomreList"].DEFUALT;
                disableEditTestNomre(objectId);
                editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem["TestDateTemp"]));
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function EnableExamGradeList(gradeId,needsEnable){
        $.ajax(`${baseUrl}/Exam/Grade/${gradeId}/Enable`, {
            data: JSON.stringify({"enable": needsEnable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(needsEnable)
                    errorMessage="نمره دانش آموز تایید شد";
                else
                    errorMessage="نمره دانش آموز رد شد.";
                $("#successNotification").trigger( "click" );
                setTimeout(GetExamGradeList("TestNomre"+recentExamGrade.id,"update"),1000);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteExamGradeList(gradeId){
        $.ajax(`${baseUrl}/Exam/Grade/${gradeId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="نمره دانش آموز حذف شد .";
                $("#successNotification").trigger( "click" );  
                GetExamGradeList("TestNomre"+recentExamGrade.id,"update");
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }


    function GetNemuneSoal(){
        $.ajax(`${baseUrl}/SampleQuestion/WaitingList`, {
            type: "GET",
            processData: false,
            async: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allNemuneSoal=res;

                addNemuneSoal(allNemuneSoal);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutNemuneSoal(examId,datas,mode,needsEnable,objectId){
       
        $.ajax(`${baseUrl}/Exam/${examId}`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(mode=="check"){
                    if(needsEnable)
                        errorMessage="نمونه سوال رد شد .";
                    else
                        errorMessage="نمونه سوال تایید شد";
                }
                // else if(mode=="edit")
                //     errorMessage="نمونه سوال تغییر کرد .";
                $("#successNotification").trigger( "click" );
                GetNemuneSoal();
                pageStatus["TestDate"]=states["TestDate"].DEFUALT;
                // disableEditTestDate(objectId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteNemuneSoal(examId){
        $.ajax(`${baseUrl}/SampleQuestion/${examId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="نمونه سوال حذف شد .";
                $("#successNotification").trigger( "click" );  
                GetNemuneSoal();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function EnableNemuneSoal(examId,needsEnable){
        $.ajax(`${baseUrl}/SampleQuestion/${examId}/Enable`, {
            data: JSON.stringify({"enable": needsEnable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(needsEnable)
                    errorMessage="نمونه سوال تایید شد .";
                else
                    errorMessage="نمونه سوال رد شد.";
                $("#successNotification").trigger( "click" );
                GetNemuneSoal();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }

    function GetOnlineExam(){
        $.ajax(`${baseUrl}/OnlineExam/WaitingList`, {
            type: "GET",
            processData: false,
            async: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                allOnlineExam=res;
                AddTestAzmoon(allOnlineExam);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function PutOnlineExam(examId,datas,objectId){
        $.ajax(`${baseUrl}/OnlineExam/${examId}`, {
            data: JSON.stringify(datas),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="آزمون آنلاین ویرایش شد .";
                $("#successNotification").trigger( "click" );
                GetOnlineExam();
                pageStatus["Azmoon"]=states["Azmoon"].DEFUALT;
                disableEditTestAzmoon(objectId);
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
            $("#errorNotification").trigger( "click" );
            }
        });
    }
    function DeleteOnlineExam(examId){
        $.ajax(`${baseUrl}/OnlineExam/${examId}`, {
            type: "DELETE",
            processData: true,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`},            
            success: function(res) {
                errorMessage="آزمون آنلاینن حذف شد .";
                $("#successNotification").trigger( "click" );  
                GetOnlineExam();
            },
            error: function(jqXHR, textStatus, errorThrown,error) {
                // set errorMessage
                var err = eval("(" + jqXHR.responseText + ")");
                errorMessage=err.Message;
                 $("#errorNotification").trigger( "click" );
            }
        });
    }
    function EnableOnlineExam(examId,needsEnable){
        $.ajax(`${baseUrl}/OnlineExam/${examId}/Enable`, {
            data: JSON.stringify({"enable": needsEnable}),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                if(needsEnable)
                    errorMessage="آزمون آنلاین تایید شد .";
                else
                    errorMessage="آزمون آنلاین رد شد.";
                $("#successNotification").trigger( "click" );
                GetOnlineExam();
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
    function GetFilename(url)
    {
        if (url)
        {
            var m = url.toString().match(/.*\/(.+?)\./);
            if (m && m.length > 1)
            {
                return m[1];
            }
        }
        return "";
    }
});


//enable true  delete it
