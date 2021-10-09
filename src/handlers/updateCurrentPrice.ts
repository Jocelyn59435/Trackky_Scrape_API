import pt from 'puppeteer';
import express, { Request, Response } from 'express';

const updateCurrentPrice = async (productLink: string): Promise<number> => {
  const browser = await pt.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(productLink, { waitUntil: 'load', timeout: 0 });

  //get price
  const [priceElement] = await page.$x(
    '//*[@id="p_lt_ctl11_pageplaceholder_p_lt_ctl00_wBR_P_D1_ctl00_ctl00_ctl00_ctl02_lblActualPrice"]'
  );
  const price = await priceElement.getProperty('textContent');
  const priceText: string | undefined = await price?.jsonValue();
  let priceNumber: number | undefined;
  if (typeof priceText === 'string') {
    priceNumber = parseFloat(priceText.replace('$', '').replace(/\s+/g, ''));
  } else {
    throw new Error('Failed to fetch price.');
  }

  return priceNumber;
};

const updateCurrentPriceHandler = async (req: Request, res: Response) => {
  try {
    const { product_link } = req.body;
    console.log(product_link);
    const current_price = await updateCurrentPrice(product_link);
    res.json(current_price);
  } catch (e) {
    res.status(400);
    res.json(e.message);
  }
};

const updateCurrentPrice_route = (app: express.Application): void => {
  app.post('/price', updateCurrentPriceHandler);
};

export default updateCurrentPrice_route;
