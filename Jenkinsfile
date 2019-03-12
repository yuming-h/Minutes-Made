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
                // slackSend (color: 'good', message: "Started ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)")
                sh 'mkdir -p Build/reports'
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
            parallel {
                stage("LizardCCC") { steps {
                    sh 'mkdir -p Build/reports/lizard'
                    sh 'lizard > Build/reports/lizard/lizard-ccc.txt'
                }}
                stage("PyLint") { steps { 
                    sh 'mkdir -p Build/reports/pylint'
                    sh 'pylint --rcfile=./.pylintrc **/*.py > Build/reports/pylint/pylint.log'
                }}
                stage("ESLint") { steps {
                    sh 'mkdir -p Build/reports/eslint'
                    sh 'eslint **/*.js --quiet -f checkstyle -o Build/reports/eslint/eslint.xml'
                }}
                stage("Prettier") { steps { sh 'prettier --check "./**/*.js"' }}
            }
        }
    }

    // Run the steps after the build has finished
    post {
        always {
            archiveArtifacts artifacts: 'Build/', fingerprint: true
            
            // junit 'Build/reports/tests/**/*.xml'
            recordIssues (tools: [esLint(pattern: 'Build/reports/eslint/*'),
                                  pyLint(pattern: 'Build/reports/pylint/*')])
        }

        success {
            slackSend (color: 'good', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} succeed! (<${env.BUILD_URL}|Open>)")
        }

        failure {
            // slackSend (color: 'bad', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed! (<${env.BUILD_URL}|Open>)")
            echo 'bad'
        }
    }
}
