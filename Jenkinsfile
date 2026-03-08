pipeline {
    agent any

    environment {
        DEV_COMPOSE   = 'infrastructure/dev/docker-compose.yml'
        QA_COMPOSE    = 'infrastructure/qa/docker-compose.yml'
        PROD_COMPOSE  = 'infrastructure/prod/docker-compose.yml'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
            }
        }

        stage('Django Tests') {
            steps {
                echo '🐍 Running Django backend tests...'
                sh '''
                    cd backend
                    python3 -m venv .venv
                    . .venv/bin/activate
                    pip install -q -r requirements.txt
                    export SECRET_KEY=ci-test-key
                    export DEBUG=True
                    export DB_NAME=devdb
                    export DB_USER=devuser
                    export DB_PASSWORD=devpass
                    export DB_HOST=localhost
                    export DB_PORT=5432
                    python manage.py test
                '''
            }
            post {
                success { echo '✅ Django tests passed!' }
                failure { echo '❌ Django tests failed!' }
            }
        }

        stage('React Build') {
            steps {
                echo '⚛️ Building React frontend...'
                sh '''
                    cd frontend
                    npm ci
                    npm run build
                '''
            }
            post {
                success { echo '✅ React build successful!' }
                failure { echo '❌ React build failed!' }
            }
        }

        stage('Deploy to Dev') {
            steps {
                echo '🚀 Deploying to Dev environment...'
                sh '''
                    docker compose -f $DEV_COMPOSE down
                    docker compose -f $DEV_COMPOSE up -d --build
                '''
            }
            post {
                success { echo '✅ Dev deployment successful! http://localhost:80' }
                failure { echo '❌ Dev deployment failed!' }
            }
        }

        stage('Deploy to QA') {
            steps {
                echo '🚀 Deploying to QA environment...'
                input message: '👉 Approve deployment to QA?', ok: 'Deploy to QA'
                sh '''
                    docker compose -f $QA_COMPOSE down
                    docker compose -f $QA_COMPOSE up -d --build
                '''
            }
            post {
                success { echo '✅ QA deployment successful! http://localhost:81' }
                failure { echo '❌ QA deployment failed!' }
            }
        }

        stage('Deploy to Prod') {
            steps {
                echo '🚀 Deploying to Production environment...'
                input message: '⚠️ Approve deployment to PRODUCTION?', ok: 'Deploy to Prod'
                sh '''
                    docker compose -f $PROD_COMPOSE down
                    docker compose -f $PROD_COMPOSE up -d --build
                '''
            }
            post {
                success { echo '✅ Production deployment successful! http://localhost:82' }
                failure { echo '❌ Production deployment failed!' }
            }
        }
    }

    post {
        always {
            echo '🔔 Pipeline finished — check stage results above'
        }
        success {
            echo '🎉 Full pipeline completed successfully!'
            mail to: 'your@email.com',
                 subject: "✅ Build #${BUILD_NUMBER} passed",
                 body: "Pipeline completed successfully.\nBuild: ${BUILD_URL}"
        }
        failure {
            echo '🚨 Pipeline failed!'
            mail to: 'your@email.com',
                 subject: "❌ Build #${BUILD_NUMBER} failed",
                 body: "Pipeline failed at stage.\nCheck: ${BUILD_URL}"
        }
    }
}
