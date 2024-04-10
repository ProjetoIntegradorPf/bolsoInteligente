FROM python:3.10 AS backend-build

WORKDIR /app/backend

COPY backend/ .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
