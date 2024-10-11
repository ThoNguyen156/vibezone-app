import {decode} from 'base64-arraybuffer'
import * as FileSystem from 'expo-file-system'
import {supabase} from '../lib/supabase'
import { supabaseUrl } from '../constants'

export const getUserImageSrc = imgPath => {
    if(imgPath){
        return getSupabaseFileUrl(imgPath)
    }else{
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl = filePath => {
    if(filePath){
        return { uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`}
    }
} 

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try{
        let fileName = getFilePath(folderName, isImage);
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        //console.log(fileName);

        let imageData = decode(fileBase64);
        //console.log("Uploading to Supabase storage:", supabase); // Debugging line
        let {data, error} = await supabase
        .storage
        .from("uploads")
        .upload(fileName, imageData, {
            cacheControl: '3600',
            upsert: false,
            contentType: isImage ? 'image/*':'video/*'
        })

        if (error) {
            console.log("file upload fails: " , e);
            return {success: false, msg: "can not upload media"};
        }

        //console.log("data: ", data)
        return {success: true, data: data.path};
    }catch(e){
        console.log("file upload fails: " , e);
        return {success: false, msg: "can not upload media"};
    }
}

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${(new Date()).getTime()}${isImage? '.png' : '.mp4'}`;
}