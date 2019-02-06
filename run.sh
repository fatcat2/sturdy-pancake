#!/bin/bash
echo "Committing to branch."
git add .
git commit -m "$(date)"
echo "Running dev server"
export FLASK_APP=main.py
export FLASK_DEBUG=main.py
flask run
