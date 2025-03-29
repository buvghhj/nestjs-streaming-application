pipeline {
    agent any

      environment {
        DOCKER_USER = "your-dockerhub-username"
        BE_IMAGE = "your-dockerhub-username/backend-streaming"
        FE_IMAGE = "your-dockerhub-username/frontend-streaming"
    }

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main', url: 'https://github.com/buvghhj/nestjs-streaming-application.git'

            }

        }

    }
    
}
