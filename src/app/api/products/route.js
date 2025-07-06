import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const txtDataPath = path.join(process.cwd(), 'txt_data');
    const files = await fs.readdir(txtDataPath);
    const productIds = files
      .filter(file => file.endsWith('.txt') && file !== '.DS_Store.txt')
      .map(file => path.parse(file).name);
    
    return NextResponse.json(productIds);
  } catch (error) {
    console.error('Error reading product list:', error);
    return NextResponse.json({ error: 'Failed to fetch product list' }, { status: 500 });
  }
}