pipeline {
    // Use the custom pipeline dockerfile
    agent {
        dockerfile {
            filename 'Dockerfile'
            dir 'Pipeline'
            label 'MinutesMade-Pipeline'
        }
    }

    // These are the build stages
    stages {

        // Send build started notifications
        stage ('Start') {
            steps {
                slackSend (color: 'good', message: "Started ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                sh 'mkdir -p Build/reports'
                sh 'mkdir -p Build/reports/lizard'
            }
        }

        // Run tests for each individual service
        stage ('Test Services') {
            steps {
                echo "This is a Test"
            }
        }

        // Run the integration tests
        stage ('Test Integration') {
            steps {
                echo "This is a test"
            }
        }

        // Run code quality tools and analysis
        stage ('Code Quality') {
            steps {
                sh 'lizard --xml > Build/reports/lizard/code_complexity.xml'
                sh 'prettier --check "./**/*.js"'
            }
        }
    }

    // Run the steps after the build has finished
    post {
        always {
            archiveArtifacts artifacts: 'Build/', fingerprint: true
            junit 'Build/reports/**/*.xml'
        }

        success {
            slackSend (color: 'good', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} succeed! (<${env.BUILD_URL}|Open>)")
        }

        failure {
            slackSend (color: 'bad', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed! (<${env.BUILD_URL}|Open>)")
        }
    }
}
