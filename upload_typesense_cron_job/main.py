import pandas as pd
from dotenv import load_dotenv
import os
import logging
import time
import typesense

logger = logging.getLogger(__name__)
logging.basicConfig(format='%(asctime)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')
logger.setLevel(logging.INFO)


def extract():
    connection_string = f'postgresql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
    logger.info('Starting extraction')
    df = pd.read_sql_table('products', connection_string)
    df = df[['product_id', 'sku_id', 'product_name', 'url', 'brand', 'media_url']]
    df.drop_duplicates(inplace=True)
    logger.info(f'Extracted {df.shape[0]} rows')
    logger.info('Finished extraction')
    return df


def upload(df):
    schema = {
        'name': 'products',
        'fields': [
            {'name': 'product_id', 'type': 'string', 'index': False},
            {'name': 'sku_id', 'type': 'string', 'index': False},
            {'name': 'product_name', 'type': 'string'},
            {'name': 'url', 'type': 'string', 'index': False},
            {'name': 'brand', 'type': 'string', 'facet': True},
            {'name': 'media_url', 'type': 'string', 'index': False},
        ],
    }

    client = typesense.Client({
        'nodes': [{
            'host': os.getenv('TYPESENSE_HOST'),
            'port': os.getenv('TYPESENSE_PORT'),
            'protocol': 'http'
        }],
        'api_key': os.getenv('TYPESENSE_API_KEY'),
        'connection_timeout_seconds': 10
    })

    collections = client.collections.retrieve()

    if 'products' in [collection['name'] for collection in collections]:
        logger.info('Schema exists, deleting')
        client.collections['products'].delete()
        time.sleep(2)

    logger.info('Creating schema')
    client.collections.create(schema)

    documents = df.to_dict(orient='records')
    logger.info('Uploading to typesense')
    client.collections['products'].documents.import_(documents, batch_size=100)
    logger.info('Data uploaded to typesense')


if __name__ == '__main__':
    load_dotenv()
    df = extract()
    upload(df)
