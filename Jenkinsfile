pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Getting Sanskrit chatbot code...'
            }
        }

        stage('Check Python') {
            steps {
                sh 'python3 --version'
            }
        }

        stage('Syntax Check') {
            steps {
                sh 'python3 -m py_compile backend/translation_service.py'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd frontend && npm install && npm run build'
            }
        }
    }

    post {
        success {
            echo 'Sanskrit chatbot pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}