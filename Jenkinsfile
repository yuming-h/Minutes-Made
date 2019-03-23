pipeline {
    // Use the custom pipeline dockerfile
    agent {
        dockerfile {
            filename 'Dockerfile'
            dir 'Pipeline'
            label 'MinutesMade-Pipeline'
            args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
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

        // Build the docker images for potential deployment
        stage ('Build Docker Images') {
            steps {
                sh 'docker-compose build'
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
                    sh 'pylint --rcfile=./.pylintrc **/*.py > Build/reports/pylint/pylint.log || exit 0'
                }}
                stage("ESLint") { steps {
                    sh 'mkdir -p Build/reports/eslint'
                    sh 'eslint **/*.js --quiet -f checkstyle -o Build/reports/eslint/eslint.xml || exit 0'
                }}
                stage("Prettier") { steps { sh 'prettier --check "./**/*.js"' }}
            }
        }

        // Push the docker images to the local registry
        stage ('Push Docker Images') {
            when {
                branch '26-docker-reg'
            }
            steps {
                sh 'docker-compose push'
            }
        }
    }

    // Run the steps after the build has finished
    post {
        always {
            // Permissions fix
            sh 'chown -R jenkins:jenkins ./'

            archiveArtifacts artifacts: 'Build/', fingerprint: true

            // junit 'Build/reports/tests/**/*.xml'
            recordIssues (tools: [esLint(pattern: 'Build/reports/eslint/*'),
                                  pyLint(pattern: 'Build/reports/pylint/*')])
        }

        success {
            // slackSend (color: 'good', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} succeed! (<${env.BUILD_URL}|Open>)")
            echo 'YAY!'
        }

        failure {
            echo 'Sad :('
            slackSend (color: 'bad', message: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed! (<${env.BUILD_URL}|Open>)")
        }
    }
}
