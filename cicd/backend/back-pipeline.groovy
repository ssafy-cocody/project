pipeline {
    agent any
    tools {
        nodejs "nodejs"
        gradle "gradle"
    }
    options {
        disableConcurrentBuilds()
    }
    environment {
        HAS_BACK_CHANGES = 'false'
        DEPLOY_STATE_FILE = 'backend_deploy_state.txt'
    }
    stages {

        stage('Checkout') {
            steps {
                git branch: 'develop', credentialsId: 'test', url: 'https://lab.ssafy.com/s10-bigdata-dist-sub2/S10P22A307.git'
                script {
                    def branchName = sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim()
                    if (branchName != 'develop') {
                        echo "This job only runs on the master branch. Current branch is ${branchName}. Aborting the build."
                        currentBuild.result = 'ABORTED'
                        return
                    }
                    if (sh(script: "git diff --name-only HEAD~1 | grep 'backend/' || true", returnStdout: true).trim()) {
                        HAS_BACK_CHANGES = 'true'
                    }
                    echo "Backend changes: ${HAS_BACK_CHANGES}"
                    echo "ls"
                }
            }
        }

        stage('Build and Deploy') {
            when {
                expression { return HAS_BACK_CHANGES == 'true' }
            }
            steps {
                script {
                    dir('backend') {
                        sh 'bash gradlew build -x test'
                        sh 'cp -r build/libs/ ../../back/'
                    }
                    dir('../back') {
                        sh 'docker rmi -f backend:latest'
                        sh 'docker build -t backend .'
                    }
                }
            }
        }

        stage('Run') {
            when {
                expression { return HAS_BACK_CHANGES == 'true' }
            }
            steps {
                script {
                    if (fileExists(DEPLOY_STATE_FILE)) {
                        env.CURRENT_ENV = readFile(DEPLOY_STATE_FILE).trim()
                    } else {
                        env.CURRENT_ENV = 'GREEN'
                    }
                    env.NEXT_ENV = (CURRENT_ENV == 'BLUE') ? 'GREEN' : 'BLUE'
                    sh "docker ps -a -q --filter \"name=^/backend-${NEXT_ENV}\$\" | xargs -r docker stop"
                    sh "docker ps -a -q --filter \"name=^/backend-${NEXT_ENV}\$\" | xargs -r docker rm"
                    sh "docker run -d --name backend-${NEXT_ENV} --network=infra backend"
                }
            }
        }

        stage('HealthCheck') {
            steps {
                script {
                    if (HAS_BACK_CHANGES=='true') {
                        def maxRetries = 60
                        def retries = 0
                        def success = false
                        def response = ''
                        while (!success && retries < maxRetries) {
                            try {
                                response = sh(script: "curl -s -o /dev/null -w '%{http_code}' -k http://backend-${NEXT_ENV}:8080/public/health", returnStdout: true).trim()
                                if (response == '200') {
                                    success = true
                                    echo "Service is up and running"
                                    writeFile file: DEPLOY_STATE_FILE, text: NEXT_ENV
                                } else {
                                    throw new Exception("Service response code: ${response}")
                                }
                            } catch (Exception ignored) {
                                retries++
                                echo "Attempt ${retries}/60: Service not ready, response code: ${response}"
                                if (response == '000') {
                                    echo "Network connection failed, retrying..."
                                } else {
                                    echo "Unexpected response code, retrying..."
                                }
                                sleep(time: 1, unit: 'SECONDS')
                            }
                        }

                        if (!success) {
                            error("Health check failed after ${maxRetries} attempts")
                        }
                    }
                }
            }
        }

        stage('Traffic Switching') {
            when {
                expression { return HAS_BACK_CHANGES == 'true' }
            }
            steps {
                script {
                    sleep(time: 5, unit: 'SECONDS')
                    sh "docker exec nginx-proxy cp /etc/nginx/vhost.d/deploy/${NEXT_ENV} /etc/nginx/vhost.d/j10a307.p.ssafy.io"
                    sh "docker exec nginx-proxy nginx -s reload"
                    sh "docker ps -a -q --filter \"name=^/backend-${CURRENT_ENV}\$\" | xargs -r docker stop"
                    sh "docker ps -a -q --filter \"name=^/backend-${CURRENT_ENV}\$\" | xargs -r docker rm"

                    response = sh(script: "curl -s -o /dev/null -w '%{http_code}' -k https://j10a307.p.ssafy.io/api/public/health", returnStdout: true).trim()
                    if (response == '200') {
                        success = true
                        echo "Service is up and running"
                        writeFile file: DEPLOY_STATE_FILE, text: NEXT_ENV
                    } else {
                        throw new Exception("Service response code: ${response}")
                    }
                }
            }
        }
    }
}
