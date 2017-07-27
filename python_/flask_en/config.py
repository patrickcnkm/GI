import os
basedir = os.path.abspath(os.path.dirname(__file__))

CSRF_ENABLED = True
SECRET_KEY = 'you-will-never-guess'
    
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'flaskr.db')
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')

class Config:
    SECRET_KEY = 'you-will-never-guess'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    FLASKY_ADMIN = os.environ.get('FLASKY_ADMIN')