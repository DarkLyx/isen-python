FROM python:3.9-slim-buster AS builder

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --target=/app/deps -r requirements.txt

COPY . .

FROM gcr.io/distroless/python3

WORKDIR /app

COPY --from=builder /app /app

USER nonroot:nonroot

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"] 