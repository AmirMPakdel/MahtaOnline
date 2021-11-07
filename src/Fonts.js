import Server from "./Server";

const fonts_url = Server.urls.FONTS;

const fonts = [
    {
        name:"IranSans",
        weight:"300",
        file_name:"iran_sans_300",
        extention:"woff",
        format:"woff"
    },
    {
        name:"IranSans",
        weight:"400",
        file_name:"iran_sans_400",
        extention:"woff",
        format:"woff"
    },
    {
        name:"IranSans",
        weight:"500",
        file_name:"iran_sans_500",
        extention:"woff",
        format:"woff"
    },
    {
        name:"IranSans",
        weight:"700",
        file_name:"iran_sans_700",
        extention:"woff",
        format:"woff"
    },
    {
        name:"IranSans",
        weight:"900",
        file_name:"iran_sans_900",
        extention:"woff",
        format:"woff"
    },
]
export function addFonts(){
    let textNode = "";
    fonts.forEach((v,i)=>{
        textNode+= `@font-face {
            font-family: ${v.name};
            font-style: normal;
            font-weight: ${v.weight};
            src:url(${fonts_url}${v.file_name}.${v.extention}) format("${v.format}");}`
    })
    let newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode(textNode));
    document.head.appendChild(newStyle);
}