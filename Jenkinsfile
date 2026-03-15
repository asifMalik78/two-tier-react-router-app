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
        stage ('Pushing Image to Dodkerhub') {
            steps {
                sh 'docker tag todo-app-image asifmalik78/todo-app-image:latest'
                sh 'docker push asifmalik78/todo-app-image:latest'
            }
        }
        stage('Deploying') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d --build todo-app'
            }
        }
    }
    post {
        always {
            emailext(
                subject: "Jenkins Build ${currentBuild.currentResult}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                mimeType: 'text/html',
                body: """
                <html>
                <body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
                    
                    <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden;border:1px solid #ddd;">
                        
                        <div style="background:#4CAF50;color:white;padding:15px;text-align:center;">
                            <h2>Jenkins Build Notification</h2>
                        </div>
    
                        <div style="padding:20px;">
                            <p>Hello,</p>
                            <p>Your Jenkins pipeline has completed.</p>
    
                            <table style="width:100%;border-collapse:collapse;">
                                <tr>
                                    <td style="padding:8px;font-weight:bold;">Job Name</td>
                                    <td style="padding:8px;">${env.JOB_NAME}</td>
                                </tr>
                                <tr style="background:#f2f2f2;">
                                    <td style="padding:8px;font-weight:bold;">Build Number</td>
                                    <td style="padding:8px;">${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px;font-weight:bold;">Status</td>
                                    <td style="padding:8px;">${currentBuild.currentResult}</td>
                                </tr>
                            </table>
    
                            <p style="margin-top:20px;">
                                <a href="${env.BUILD_URL}" 
                                   style="background:#2196F3;color:white;padding:10px 15px;text-decoration:none;border-radius:5px;">
                                   View Build Logs
                                </a>
                            </p>
    
                        </div>
    
                        <div style="background:#f4f4f4;padding:10px;text-align:center;font-size:12px;color:#666;">
                            Jenkins CI/CD Pipeline
                        </div>
    
                    </div>
    
                </body>
                </html>
                """,
                to: "asifmalik.aktu@gmail.com"
            )
        }
    }
}
