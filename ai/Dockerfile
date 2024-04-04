FROM python:3.12

WORKDIR /app

COPY merge_image.py ./merge_image.py
COPY outfit_item_search.py ./outfit_item_search.py
COPY single_item_search.py ./single_item_search.py
COPY clothes_detection.pt ./clothes_detection.pt

COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "./single_item_search.py"]
CMD ["python", "./outfit_item_search.py"]
CMD ["python", "./merge_image.py"]
