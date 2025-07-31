import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.PDFCO_API_KEY ?? '';

const UPLOAD_FILE_PATH = path.resolve(__dirname, 'uploads', 'test.pdf');
const DESTINATION_FILE = path.resolve(__dirname, 'uploads', 'result.json');

app.get('/', (req, res) => {
   res.send('Server is running. Use POST /upload to process PDF.');
});

app.post('/upload', async (req: Request, res: Response) => {
   try {
      // 1. Получаем presigned URL
      const presignedData = await getPresignedUrl(API_KEY, UPLOAD_FILE_PATH);

      // 2. Загружаем файл по presigned URL
      await uploadFile(UPLOAD_FILE_PATH, presignedData.uploadUrl);

      // 3. Запускаем конвертацию PDF в JSON
      const resultUrl = await convertPdfToJson(API_KEY, presignedData.fileUrl, '', '', DESTINATION_FILE);

      const resultJson = fs.readFileSync(DESTINATION_FILE, 'utf8');
      const parsedResult = JSON.parse(resultJson);

      res.json({ message: 'Файл успешно распознан', result: parsedResult });
   } catch (e: any) {
      res.status(500).json({ error: e.message || 'unknown error' });
   }
});

app.post('/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, expenses } = req.body;

      if (!prompt || !expenses) {
         return res.status(400).json({ error: 'prompt и expenses обязательны' });
      }

      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      if (!openrouterApiKey) throw new Error('Нет ключа OpenRouter');

      const fullPrompt = `
         Пользователь предоставил следующие расходы: ${JSON.stringify(expenses, null, 2)}.
         Запрос пользователя: "${prompt}".
         Ответь кратко, с конкретными советами.
      `;

      const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openrouterApiKey}`
         },
         body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [
               { role: "user", content: fullPrompt }
            ]
         })
      });

      if (!aiResponse.ok) {
         const errorText = await aiResponse.text();
         throw new Error(`Ошибка от AI API: ${errorText}`);
      }

      const aiJson = await aiResponse.json();
      const content = aiJson.choices?.[0]?.message?.content || 'Нет ответа от AI';

      res.json({ answer: content });

   } 
   catch (e: any) {
      res.status(500).json({ error: e.message || 'Ошибка AI анализа' });
   }
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});

function getPresignedUrl(apiKey: string, localFilePath: string): Promise<{ uploadUrl: string; fileUrl: string }> {
   return new Promise((resolve, reject) => {
      const fileName = path.basename(localFilePath);
      const queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${encodeURIComponent(fileName)}`;
      const options = {
         host: 'api.pdf.co',
         path: queryPath,
         method: 'GET',
         headers: { 'x-api-key': apiKey },
      };

      https
      .get(options, (response) => {
            let data = '';
            response.on('data', (chunk) => (data += chunk));
            response.on('end', () => {
               const json = JSON.parse(data);
               if (!json.error) {
                  resolve({ uploadUrl: json.presignedUrl, fileUrl: json.url });
               } else {
                  reject(new Error(json.message));
               }
            });
         })
      .on('error', (err) => reject(err));
   });
}

function uploadFile(localFilePath: string, uploadUrl: string): Promise<void> {
   return new Promise((resolve, reject) => {
      fs.readFile(localFilePath, (err, data) => {
         if (err) return reject(err);

         const options = new URL(uploadUrl);

         const req = https.request(
            {
               method: 'PUT',
               hostname: options.hostname,
               path: options.pathname + options.search,
               headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': data.length },
            },
            (res) => {
               if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                  resolve();
               } else {
                  reject(new Error(`Failed to upload file, status code: ${res.statusCode}`));
               }
            }
         );

         req.on('error', (e) => reject(e));
         req.write(data);
         req.end();
      });
  });
}

function convertPdfToJson(
   apiKey: string,
   uploadedFileUrl: string,
   password: string,
   pages: string,
   destinationFile: string
): Promise<string> {
   return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
         name: path.basename(destinationFile),
         password,
         pages,
         url: uploadedFileUrl,
      });

      const options = {
         host: 'api.pdf.co',
         path: '/v1/pdf/convert/to/json',
         method: 'POST',
         headers: {
         'x-api-key': apiKey,
         'Content-Type': 'application/json',
         'Content-Length': Buffer.byteLength(postData),
         },
      };

      const req = https.request(options, (res) => {
         let data = '';
         res.setEncoding('utf8');
         res.on('data', (chunk) => (data += chunk));
         res.on('end', () => {
            const json = JSON.parse(data);
            if (!json.error) {
               // Скачать результат и сохранить в файл
               const fileStream = fs.createWriteStream(destinationFile);
               https.get(json.url, (response) => {
                  response.pipe(fileStream).on('close', () => {
                  resolve(json.url);
                  });
               });
            } else {
               reject(new Error(json.message));
            }
         });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
   });
}
