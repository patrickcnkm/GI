#from .flaskr import app
import os
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager
from config import basedir


app = Flask(__name__)
db = SQLAlchemy(app)
app.config.from_object('config')

from flaskr import flaskr, models

