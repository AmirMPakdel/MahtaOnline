const protocol = "http"
//const ip = protocol+"://abino.cloudsite.ir";
const ip = protocol+"://localhost:8000";
const Long_Timeout = 7000;
const Short_Timeout = 3000;
const Normal_Timeout = 5000;

const Server = {

    protocol:protocol,

    domain:ip,

    urls:{
        FILE:`http://localhost/classino/`,
        GET_PROFILE:'/api/profile/get',
        SET_PROFILE:'/api/profile/set',
        GET_GRADE_LIST:'/api/grades',
        GET_FIELD_LIST:'/api/fields',
        GET_CATEGORY_LIST:'/api/categories',
        CHANGE_PASSWORD:'/api/profile/changePassword',
        UPLOAD_NCI:'/api/profile/upload/nationalCardImage',
        UPLOAD_ECI:'/api/profile/upload/enrollmentCertificateImage',


        ADMIN:`${ip}/admin`,
        LOGIN:`/api/login`,
        SEND_CODE:`/api/registration/code`,
        CONFIRM_CODE:`/api/registration/confirm`,
        COMPLETE_SIGN_UP:`/api/registration/complete`,
        PARENT_LOGIN:`/api/parent`,
        TEACHER_LIST:`/api/teachers`,
        LINKS:`/api/links`,
        ABOUT:`/api/about`
    },

    img_png:(name)=>{
        return Server.urls.FILE+name+".png";
    },

    img_svg:(name)=>{
        return Server.urls.FILE+name+".svg";
    },

    post_request:(url, json, cb)=>{

        let done = false;

        let timeout = setTimeout(()=>{

            done = true;
            /*Controller.controller.Connection.showDialog(()=>{

                Server.post_request(url, json, cb)
            });*/

        }, Short_Timeout);

        fetch(Server.domain+url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify(json)
        
        }).then(res=>{

            clearTimeout(timeout);

            res.json().then(d=>cb(d));

        })
    },

    x_w_post_request:(url, body, cb)=>{

        let done = false;

        let timeout = setTimeout(()=>{

            done = true;
            /*Controller.controller.Connection.showDialog(()=>{

                Server.x_w_post_request(url, body, cb);
            });*/

        }, Short_Timeout);

        fetch(Server.domain+url+"?"+body, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        
        }).then(res=>{

            clearTimeout(timeout);
            
            if(!done){

                res.json().then(data=>{

                    if(data.result_code === Server.ResultCode.SUCCESS){

                        cb(data);
                    
                    }else{
                        console.log("server -> "+data.result_code+" -> "+
                        Server.ResultCode2Message(data.result_code)+" : \n"+
                        url+" -> \n"+body);
                    }

                });
            }
        })
    },

    get_request:(url, cb)=>{

        let done = false;

        let timeout = setTimeout(()=>{

            done = true;
            /*Controller.controller.Connection.showDialog(()=>{

                Server.get_request(url, cb)
            });*/

        }, Normal_Timeout);

        fetch(Server.domain+url,).then(res=>{

            clearTimeout(timeout);
            
            if(!done){

                res.json().then(data=>{

                    if(data.result_code === Server.ResultCode.SUCCESS){

                        cb(data);
                    
                    }else if(data.result_code === Server.ResultCode.NO_MORE_POSTS){
                        
                        cb(data);

                    }else {
                        console.log("server -> "+data.result_code+" -> "+
                        Server.ResultCode2Message(data.result_code)+" : \n"+url);
                    }
                });
            }
        });
    },

    ResultCode:{
        SUCCESS:1000,
        INVALID_NATIONAL_CODE:1101,
        INVALID_PASSWORD:1102,
        INVALID_TOKEN:1103,
        NO_MORE_POSTS:1104,
        POST_NOT_EXIST:1105,
        USER_NOT_EXIST:1106,
        REPETITIVE_NATIONAL_CODE:1107,
        REPETITIVE_PHONE_NUMBER:1108,
        INVALID_VERIFICATION_CODE:1109,
        INVALID_PARENT_CODE:1110,
        USER_NOT_REGISTERED:1111,
        INVALID_REQUEST:1112,
        INVALID_EMAIL:1113,
        INVALID_FILE:1114,
        SERVER_ISSUE:1115,
        SHOULD_UPDATE:1116,
        COUNT_LIMIT:1117
    },

    ResultCode2Message:(code)=>{

        switch(code){
            case Server.ResultCode.SUCCESS: return("عملیات با موفقیت انجام شد");
            case Server.ResultCode.INVALID_NATIONAL_CODE: return("کد ملی نادرست");
            case Server.ResultCode.INVALID_PASSWORD: return("رمز عبور نادرست");
            case Server.ResultCode.INVALID_TOKEN: return("توکن غیر قابل قبول");
            case Server.ResultCode.NO_MORE_POSTS: return("پست بیشتری موجو نیست");
            case Server.ResultCode.POST_NOT_EXIST: return("چنین پستی موجود نیست");
            case Server.ResultCode.USER_NOT_EXIST: return("کاربری با این مشخصات یافت نشد");
            case Server.ResultCode.REPETITIVE_NATIONAL_CODE: return("کد ملی غیرقابل قبول");
            case Server.ResultCode.REPETITIVE_PHONE_NUMBER: return("شماره همراه تکراری است");
            case Server.ResultCode.INVALID_VERIFICATION_CODE: return("کد اهراز نادرست");
            case Server.ResultCode.INVALID_PARENT_CODE: return("کد اولیا نادرست می باشد");
            case Server.ResultCode.USER_NOT_REGISTERED: return("کاربر ثبت نام نکرده است");
            case Server.ResultCode.INVALID_REQUEST: return("درخواست غیرقابل قبول");
            case Server.ResultCode.INVALID_EMAIL: return("یغام غیرقابل قبول");
            case Server.ResultCode.INVALID_FILE: return("فایل غیر قابل قبول");
            case Server.ResultCode.SERVER_ISSUE: return("مشکل از سرور");
        }
    }
};


export default Server;