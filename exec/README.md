# 포팅 메뉴얼
## 필수 설치 (ubuntu)
install docker, docker-compose
```
sudo apt update
sudo apt install docker.io

sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version
```
## 환경 설치
```
docker network create infra

docker-compose up -d
```

### 루트 ngnix 설정
docker-compose 파일 경로에서<br>
[root_ngnix](root_ngnix) 파일 내용 넣기
#### Example
```
cd ./docker_volumes/nginx/vhost.d
vi www.example.com
```

참고 docker-compose.yml의 host와 도메인 주소가 일치해야함
```
  host-nginx:
    image: nginx
    container_name: host-nginx
    expose:
      - "80"
    environment:
      - VIRTUAL_HOST=www.example.com
      - LETSENCRYPT_HOST=www.example.com
      - LETSENCRYPT_EMAIL=test@example.com
    networks:
      - nginx-proxy
      - infra
      - api
```

## Jenkins 파이프 라인
요구사항 Default (Plugin)
```
NodeJs
Gradle
```

## Milvus 설치
```
wget https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh
bash standalone_embed.sh start
```

## AI 포팅메뉴얼
ai 폴더 내부에 있는 Dockerfile 실행
```angular2html
docker build -t name .
docker run -d name
```