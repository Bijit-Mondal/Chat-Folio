import { Hono, Context } from 'hono';
import { run } from './openai';
import { serveStatic } from 'hono/bun'

const app = new Hono();

app.use('/views/', serveStatic({ root:  'views' }));


app.get('/', serveStatic({ path: 'views/chat.html' }))

app.post('/answer', async (c: Context) => {
  try {
    let obj: { prompt?: string } = await c.req.json();
    let prompt: string | undefined = obj.prompt;

    if (!prompt) {
      throw new Error('Prompt is missing');
    }

    console.log('Prompt:', prompt);
    const res = await run([prompt]);
    return c.json(res);
  } catch (error) {
    console.error('Error:', error);
    return c.status(418);
  }
});

export default app;