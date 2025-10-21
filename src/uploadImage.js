import { supabase } from './supabaseClient';

export async function uploadImage(file) {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\\-_]/g, "_");
    const filePath = `${Date.now()}-${cleanName}`;

    // Faylni yuklash
    const { error: uploadError } = await supabase.storage
        .from('User_Images')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Doim ishlaydigan link olish – 2 yil amal qiladi
    const { data: urlData, error: urlError } = await supabase.storage
        .from('User_Images')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10); // 10 yil

    if (urlError) throw urlError;

    return urlData.signedUrl;
}
