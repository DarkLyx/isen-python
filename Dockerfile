FROM python:3.9-slim-buster

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

USER appuser

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]