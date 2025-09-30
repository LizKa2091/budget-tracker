import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import https from 'https';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(
   cors({
      origin: true,
      credentials: true
   })
);

app.use(express.json());
app.use(cookieParser());

const upload = multer({ dest: path.resolve(__dirname, '/tmp/uploads') });

const API_KEY = process.env.PDFCO_API_KEY ?? '';

const DESTINATION_FILE = path.resolve(__dirname, '/tmp/uploads', 'result.json');

interface IUser {
   email: string;
   password: string;
   name: string;
   refreshToken?: string;
}

const users: Record<string, IUser> = {};
const blacklistedTokens = new Set<string>();

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
   throw new Error('JWT_SECRET or REFRESH_SECRET is not defined in .env');
}

app.get('/', (req, res) => {
   res.send('Server is running. Use POST /upload to process PDF.');
});

const authenticateToken = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (!token) {
      res.status(401).json({ message: 'Токен не предоставлен' });
      return;
   }

   if (blacklistedTokens.has(token)) {
      res.status(403).json({ message: 'Токен недействителен' });
      return;
   }

   jwt.verify(
      token,
      ACCESS_SECRET,
      (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
         if (err || !decoded || typeof decoded === 'string') {
            res.status(403).json({ message: 'Неверный токен' });
            return;
         }

         (req as any).user = decoded;
         next();
      }
   );
};

app.post('/register', (req: Request, res: Response): void => {
   const { email, password, name } = req.body;

   if (!email || !password) {
      res.status(400).json({ message: 'Email и пароль обязательны' });
      return;
   }

   if (users[email]) {
      res.status(400).json({
         message: 'Пользователь уже существует с такой почтой'
      });
      return;
   }

   users[email] = { email, password, name };
   res.status(201).json({ message: 'Успешная регистрация' });
});

app.post('/login', (req: Request, res: Response): void => {
   const { email, password } = req.body;

   const user = users[email];
   if (!user || user.password !== password) {
      res.status(401).json({ message: 'Неверный email или пароль' });
      return;
   }

   const accessToken = jwt.sign(
      { email: user.email, name: user.name },
      ACCESS_SECRET,
      { expiresIn: '15m' }
   );

   const refreshToken = jwt.sign({ email: user.email }, REFRESH_SECRET!, {
      expiresIn: '7d'
   });

   users[email].refreshToken = refreshToken;

   res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
   });

   res.json({ token: accessToken, message: 'Успешный вход' });
});

app.get('/me', authenticateToken, (req: Request, res: Response): void => {
   const user = (req as any).user;

   if (!user) {
      res.status(401).json({ message: 'Не авторизован' });
      return;
   }

   res.json({
      email: user.email,
      name: user.name
   });
});

app.post('/refresh', (req: Request, res: Response): void => {
   const tokenFromCookie = req.cookies?.refreshToken;

   if (!tokenFromCookie) {
      res.status(401).json({ message: 'Нет refreshToken' });
      return;
   }

   jwt.verify(
      tokenFromCookie,
      REFRESH_SECRET,
      (
         err: jwt.VerifyErrors | null,
         decoded: JwtPayload | string | undefined
      ) => {
         if (err || !decoded || typeof decoded === 'string') {
            res.status(403).json({ message: 'Неверный refreshToken' });
            return;
         }

         const { email } = decoded as JwtPayload;
         const user = users[email];

         if (!user || user.refreshToken !== tokenFromCookie) {
            res.status(403).json({ message: 'refreshToken не совпадает' });
            return;
         }

         const newRefresh = jwt.sign({ email }, REFRESH_SECRET, {
            expiresIn: '7d'
         });
         user.refreshToken = newRefresh;

         const newAccess = jwt.sign(
            { email: user.email, name: user.name },
            ACCESS_SECRET,
            { expiresIn: '15m' }
         );

         res.cookie('refreshToken', newRefresh, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
         });

         res.json({ token: newAccess });
      }
   );
});

app.post('/logout', authenticateToken, (req: Request, res: Response): void => {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];

   if (token) blacklistedTokens.add(token);

   const email = (req as any).user?.email;
   if (email && users[email]) {
      users[email].refreshToken = undefined;
   }

   res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
   });

   res.json({ message: 'Успешный выход' });
});

const passwordResetTokens: Record<string, string> = {};

function generateResetToken() {
   return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

app.post('/forgot-password', (req: Request, res: Response) => {
   const { email } = req.body;

   if (!email || !users[email]) {
      res.status(400).json({ message: 'Пользователь с таким email не найден' });
      return;
   }

   const resetToken = generateResetToken();
   passwordResetTokens[resetToken] = email;

   res.json({
      message: 'Токен для сброса пароля создан',
      resetToken
   });
});

app.post('/reset-password', (req: Request, res: Response) => {
   const { token, newPassword } = req.body;

   if (!token || !newPassword) {
      res.status(400).json({ message: 'Токен и новый пароль обязательны' });
      return;
   }

   const userEmail = passwordResetTokens[token];

   if (!userEmail || !users[userEmail]) {
      res.status(400).json({ message: 'Неверный или просроченный токен' });
      return;
   }

   users[userEmail].password = newPassword;

   delete passwordResetTokens[token];

   res.json({ message: 'Пароль успешно сброшен' });
});

app.post(
   '/upload',
   upload.single('pdfFile'),
   async (req: Request, res: Response) => {
      try {
         if (!req.file) {
            return res.status(400).json({ error: 'Файл не передан' });
         }

         const uploadedFilePath = req.file.path;
         const fileName = req.file.originalname;

         const presignedData = await getPresignedUrl(API_KEY, fileName);

         await uploadFile(uploadedFilePath, presignedData.uploadUrl);
         await convertPdfToJson(
            API_KEY,
            presignedData.fileUrl,
            '',
            '',
            DESTINATION_FILE
         );

         const resultJson = fs.readFileSync(DESTINATION_FILE, 'utf8');
         const parsedResult = JSON.parse(resultJson);

         fs.unlink(uploadedFilePath, () => {});

         res.json({ message: 'Файл успешно распознан', result: parsedResult });
      } catch (e: any) {
         console.error(e);
         res.status(500).json({ error: e.message || 'unknown error' });
      }
   }
);

app.post('/chat', async (req: Request, res: Response) => {
   try {
      const { prompt, expenses } = req.body;

      if (!prompt || !expenses) {
         return res
            .status(400)
            .json({ error: 'prompt и expenses обязательны' });
      }

      const openrouterApiKey = process.env.OPENROUTER_API_KEY;
      if (!openrouterApiKey) throw new Error('Нет ключа OpenRouter');

      const fullPrompt = `
         Пользователь предоставил следующие расходы: ${JSON.stringify(
            expenses,
            null,
            2
         )}.
         Запрос пользователя: "${prompt}".
         Ответь кратко, с конкретными советами.
      `;

      const aiResponse = await fetch(
         'https://openrouter.ai/api/v1/chat/completions',
         {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${openrouterApiKey}`
            },
            body: JSON.stringify({
               model: 'deepseek/deepseek-chat-v3-0324:free',
               messages: [{ role: 'user', content: fullPrompt }]
            })
         }
      );

      if (!aiResponse.ok) {
         const errorText = await aiResponse.text();
         throw new Error(`Ошибка от AI API: ${errorText}`);
      }

      const aiJson = await aiResponse.json();
      const content =
         aiJson.choices?.[0]?.message?.content || 'Нет ответа от AI';

      res.json({ answer: content });
   } catch (e: any) {
      res.status(500).json({ error: e.message || 'Ошибка AI анализа' });
   }
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});

function getPresignedUrl(
   apiKey: string,
   fileName: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
   return new Promise((resolve, reject) => {
      const queryPath = `/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${encodeURIComponent(
         fileName
      )}`;
      const options = {
         host: 'api.pdf.co',
         path: queryPath,
         method: 'GET',
         headers: { 'x-api-key': apiKey }
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
               headers: {
                  'Content-Type': 'application/octet-stream',
                  'Content-Length': data.length
               }
            },
            (res) => {
               if (
                  res.statusCode &&
                  res.statusCode >= 200 &&
                  res.statusCode < 300
               ) {
                  resolve();
               } else {
                  reject(
                     new Error(
                        `Failed to upload file, status code: ${res.statusCode}`
                     )
                  );
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
         url: uploadedFileUrl
      });

      const options = {
         host: 'api.pdf.co',
         path: '/v1/pdf/convert/to/json',
         method: 'POST',
         headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
         }
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
