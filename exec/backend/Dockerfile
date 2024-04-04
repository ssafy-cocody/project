FROM amazoncorretto:17-alpine
WORKDIR /app

COPY libs/cocodi-0.0.1-SNAPSHOT.jar /app/app.jar
COPY application.yml /app/application.yml

CMD ["java", "-jar", "app.jar"]
