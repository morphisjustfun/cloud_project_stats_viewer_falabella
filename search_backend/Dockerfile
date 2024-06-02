FROM python:3.11.3-slim-buster

COPY . /app

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV SCRIPT_NAME /api

RUN pip install --no-cache-dir -r requirements.txt
