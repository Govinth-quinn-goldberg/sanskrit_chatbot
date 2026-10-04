pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Getting Sanskrit chatbot code...'
            }
        }

        stage('Jenkins Test') {
            steps {
                sh 'echo Jenkins is working!'
            }
        }

        stage('Show Files') {
            steps {
                sh 'ls -la'
            }
        }
    }

    post {
        success {
            echo 'Jenkins pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed.'
        }
    }
}