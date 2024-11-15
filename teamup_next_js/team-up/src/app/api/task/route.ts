import { NextRequest, NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const uploadDir = path.join(process.cwd(), 'uploads');
  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        reject(NextResponse.json({ error: 'Error parsing form data' }, { status: 500 }));
        return;
      }

      // Create a unique folder for this task
      const taskFolder = path.join(uploadDir, `task-${Date.now()}`);
      fs.mkdirSync(taskFolder, { recursive: true });

      // Move uploaded files to the task folder
      Object.values(files).forEach((file: any) => {
        const oldPath = file.filepath;
        const newPath = path.join(taskFolder, file.originalFilename);
        fs.renameSync(oldPath, newPath);
      });

      // Save task data (fields) to your database here

      resolve(NextResponse.json({ message: 'Task created successfully', taskId: fields.id }));
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
