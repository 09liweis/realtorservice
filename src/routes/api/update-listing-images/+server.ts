import supabase from '$lib/db/client';
import { checkAuth } from '$lib/server/apiAuth';
import { json, type RequestHandler } from '@sveltejs/kit';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export const POST: RequestHandler = async ({ request }) => {
  try {

    const authUser = await checkAuth(request);
    const user_id = authUser?.user_id || authUser?.id;
    if (!user_id) {
      return json({stats: 401, error: 'Unauthorized'});
    }

    const requestBody = await request.json();
    const files = requestBody.files;

    // Validate files
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        return new Response(
          JSON.stringify({ error: `File ${file.name} exceeds 5MB limit` }),
          { status: 400 }
        );
      }

      if (!file.type.startsWith('image/')) {
        return new Response(
          JSON.stringify({ error: `File ${file.name} is not an image` }),
          { status: 400 }
        );
      }
    }

    // Upload to Supabase storage
    const uploadPromises = files.map(async (file:any) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user_id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Decode Base64 to binary
      const base64Data = file.data.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');

      const { error } = await supabase.storage
        .from('listing-images')
        .upload(fileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return new Response(
      JSON.stringify({ uploadedUrls }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload images' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
