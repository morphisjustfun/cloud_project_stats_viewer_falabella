from flask import Flask, Response
from flask_sqlalchemy import SQLAlchemy
import os
from datetime import datetime
from pytz import timezone
import json
import pandas as pd
from dotenv import load_dotenv
from flask_cors import cross_origin
from sqlalchemy import select, column, bindparam, text


class Utils:
    @staticmethod
    def get_template_response_error(status, error, code, message, type_error='SYSTEM'):
        current_timestamp_str = datetime.now(tz=timezone('America/Lima')).strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        error = str(error)
        return json.dumps(
            {
                'timestamp': current_timestamp_str,
                'status': status,
                'error': error,
                'code': code,
                'typeError': type_error,
                'message': message
            }
        )

    @staticmethod
    def get_template_response_success(data):
        return json.dumps(data)


def get_database_uri():
    user = os.getenv('DB_USER')
    password = os.getenv('DB_PASSWORD')
    host = os.getenv('DB_HOST')
    port = os.getenv('DB_PORT')
    db_name = os.getenv('DB_NAME')
    return f'postgresql://{user}:{password}@{host}:{port}/{db_name}'


def register_general_routes(app, db):
    @app.errorhandler(500)
    def handle_500_error(e):
        json_response = Utils.get_template_response_error(500, e, '500', 'Error interno del servidor')
        return Response(status=500, response=json_response, mimetype='application/json')

    @app.errorhandler(413)
    def handle_413_error(e):
        json_response = Utils.get_template_response_error(413, e, '413',
                                                          'El cuerpo de la solicitud es demasiado grande')
        return Response(status=413, response=json_response, mimetype='application/json')

    @app.errorhandler(405)
    def handle_405_error(e):
        json_response = Utils.get_template_response_error(405, e, '405', 'Método no permitido')
        return Response(status=405, response=json_response, mimetype='application/json')

    @app.get('/history-product/<product_id>')
    @cross_origin()
    def get_history_product(product_id):
        stmt = select(
            column('time'), column('price'), column('event_price'), column('cmr_price'), column('total_reviews'),
            column('rating')).select_from(text('products')).where(column('product_id') == bindparam('product_id'))
        df = pd.read_sql(stmt, db.engine, params={'product_id': product_id})
        data = df.to_dict(orient='records')
        provider = select(column('provider')).select_from(text('products')).where(
            column('product_id') == bindparam('product_id'))
        provider_df = pd.read_sql(provider, db.engine, params={'product_id': product_id})
        if provider_df.shape[0] == 0:
            return Response(status=404, response=Utils.get_template_response_error(404, 'Not Found', '404',
                                                                                  'No se encontró el producto'))
        provider = provider_df.iloc[0, 0]
        return Response(status=200, response=Utils.get_template_response_success({
            'provider': provider,
            'history': data
        }), mimetype='application/json')

    @app.get('/health')
    @cross_origin()
    def health():
        return Response(status=200, response=Utils.get_template_response_success({'ok': True}),
                        mimetype='application/json')


def create_app():
    db = SQLAlchemy()
    app = Flask(__name__)
    app.config[
        'SQLALCHEMY_DATABASE_URI'] = get_database_uri()

    pool_pre_ping = os.getenv('POOL_PRE_PING') == 'True'

    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "pool_pre_ping": pool_pre_ping
    }

    db.init_app(app)

    register_general_routes(app, db)

    return app


def run():
    load_dotenv()
    app = create_app()
    return app
