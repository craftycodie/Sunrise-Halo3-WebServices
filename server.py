from flask import Flask
from flask_uuid import FlaskUUID
import os
import routes

# import config if present
try: import config
except: pass

app = Flask(__name__,
            static_folder='public/',
            template_folder='templates')
            
FlaskUUID(app)

app.config['MONGO_DBNAME'] = os.getenv("MONGO_DBNAME")
app.config['MONGO_URI'] = os.getenv("MONGO_URI")
secretkey = os.getenv("SECRET_KEY")
app.secret_key = secretkey

app.config.update(dict(
    DEBUG = True,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 465,
    MAIL_USE_TLS = False,
    MAIL_USE_SSL = True,
    MAIL_USERNAME = os.getenv("EMAIL_USER"),
    MAIL_PASSWORD = os.getenv("EMAIL_PASSWORD"),
))

#mongo = PyMongo(app)
mongo = None

routes.register_routes(app, mongo)