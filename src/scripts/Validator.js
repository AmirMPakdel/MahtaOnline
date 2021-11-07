const valid_sms_code_length = 5;

const InputValidator = {

    valid_name:(name)=>{

        name = toS(name);

        if(!str_btw(name,2, 40)){
            return false;
        }

        return true;
    },

    valid_password:(pass)=>{

        pass = toS(pass);

        if(!str_btw(pass, 3, 50)){
            return false;
        }

        return true;
    },

    valid_phone:(phone)=>{
        phone = toS(phone);

        if(phone.length < 10){
            return false;
        }

        return true;
    },

    valid_national_code:(code)=>{
        code = toS(code);

        if(!str_eq(code, 10)){
            return false
        }

        return true;
    },

    valid_sms_code :(code)=>{
        code = toS(code);

        if(!str_eq(code, valid_sms_code_length)){
            return false
        }

        return true;
    },

    valid_re_password :(re_pass, pass)=>{

        return re_pass === pass;
    },

    valid_selection :(selected, selectList, id_tag="id")=>{
        
        let found = false;
        if(selected){
            selectList.forEach((v,i)=>{
                if(v[id_tag] == selected[id_tag]){found = true}
            });
        }
        return found;
    }
}

function toS(s){

    if(s === undefined){
        s = "";
    }

    try{
        s = s.toString();
    }catch{
        console.log("value cant be cast to string");
        s = ""
    }

    return s;
}

function str_btw(s, n, m){

    if(s.length > n && s.length < m){
        return true;
    }
    return false
}

function str_eq(s, n){

    if(s.length === n){
        return true;
    }
    return false;
}

const ValidErrors = {
    first_name:{
        title:"نام نامعتبر",
        info:" نام حداقل باید 3 حرف داشته باشد"
    },
    last_name:{
        title:"نام خاوادگی نامعتبر",
        info:" نام خانوادگی حداقل باید 3 حرف داشته باشد"
    },
    email:{
        title:"",
        info:""
    },
    password:{
        title:"",
        info:""
    },
    re_password:{
        title:"",
        info:""
    },
    gender:{
        title:"جنسیت خود را مشخص کنید",
        info:""
    },
    field:{
        title:"رشته خود را مشخص کنید",
        info:""
    },
    grade:{
        title:"پایه تحصیلی خود را مشخص کنید",
        info:""
    },
    address:{
        title:"",
        info:""
    },
    phone_number:{
        title:"",
        info:""
    },
    home_number:{
        title:"",
        info:""
    },
}

export {InputValidator, ValidErrors}