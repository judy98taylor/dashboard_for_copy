import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const filePath = path.join(process.cwd(), 'txt_data', `${id}.txt`);
    const content = await fs.readFile(filePath, 'utf8');
    
    // 解析文本文件内容
    const lines = content.split('\n');
    const data = {};
    data['productId'] = id;
    let currentKey = '';
    
    for (const line of lines) {
      if (line.includes(':')) {
        currentKey = line.replace(':', '').trim();
        data[currentKey] = '';
      } else if (line.trim() && currentKey) {
        data[currentKey] = line.trim();
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading product data:', error);
    return NextResponse.json({ error: 'Failed to fetch product data' }, { status: 500 });
  }
}