pipeline {
    agent { 
        label 'dev' 
    }
    stages {
        stage('Clonning Repo') {
            steps {
                git url: 'https://github.com/asifMalik78/two-tier-react-router-app.git' , branch: 'main'
            }
        }
        stage('Building Docker Image') {
            steps {
                sh 'docker build -t todo-app-image -f ./Dockerfile.prod .'
            }
        }
        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]){
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }
        stage('Deploying') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build todo-app'
            }
        }
    }
}
