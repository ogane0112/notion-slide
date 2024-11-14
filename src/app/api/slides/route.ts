import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { NextResponse } from 'next/server';

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

interface SlideContent {
  content: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString:any = n2m.toMarkdownString(mdblocks);

    // Convert markdown to Marp-like slides
    const slides = convertToMarpSlides(mdString);

    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching Notion content:', error);
    return NextResponse.json({ error: 'Failed to fetch Notion content' }, { status: 500 });
  }
}

function convertToMarpSlides(markdown: string | { parent: string }): SlideContent[] {
  const slides: SlideContent[] = [];
  const slideDelimiter = '---';

  let markdownString = '';
  if (typeof markdown === 'string') {
    markdownString = markdown;
  } else if (typeof markdown === 'object' && markdown.parent) {
    markdownString = markdown.parent;
  } else {
    console.error('Unexpected markdown format:', markdown);
    return [{ content: '# Error\n\nUnable to process content' }];
  }

  const slideContents = markdownString.split(slideDelimiter);
  console.log(markdownString)
  console.log(slideContents)

  slideContents.forEach((content) => {
    const trimmedContent = content.trim();
    if (trimmedContent) {
      slides.push({ content: trimmedContent });
    }
  });
  console.log(slides)

  // If no slides were created, add a default slide
  if (slides.length === 0) {
    slides.push({ content: '# Welcome\n\nNo content available' });
  }

  return slides;
}

