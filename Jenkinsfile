pipeline {
    agent any

      environment {
        DOCKER_USER = "maitanchan"
        BE_IMAGE = "maitanchan/backend-streaming"
        FE_IMAGE = "maitanchan/frontend-streaming"
    }

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main', url: 'https://github.com/buvghhj/nestjs-streaming-application.git'

            }

        }

         stage('Build Backend') {

            steps {

                sh 'cd be && npm install && npm run build'

                sh 'docker build -t $BE_IMAGE:latest -f be/Dockerfile be/'

            }

        }

        
        stage('Build Frontend') {

            steps {

                sh 'cd fe && npm install --force && npm run build'

                sh 'docker build -t $FE_IMAGE:latest -f fe/Dockerfile fe/'

            }

        }

          stage('Push to Docker Hub') {

            steps {

                withDockerRegistry([credentialsId: '123', url: '']) {

                    sh 'docker push $BE_IMAGE:latest'

                    sh 'docker push $FE_IMAGE:latest'

                }

            }

    }
    
}
