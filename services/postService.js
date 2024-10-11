import { supabase } from "../lib/supabase";
import { uploadFile } from "./imgService";

export const createOrUpdatePost = async (post) => {
    try{
        // update img
        if(post.file && typeof post.file =='object'){
            let isImage = post?.file?.type == 'image';
            let folderName = isImage? 'postImages': 'postVidoes';
            let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
            if(fileResult.success) post.file = fileResult.data;
            else{
                return fileResult;
            }
        }

        const {data, error} = await supabase
        .from('posts')
        .upsert(post)
        .select()
        .single();

        if(error){
            console.log('create post error: ', e);
            return{ success: false, msg: 'Khoong the tao bai dang'}
        }

        return {success: true, data: data}
    }catch(e){
        console.log('create post error: ', e);
        return{ success: false, msg: 'Khoong the tao bai dang'}
    }
}


export const fetchPosts = async (limit=10) => {
    try{
        const {data, error} = await supabase
        .from('posts')
        .select(`
                *,
                user: users (id, name, image)
            `)
        .order('created_at', {ascending: false})
        .limit(limit);

        if(error){
            console.log('fetch post error: ', e);
            return{ success: false, msg: 'Khoong the tai bai dang'}
        }

        return {success: true, data: data};
    }catch(e){
        console.log('fetch post error: ', e);
        return{ success: false, msg: 'Khoong the tai bai dang'}
    }
}