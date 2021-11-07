import Server from "./Server";

let ServerConsts = {};

const getConsts = (cb)=>{

    if(ServerConsts.field_list && ServerConsts.grade_list){

        cb(ServerConsts);

    }else{

        Server.get_request(Server.urls.GET_FIELD_LIST, (res1)=>{
            Server.get_request(Server.urls.GET_GRADE_LIST, (res2)=>{
                ServerConsts = {field_list:res1.data, grade_list:res2.data, 
                    gender_list:[{id:1,title:"پسر"},{id:0,title:"دختر"}]};
                if(cb){
                    cb(ServerConsts);
                }
            });
        });
    }
};

let Controller = {

    is_profile_completed:false,
    passed_threshold:true,
    region:2,

    openNotification:null,

    onMenu:()=>{},
    closeMenu:null,
    openMenu:null,
    menu_is_open:false,

    onBackdrop:()=>{},
    showBackdrop:null,
    hideBackdrop:null,
    backdrop_is_showend:false,

    getConsts,

    setNavbar_name:(name)=>{},

    setPage: (jsx, index)=>{},

    openAlertModal: (info)=>{},

};

export default Controller;
