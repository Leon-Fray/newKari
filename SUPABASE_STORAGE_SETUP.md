# Supabase Storage Configuration for Practitioner Signup

This document explains how to configure Supabase Storage to handle file uploads for practitioner signup.

## Required Supabase Storage Setup

### 1. Create Storage Bucket

In your Supabase dashboard, go to Storage and create a new bucket called `practitioner-images`:

```sql
-- This bucket will store practitioner profile pictures and ID images
-- Bucket name: practitioner-images
-- Public: true (so images can be accessed via public URLs)
```

### 2. Set Up Storage Policies

Create the following Row Level Security (RLS) policies for the `practitioner-images` bucket:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload practitioner images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'practitioner-images');

-- Allow authenticated users to view files
CREATE POLICY "Allow authenticated users to view practitioner images" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'practitioner-images');

-- Allow users to update their own files
CREATE POLICY "Allow users to update their own practitioner images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'practitioner-images' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete their own practitioner images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'practitioner-images' AND auth.uid()::text = (storage.foldername(name))[2]);
```

### 3. Database Schema Updates

Make sure your `practitioners` table includes the new columns:

```sql
ALTER TABLE practitioners 
ADD COLUMN profile_picture_url TEXT,
ADD COLUMN id_image_url TEXT;
```

## File Structure

Files will be organized in the following structure:
```
practitioner-images/
├── profile-pictures/
│   └── {user_id}/
│       └── {timestamp}-{random}.{extension}
└── id-images/
    └── {user_id}/
        └── {timestamp}-{random}.{extension}
```

## Usage

The file upload functionality is now integrated into the practitioner signup form:

1. **Step 1**: Account Information (name, email, password)
2. **Step 2**: Professional Details (specialty, credentials, consultation types, bio)
3. **Step 3**: Document Upload (profile picture and ID image)

### Features

- **Drag and drop** file upload
- **Image preview** before submission
- **File validation** (image types only, max 5MB)
- **Automatic file naming** to prevent conflicts
- **Error handling** for upload failures
- **Progress indication** during upload

### Security Considerations

- Files are uploaded to user-specific folders
- RLS policies ensure users can only access their own files
- File validation prevents non-image uploads
- File size limits prevent abuse
- Unique filenames prevent conflicts

## Testing

To test the file upload functionality:

1. Start the development server
2. Navigate to `/practitioner-signup`
3. Complete steps 1 and 2
4. In step 3, upload both required images
5. Submit the form

The images should be uploaded to Supabase Storage and the URLs stored in the database.
