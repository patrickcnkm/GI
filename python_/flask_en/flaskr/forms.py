from flask.ext.wtf import Form
from wtforms import (
    widgets,
    StringField,
    TextField,
    TextAreaField,
    PasswordField,
    BooleanField,
    ValidationError
)
from wtforms.validators import Required, DataRequired, Length, EqualTo, URL




class LoginForm(Form):
    """Login Form"""

    username = TextField('username', [DataRequired(), Length(max=255)])
    password = TextField('password', [DataRequired()])

