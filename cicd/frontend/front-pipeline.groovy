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
        HAS_FRONT_CHANGES = 'false'
        DEPLOY_STATE_FILE = 'front_deploy_state.txt'
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
                    if (sh(script: "git diff --name-only HEAD~1 | grep 'frontend/' || true", returnStdout: true).trim()) {
                        HAS_FRONT_CHANGES = 'true'
                    }
                    echo "Frontend changes: ${HAS_FRONT_CHANGES}"
                    echo "ls"
                }
            }
        }

        stage('Build and Deploy') {
            when {
                expression { return HAS_FRONT_CHANGES == 'true' }
            }
            steps {
                script {
                    def currentDir = sh(script: 'pwd', returnStdout: true).trim()
                    echo "The current directory is: ${currentDir}"
                    dir('frontend') {
                        sh 'mkdir -p ../../front'
                        sh 'rm -r ../../front/source/'
                        sh 'cp -r ./ ../../front/source/'
                    }
                    dir('../front') {
                        def buildTag = "build-${env.BUILD_NUMBER}"
                        sh "docker build -t frontend:${buildTag} ."
                    }
                }
            }
        }
        stage('Run') {
            when {
                expression { return HAS_FRONT_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        sh "docker stop frontend"
                        sh "docker rm frontend"
                    } catch (Exception ignored) {
                    }
                    sh "docker run -d --name frontend --network=infra frontend:build-${env.BUILD_NUMBER}"
                }
            }
        }
        stage('HealthCheck') {
            steps {
                script {
                    if (HAS_FRONT_CHANGES == 'true') {
                        def maxRetries = 60
                        def retries = 0
                        def success = false
                        def response = ''

                        while (!success && retries < maxRetries) {
                            try {
                                response = sh(script: "curl -s -o /dev/null -w '%{http_code}' -k http://frontend:3000", returnStdout: true).trim()
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
    }
}
