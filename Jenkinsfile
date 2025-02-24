pipeline {
    agent {
        docker{
            image 'papitodev/playwright-nj-v1.50.1-noble'
            args '--network qatw-1_skynet'
        }
    }

    environment {
        SLACK_CHANNEL = 'jenkins-notifications'
        SLACK_TOKEN = 'slack-token'
    }

    stages {
        stage('Node.js Deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('E2E Tests') {
            steps {
                sh 'npx playwright test'
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }

    post {
        success {
            slackSend color: "#6AA84F", channel: env.SLACK_CHANNEL, 
                       message: "✅ Os testes do sistema ${env.JOB_NAME} foram executados com sucesso! 🚀\nBuild: ${env.BUILD_NUMBER}\n🔗 Acesse: ${env.BUILD_URL}",
                      tokenCredentialId: env.SLACK_TOKEN
        }
        failure {
            slackSend color: "#D9534F", channel: env.SLACK_CHANNEL, 
                      message: "❌ Falha nos testes do sistema ${env.JOB_NAME}! ⚠️\nBuild: ${env.BUILD_NUMBER}\n🔗 Acesse: ${env.BUILD_URL} para mais detalhes.",
                      tokenCredentialId: env.SLACK_TOKEN
        }
    }
}
