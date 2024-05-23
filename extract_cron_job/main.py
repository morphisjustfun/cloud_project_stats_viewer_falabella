import requests
import pandas as pd
import numpy as np
import fake_useragent
import pendulum
from dotenv import load_dotenv
import os
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(format='%(asctime)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')
logger.setLevel(logging.INFO)


def run_falabella():
    def extract():
        logger.info('Starting extraction')
        session = requests.Session()
        sort_by = '_score%2Cdesc'
        category_id = 'cat760706'
        pg_id = '2'
        category_name = 'Celulares-y-Telefonos'
        zones = 'IBIS_51%2CPPE3342%2CPPE3361%2CPPE1112%2CPPE3384%2C912_LIMA_2%2CPPE1280%2C150000%2CPPE4%2C912_LIMA_1%2CPPE1279%2C150101%2CPPE344%2CPPE3059%2CPPE2492%2CIMP_2%2CPPE3331%2CPPE3357%2CPPE1091%2CPERF_TEST%2CPPE1653%2CPPE2486%2COLVAA_81%2CPPE2815%2CIMP_1%2CPPE3164%2CPPE2918%2CURBANO_83%2CPPE2429%2CPPE3152%2CPPE3479%2CPPE3483%2CPPE3394%2CLIMA_URB1_DIRECTO%2CPPE2511%2CIBIS_19%2CPPE1382%2CIBIS_3PL_83%2CPPE3248'

        df = pd.DataFrame(columns=[
            'product_id',
            'sku_id',
            'product_name',
            'url',
            'brand',
            'media_url',
            'price',
            'event_price',
            'cmr_price',
            'total_reviews',
            'rating'
        ])

        page = 1
        while True:
            base_url = f"https://www.falabella.com.pe/s/browse/v1/listing/pe?sortBy={sort_by}&categoryId={category_id}&pgid={pg_id}&page={page}&categoryName={category_name}&zones={zones}"
            try:
                res = session.get(base_url, headers={
                    'User-Agent': fake_useragent.UserAgent().chrome
                })
            except Exception as e:
                logger.error(f'Error requesting: {e}')

            if not res.ok:
                break

            res_json = res.json()

            data = res_json['data']
            results = data['results']

            for result in results:
                product_id = result['productId']
                sku_id = result['skuId']
                url = result['url']
                brand = result['brand']
                product_name = result['displayName']

                medias_url = result['mediaUrls']
                if medias_url.__len__() > 0:
                    media_url = medias_url[0]

                price = np.nan
                event_price = np.nan
                cmr_price = np.nan

                prices = result['prices']
                for price_item in prices:
                    if price_item['type'] == 'cmrPrice':
                        cmr_price = float(price_item['price'][0].replace(',', ''))
                    if price_item['type'] == 'eventPrice':
                        event_price = float(price_item['price'][0].replace(',', ''))
                    if price_item['type'] == 'normalPrice':
                        price = float(price_item['price'][0].replace(',', ''))

                total_reviews = np.nan
                rating = np.nan
                if 'totalReviews' in result.keys():
                    total_reviews = int(result['totalReviews'])
                if 'rating' in result.keys():
                    rating = float(result['rating'])

                df = pd.concat([df, pd.DataFrame({
                    'product_id': [product_id],
                    'sku_id': [sku_id],
                    'url': [url],
                    'brand': [brand],
                    'media_url': [media_url],
                    'price': [price],
                    'event_price': [event_price],
                    'cmr_price': [cmr_price],
                    'total_reviews': [total_reviews],
                    'rating': [rating],
                    'product_name': [product_name]
                })])

            page += 1

        logger.info(f'Extracted {df.shape[0]} rows')
        df.reset_index(drop=True, inplace=True)
        logger.info('Finished extraction')
        return df

    def upload(df):
        logger.info('Starting upload')
        connection_string = f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
        time = pendulum.now(tz='America/Lima')
        df['time'] = time
        df['provider'] = 'falabella'
        df.set_index('product_id', inplace=True)

        logger.info('Uploading to database')

        try:
            df.to_sql('products', connection_string, if_exists='append', index=True)
        except Exception as e:
            logger.error(f'Error uploading to database: {e}')

        logger.info('Finished upload')

    df = extract()
    upload(df)


def run_entel():
    def extract():
        logger.info('Starting extraction')
        session = requests.Session()
        base_url = 'https://miportal.entel.pe/browse?No=0&Nrpp=1000&contentPath=%2Fpages%2Fstoreperupp%2Fcatalogo%2Fliberados&subPath=main%5B1%5D'
        try:
            res = session.get(base_url, headers={
                'User-Agent': fake_useragent.UserAgent().chrome,
                'Accept': 'application/json, text/javascript, */*; q=0.01'
            })
        except Exception as e:
            logger.error(f'Error requesting: {e}')

        if not res.ok:
            return pd.DataFrame()

        df = pd.DataFrame(columns=[
            'product_id',
            'sku_id',
            'product_name',
            'url',
            'brand',
            'media_url',
            'price',
            'event_price',
            'cmr_price',
            'total_reviews',
            'rating'
        ])

        res_json = res.json()
        records = res_json.get('records', [])

        price = np.nan
        event_price = np.nan
        cmr_price = np.nan

        for record in records:
            attributes = record.get('attributes', {})
            product_id = attributes.get('skuId', [''])[0]
            sku_id = attributes.get('sku', [''])[0]
            product_name = attributes.get('description', [''])[0]
            url = 'https://miportal.entel.pe' + attributes.get('seoUrl', ['seoUrl'])[0]
            brand = attributes.get('product.brand', [''])[0]
            media_url = 'https://miportal.entel.pe' + attributes.get('productImage', [''])[0]
            price = float(attributes.get('sku.listPrice', [''])[0])
            event_price = float(attributes.get('product.listPrice', [''])[0])
            cmr_price = np.nan
            total_reviews = np.nan
            rating = np.nan

            df = pd.concat([df, pd.DataFrame({
                'product_id': [product_id],
                'sku_id': [sku_id],
                'product_name': [product_name],
                'url': [url],
                'brand': [brand],
                'media_url': [media_url],
                'price': [price],
                'event_price': [event_price],
                'cmr_price': [cmr_price],
                'total_reviews': [total_reviews],
                'rating': [rating]
            })])

        logger.info(f'Extracted {df.shape[0]} rows')
        df.reset_index(drop=True, inplace=True)
        logger.info('Finished extraction')
        return df

    def upload(df):
        logger.info('Starting upload')
        connection_string = f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
        time = pendulum.now(tz='America/Lima')
        df['time'] = time
        df['provider'] = 'entel'
        df.set_index('product_id', inplace=True)

        logger.info('Uploading to database')

        try:
            df.to_sql('products', connection_string, if_exists='append', index=True)
        except Exception as e:
            logger.error(f'Error uploading to database: {e}')

        logger.info('Finished upload')

    df = extract()
    upload(df)


if __name__ == '__main__':
    load_dotenv()
    run_falabella()
    run_entel()
