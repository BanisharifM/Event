/**
 * 
 *  Created by MBD
 *  7/6/1398
 */

$(document).ready(function(){

    let token=localStorage.getItem("token");
    if(token==""||null)
        window.location="signin.html";         

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
        
    var baseUrl=localStorage.getItem("baseUrl");


    let Students;
    GetAllStudent();

    const rawAdd= {
        "id": 0,
        "link": "#",
        "location": 0,
        "imageUrl": ""
      }

    const states={
        
        "Add" :{
            DEFUALT : 'defualt',
            EDIT : 'edit',
            ADD : 'add',
            ADDED : 'added',
        },  ADDED : 'added',
    }
    let pageStatus={
        "Add" : states["Add"].DEFUALT,
    }

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

    let uploadedFile;

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

    function createStaffTr(person,type,number){
        return(
            '<div id="addBody'+type+person.id+'" >'+
               '<a id="addLink'+person.id+'" href="'+person.link+'"> '+imageUrl(person.id,type,person.imageUrl,number)+ '</a>'+
                '<div class="ux-designer" style="padding : 5px">'+
                '<div class="row">'+
                    '<div class="col-sm-8">'+
                        information(person.id,type,person.link,person.lastName)+
                    '</div>'+
                    '<div class="col-sm-4">'+
                        '<button class="btn btn-primary">'+
                            toolbar(person.id,type,number)+
                        '</button>'+
                    '</div>'+
                '</div>'+
            '</div>'
        );
    }

    function imageUrl(id,type,src,number){
        return(
            '<div id="imageUrl'+type+id+'" class="addImg-'+number+'" >'+
                '<input id="imageUrlInp'+type+id+'" type="file" key="'+id+'" objectId="'+type+id+'" accept="image/*" style="display: none" />'+
                '<img id="imageUrlImg'+type+id+'" class="img-fluid addImg"  key="'+id+'" objectId="'+type+id+'" style="width:100%; height:100%" src="'+src+'" alt="تبلیغ">'+
            '</div>'
        );
    }
    function imageUrlChange(){
        uploadedFile=event.target.files[0];
        let objectId=$(this).attr('objectId');
        editItems[objectId].imageUrl=uploadedFile;
        editItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');
        $("#imageUrlImg"+objectId).attr('src', URL.createObjectURL(uploadedFile));
    }

    function information(id,type,firstName,lastName){
        return(
            '<h6 id="informationFirstName'+type+id+'" dir="ltr" class="mb-1" objectId="'+type+id+'"  style=" width:80%;">'+firstName+'</h6>'+
            '<input id="informationFirstInp'+type+id+'" dir="ltr" type="text" value="'+firstName+'" objectId="'+type+id+'" style="display:none; width:80%;" > '
        );
    }
    function firstNameChange(){
        let firstName=$(this).val();
        let objectId=$(this).attr('objectId');
        editItems[objectId].firstName=firstName;
    }

    function toolbar(id,type,number){
        return(
            '<i id="toolbarEdit'+type+id+'" class="fas fa-pencil-alt f-14 mr-0 label text-white" objectId="'+type+id+'" location="'+number+'"></i>'+
            '<i id="toolbarSave'+type+id+'" class="fas fa-check-circle f-14 mr-0 btn- label text-white" objectId="'+type+id+'" style="display:none"></i>'+
            '<i id="toolbarCancel'+type+id+'" class="fas fa-times-circle f-14 mr-0r label text-white" objectId="'+type+id+'" style="display:none"></i>'
        );
    }
    function personEditClick(){
        let objectId=$(this).attr('objectId');
        let location=$(this).attr('location');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].DEFUALT){
            pageStatus[type]=states[type].EDIT;
            editItems[objectId].status=true; 
            editItems[objectId].location=location; 
            enableEditPerson(objectId,"edit");
            $("#addLink"+id).attr('href',"#addBodyAdd"+location);
            editItems[objectId].imageDef=$("#imageUrlImg"+objectId).attr('src');

        }
    }
    function personSaveClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            recentStudent=Students.find(x => x.id == id)
            if(editItems[objectId].imageUrl!=false)
                PutImage(id);
            let link=editItems[objectId].firstName!=false ? editItems[objectId].firstName : recentStudent.link;
            link=link.indexOf('://') === -1 ? 'http://' + link : link;
            data={
                "link":link,
                "location": editItems[objectId].location
              }
            PutAllStudent(data,recentStudent.id);            
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));
        }
        // if(pageStatus[type]==states[type].ADDED){
        //     pageStatus[type]=states[type].DEFUALT;
        //     student={
        //         "classId": filterNav["Students"].classId,
        //         "phoneNumber": editItems[objectId].phoneNumber.substring(1),
        //         "firstName": editItems[objectId].firstName,
        //         "lastName": editItems[objectId].lastName,
        //         "nationalId": editItems[objectId].nationalId
        //     }
        //     PostStudent(student)
        //     editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
        // }        
    }
    function personCancelClick(){
        let objectId=$(this).attr('objectId');
        let id=objectId.match(/\d+/)[0];
        let type=objectId.replace(id, "");
        let person=Students.find(x => x.id==id)
        if(pageStatus[type]==states[type].EDIT){
            pageStatus[type]=states[type].DEFUALT;
            disableEditPerson(objectId);
            $("#addLink"+id).attr('href',person.link);
            $("#imageUrlImg"+objectId).attr('src',editItems[objectId].imageDef);
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
        }
        if(pageStatus[type]==states[type].ADDED){
            pageStatus[type]=states[type].DEFUALT;
            $('#tr'+objectId).remove();
            editItems[objectId]=JSON.parse(JSON.stringify(rawEditItem));;
        }
    }


    function addActionPersons(objectId){

        document.getElementById('imageUrl'+objectId).addEventListener('click', () => {
            if(editItems[objectId].status===true){
                document.getElementById('imageUrlInp'+objectId).click()                
            }
        })
        
        document.getElementById('imageUrlInp'+objectId).onchange = imageUrlChange;
        document.getElementById('informationFirstInp'+objectId).onchange = firstNameChange;
        document.getElementById('toolbarEdit'+objectId).onclick = personEditClick;
        document.getElementById('toolbarSave'+objectId).onclick = personSaveClick;
        document.getElementById('toolbarCancel'+objectId).onclick = personCancelClick;

    }
    function enableEditPerson(objectId,mode){

        $('#toolbarEdit'+objectId).hide();
        $('#toolbarSave'+objectId).show();

        // $('#toolbarDelete'+objectId).hide();
        $('#toolbarCancel'+objectId).show(); 

        $('#informationFirstName'+objectId).hide();
        $('#informationFirstInp'+objectId).show();
        
    }
    function disableEditPerson(objectId){

        $('#toolbarEdit'+objectId).show();
        $('#toolbarSave'+objectId).hide();

        $('#toolbarCancel'+objectId).hide();  
   
        $('#informationFirstName'+objectId).show();
        $('#informationFirstInp'+objectId).hide();
        
    }

    function GetAllStudent(){
        $.ajax(`${baseUrl}/Advertisement`, {
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
        for(i=0;i<9;i++){
            let add=Students.find(x => x.location==i)
            if(add===undefined){
                add= editItems["Add"+i]= JSON.parse(JSON.stringify(rawAdd));
                add.id=i;
                add.location=i;
                add.link="#addBodyAdd"+i
            }
            $('#addbody'+i).empty();
            let tr=createStaffTr(add,"Add",i);
            // let id=Students[i].id;
            editItems["Add"+add.id]= JSON.parse(JSON.stringify(rawEditItem));
            $('#addbody'+i).append(tr);
                addActionPersons('Add'+add.id);
        }
    }
    function PutAllStudent(data,id){
        $.ajax(`${baseUrl}/Advertisement/`+id, {
            data: JSON.stringify(data),
            type: "PUT",
            processData: false,
            contentType: "application/json",
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="با موفقیت انجام شد.";
                $("#successNotification").trigger( "click" );
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
    function PutImage(id){
        const datas = new FormData();
        datas.append("file",uploadedFile)
        $.ajax({
            type: 'PUT',
            url: `${baseUrl}/Advertisement/${id}/Image`,
            data : {"file":uploadedFile},
            data : datas,
            enctype: 'multipart/form-data',
            processData: false,       
            contentType: false,   
            headers: {'Api-Version': '1.0','Authorization': `Bearer ${token}`}, 
            success: function(res) {
                errorMessage="تصویر به روز شد.";
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



