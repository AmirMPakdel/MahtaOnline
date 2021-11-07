const protocol = "https"
const ip = protocol+"://online.mahtaschool.ir";
//const ip = "http://localhost:8000"
const Long_Timeout = 7000;
const Short_Timeout = 3000;
const Normal_Timeout = 5000;

const Server = {

    protocol:protocol,

    domain:ip,

    urls:{
        DASHBOARD:ip+"/dashboard",

        FILE:`${ip}/storage/web/`,
        DBFILE:`${ip}/storage/`,
        //FILE:`http://localhost/classino/`,
        //DBFILE:`http://localhost/classino/db/`,

        HOME:ip,
        FONTS:`${ip}/storage/web/fonts/`,
        ADMIN:`${ip}/admin`,

        GET_GRADE_LIST:'/api/grades',
        GET_FIELD_LIST:'/api/fields',
        
        CHECK_TOKEN:'/api/token/check',
        GET_PROFILE:'/api/profile/get',
        SET_PROFILE:'/api/profile/set',
        UPLOAD_NCI:'/api/profile/upload/nationalCardImage',
        UPLOAD_ECI:'/api/profile/upload/enrollmentCertificateImage',
        CHANGE_PASSWORD:'/api/profile/changePassword',

        ONLINE_STREAMS:"/api/course/online",
        
        GET_CATEGORY_LIST:'/api/categories',
        GET_PLANS:'/api/plan/courses/0',
        GET_VIDEO_LINK:'/api/session/videolink',

        MY_COURSE_BY_DAY:'/api/student/coursesbyday',
        MY_PLANS:'/api/student/plans',

        PURCHASE_FREE_PLAN:`/api/plan/free/register`,
        CHECK_PLAN_REGISTERED:"/api/plan/registered",
        PURCHASE_PLAN:'/api/plan/register',
        INSTALMENT_PAY:'/api/installments/pay',
        TRANSACTION_RECORDS:'/api/records/financial',

        SESSION_VIDEO_DOWNLOAD:"/api/session/videolink/download",

        GET_MY_TESTS:"/api/student/tests",
        GET_TEST:"/api/test/enter",
        SAVE_TEST_ANSWERS:"/api/test/save",
        GET_SCORE_SHEET:"/api/student/test/workbook",
        TESTS_ANSWERS:"/api/test/answers",

        SERVER_CURRENT_TIME:"/api/time/current",
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

    get_request:(url, cb, options)=>{

        // let done = false;

        // let timeout = setTimeout(()=>{

        //     done = true;
        //     /*Controller.controller.Connection.showDialog(()=>{

        //         Server.get_request(url, cb)
        //     });*/

        // }, Normal_Timeout);

        fetch(Server.domain+url).then(res=>{

            res.json().then(d=>{
                cb(d)
            })

            // clearTimeout(timeout);
            
            // if(!done){

            //     res.json().then(data=>{

            //         cb(data);

            //         if(data.result_code === Server.ResultCode.SUCCESS){

            //             cb(data);
                    
            //         }else if(data.result_code === Server.ResultCode.NO_MORE_POSTS){
                        
            //             cb(data);

            //         }else {
            //             console.log("server -> "+data.result_code+" -> "+
            //             Server.ResultCode2Message(data.result_code)+" : \n"+url);
            //         }
            //     });
            // }
        });
    },

    ResultCode:{
        SUCCESS:1000,
        INVALID_PHONE_NUMBER:1101,
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
        COUNT_LIMIT:1117,
        SERVER_NOT_AVAILABLE:1119,
        INVALID_ID:1120,
        VIDEO_UNAVAILABLE:1121,
        SMS_NOT_SENT:1122,
        NO_ANSWERS_FILE:1128,
    },

    ResultCode2Message:(code)=>{

        switch(code){
            case Server.ResultCode.SUCCESS: return("عملیات با موفقیت انجام شد");
            case Server.ResultCode.INVALID_PHONE_NUMBER: return("شماره موبایل نادرست");
            case Server.ResultCode.INVALID_PASSWORD: return("رمز عبور نادرست");
            case Server.ResultCode.INVALID_TOKEN: return("توکن غیر قابل قبول");
            case Server.ResultCode.NO_MORE_POSTS: return("پست بیشتری موجو نیست");
            case Server.ResultCode.POST_NOT_EXIST: return("چنین پستی موجود نیست");
            case Server.ResultCode.USER_NOT_EXIST: return("کاربری با این مشخصات یافت نشد");
            case Server.ResultCode.REPETITIVE_NATIONAL_CODE: return("کد ملی غیرقابل قبول");
            case Server.ResultCode.REPETITIVE_PHONE_NUMBER: return("شماره همراه تکراری است");
            case Server.ResultCode.INVALID_VERIFICATION_CODE: return("کد اهراز هویت نادرست");
            case Server.ResultCode.INVALID_PARENT_CODE: return("کد اولیا نادرست می باشد");
            case Server.ResultCode.USER_NOT_REGISTERED: return("کاربر ثبت نام نکرده است");
            case Server.ResultCode.INVALID_REQUEST: return("درخواست غیرقابل قبول");
            case Server.ResultCode.INVALID_EMAIL: return("یغام غیرقابل قبول");
            case Server.ResultCode.INVALID_FILE: return("فایل غیر قابل قبول");
            case Server.ResultCode.SERVER_ISSUE: return("مشکل از سرور");
            case Server.ResultCode.SMS_NOT_SENT: return("خطا در ارسال پیامک");
            case Server.ResultCode.VIDEO_UNAVAILABLE: return("ویدیوی موردنظر موجود نیست");
            case Server.ResultCode.NO_ANSWERS_FILE: return("پاسخنامه این آزمون در دسترس نمی باشد");
            default: return `خطای ${code}`;
        }
    }
};


export default Server;