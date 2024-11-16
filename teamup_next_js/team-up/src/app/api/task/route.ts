import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { Task } from '../../../../models/taskModel';
import { User } from '../../../../models/userModel';
import formidable, { Fields, Files } from 'formidable';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';

export async function POST(req: NextRequest) {
  try {
    // Prepare uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });

    // Parse form data
    const { fields, fileUrl } = await parseForm(req, uploadDir);

    // Extract task details
    const description = Array.isArray(fields.description) 
    ? fields.description[0]  // Take first element if it's an array
    : fields.description || '';
    let assigneeEmails: string[] = [];

    if (fields.assignees) {
      // Check if assignees is already an array
      assigneeEmails = Array.isArray(fields.assignees) ? fields.assignees : JSON.parse(fields.assignees);
    }

    // Convert assignee emails to ObjectIds
    const assignees = await User.find({ email: { $in: assigneeEmails } }).select('_id');
    const assigneeIds = assignees.map(user => user._id);

    // Save task in the database
    const task = await Task.create({
      description,
      assignees: assigneeIds,
      fileUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task: {
        id: task._id,
        description,
        assignees: assigneeIds,
        fileUrl,
      },
    });

  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating task' },
      { status: 500 }
    );
  }
}

async function parseForm(req: NextRequest, uploadDir: string): Promise<{ fields: Fields; fileUrl: string | null }> {
  return new Promise(async (resolve, reject) => {
    const form = formidable({ 
      uploadDir, 
      keepExtensions: true, 
      maxFileSize: 10 * 1024 * 1024,
      filename: (name, ext, path, form) => {
        return `${Date.now()}-${path}`;
      }
    });

    const chunks = [];
    const reader = req.body?.getReader();
    if (!reader) {
      reject(new Error('No request body'));
      return;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    // Create a stream with all required IncomingMessage properties
    const stream = Object.assign(new Readable(), {
      aborted: false,
      complete: true,
      connection: null,
      headers: {} as Record<string, string>,
      headersDistinct: {},
      httpVersion: '1.1',
      httpVersionMajor: 1,
      httpVersionMinor: 1,
      method: req.method,
      url: req.url,
      socket: null,
      statusCode: null,
      statusMessage: null,
      destroyed: false
    }) as unknown as IncomingMessage;

    stream.push(buffer);
    stream.push(null);

    // Add headers
    req.headers.forEach((value, key) => {
      stream.headers[key.toLowerCase()] = value;
    });

    form.parse(stream, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const fileUrl = file && file.newFilename
        ? `/uploads/${file.newFilename}`
        : null;

      resolve({ fields, fileUrl });
    });
  });
}

export const runtime = 'nodejs' // optional
export const dynamic = 'force-dynamic' // optional