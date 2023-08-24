import { NextResponse } from 'next/server';
import response from '@/openAi';
import openai from '@/openAi';

export async function POST(request: Request) {
  try {
    const { todos } = await request.json();

    const responseAPI = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: [
        {
          role: 'system',
          content: `When responding, welcome the user as Rita by name and say Welcome to the P-Man app!
            limit the response to 200 characters`,
        },
        {
          role: 'user',
          content: `Hi there, provide a summary of the following todos. Count how many tasks are in each
        category such as To Do, In Progress and Done, then tell the user to have a productive day!
        here's the data: ${JSON.stringify(todos)}`,
        },
      ],
    });
    return NextResponse.json(responseAPI.choices[0].message);
  } catch (error) {
    console.log(error);
  }
}
