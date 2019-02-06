#!/bin/bash
git add .
git commit -m "$(date)"
export FLASK_APP=main.py
export FLASK_DEBUG=main.py
flask run
