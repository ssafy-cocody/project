from ultralytics import YOLO
import os
import random
import matplotlib.pyplot as plt
import cv2
import numpy as np
import tqdm
import shutil

# Colorful fashion 학습데이터 경로 세팅
# secrets 정보 가져오기
with open("./secrets.json", encoding="utf-8") as f:
    config = json.load(f)

config = config["yolo"]

images_path = config["image_path"]
annotations_path = config["annotation_path"]
path = config["path"]
names: ['sunglass','hat','jacket','shirt','pants','shorts','skirt','dress','bag','shoe']


def convert(size,x,y,w,h):
    box = np.zeros(4)
    dw = 1./size[0]
    dh = 1./size[1]
    x = x/dw
    w = w/dw
    y = y/dh
    h = h/dh
    box[0] = x-(w/2.0)
    box[1] = x+(w/2.0)
    box[2] = y-(h/2.0)
    box[3] = y+(h/2.0)

    return (box)


def plot_annotations(img, filename):
    img_copy = img.copy()  # 이미지의 복사본을 만듭니다.
    with open(annotations_path + filename, 'r') as f:
        for line in f:
            value = line.split()
            cls = int(value[0])
            x = float(value[1])
            y = float(value[2])
            w = float(value[3])
            h = float(value[4])

            img_h, img_w = img.shape[:2]
            bb = convert((img_w, img_h), x, y, w, h)
            cv2.rectangle(img_copy, (int(round(bb[0])), int(round(bb[2]))), (int(round(bb[1])), int(round(bb[3]))), (255, 0, 0), 2)

    plt.axis('off')
    plt.imshow(img_copy)


plt.figure(figsize=(20,12))
ls = os.listdir(images_path)
c = 1
for i in random.sample(ls, 10):
    img = plt.imread(images_path+i)
    i = i.rstrip('.jpg') + '.txt'
    plt.subplot(2,5, c)
    plot_annotations(img, i)
    c+=1

train = []
with open(path+'ImageSets/Main/trainval.txt', 'r') as f:
    for line in f.readlines():
        if line[-1]=='\n':
            line = line[:-1]
        train.append(line)

test = []
with open(path+'ImageSets/Main/test.txt', 'r') as f:
    for line in f.readlines():
        if line[-1]=='\n':
            line = line[:-1]
        test.append(line)

# 지도학습 데이터 디렉토리 생성
os.mkdir('train')
os.mkdir('train/images')
os.mkdir('train/labels')

os.mkdir('test')
os.mkdir('test/images')
os.mkdir('test/labels')

# 데이터셋 설정
train_path = config["train_path"]
test_path = config["test_path"]

print('Copying Train Data..!!')
for i in tqdm.tqdm(train):
    a = shutil.copyfile(images_path+i+'.jpg', train_path+'images/'+i+'.jpg')
    a = shutil.copyfile(annotations_path+i+'.txt', train_path+'labels/'+i+'.txt')

print('Copying Test Data..!!')
for i in tqdm.tqdm(test):
    a = shutil.copyfile(images_path+i+'.jpg', test_path+'images/'+i+'.jpg')
    a = shutil.copyfile(annotations_path+i+'.txt', test_path+'labels/'+i+'.txt')


# 커스텀 모델 학습
# yaml 만들기
text = """
train: /home/j-j10a307/working/train
val: /home/j-j10a307/working/test

# number of classes
nc: 10

# class names
names: ['sunglass','hat','jacket','shirt','pants','shorts','skirt','dress','bag','shoe']
"""
with open("data.yaml", 'w') as file:
    file.write(text)

# 모델 학습
clothes_detection_model = YOLO("yolov8n.pt")
clothes_detection_model.train(data='data.yaml', epochs=5)

# Export the model
# clothes_detection_model.export(format='onnx')