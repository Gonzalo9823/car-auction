import axios, { AxiosRequestHeaders, Method } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const ApiCatchAll = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, headers, body, url } = req;

  try {
    if (!url) {
      throw new Error('URL not given.');
    }

    const cleanedUrl = url.replace('/api/', '');

    if (cleanedUrl !== 'auth/refresh' && cleanedUrl !== 'auth/sign-out') {
      headers.cookie = '';
    }

    const { data, headers: returnedHeaders } = await axios({
      method: method as Method,
      // http://localhost:4000/v1/
      url: `${process.env.API_URL}${cleanedUrl}`,
      headers: headers as AxiosRequestHeaders,
      data: body,
    });

    Object.keys(returnedHeaders).forEach((key) => res.setHeader(key, returnedHeaders[key] || ''));

    res.status(200).json(data);
  } catch (err: unknown) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      const { response } = err;

      if (response) {
        const { status, data } = response;
        res.status(status).json(data);
        return;
      }
    }

    res.status(500).end();
  }
};

export default ApiCatchAll;
