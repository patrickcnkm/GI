# all the imports
import os
import sqlite3

from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash
     
app = Flask(__name__) # create the application instance :)
app.config.from_object(__name__) # load config from this file , flaskr.py

app.config.from_envvar('FLASKR_SETTINGS', silent=True)
from flask import render_template, flash, redirect, session, url_for, request, g
from flask.ext.login import login_user, logout_user, current_user, login_required
from flaskr import db, app, models
from flaskr.forms import LoginForm
from flaskr.models import User, ROLE_USER, ROLE_ADMIN


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        form = LoginForm()
        a = User.query.filter_by(username=form.username.data,password=form.password.data).first()
        b = str(a)
        if a is None:
            session['log_in'] = False
            return redirect(url_for('login'))
        elif b == '<User \'admin\'>':
            return render_template('haha.html')
        return render_template('haha.html')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    #flash('You were logged out')
    return render_template('login.html')



