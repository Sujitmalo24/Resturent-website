import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
  try {
    // Get the absolute path to the menu.json file
    const jsonDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(jsonDirectory + '/menu.json', 'utf8');
    const menuData = JSON.parse(fileContents);

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const vegetarian = searchParams.get('vegetarian');

    let filteredItems = menuData.items;

    // Apply filters
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    if (featured === 'true') {
      filteredItems = filteredItems.filter(item => item.featured === true);
    }

    if (vegetarian === 'true') {
      filteredItems = filteredItems.filter(item => item.isVegetarian === true);
    }

    // Return filtered data
    const responseData = {
      categories: menuData.categories,
      items: filteredItems,
      total: filteredItems.length
    };

    return NextResponse.json({
      success: true,
      message: 'Menu data retrieved successfully',
      data: responseData
    });

  } catch (error) {
    console.error('Error reading menu data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve menu data',
      data: null
    }, { status: 500 });
  }
}

// Optional: Add POST method for future menu management
export async function POST(request) {
  return NextResponse.json({
    success: false,
    message: 'Menu creation not implemented yet',
    data: null
  }, { status: 501 });
}
