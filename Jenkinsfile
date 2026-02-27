pipeline {
    agent any

    environment {
        registryCredential = 'jenkins_registry'
        branchname = env.BRANCH_NAME?.toLowerCase() ?: 'main'
        // URL base das APIs em QA (Vite injeta em build time; precisa ser definido antes do npm run build)
        QA_API_BASE = 'https://qa-sigla.sme.prefeitura.sp.gov.br'
    }

    options {
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Preparar .env para build') {
            steps {
                script {
                    // Diretório do frontend: monorepo ou repo só do frontend
                    frontendDir = fileExists('SME-SIGLA-ALVO-Frontend/package.json') ? 'SME-SIGLA-ALVO-Frontend' : '.'
                    // Paths alinhados aos jobs/serviços no Jenkins e Rancher (sme-alvo-* e sme-locus-*)
                    envContent = """
VITE_PROCESSOS_CONVOCACAO_API_URL=${env.QA_API_BASE}/sme-alvo-ms-proc-convocacao
VITE_CONCURSOS_API_URL=${env.QA_API_BASE}/sme-alvo-ms-concursos
VITE_CANDIDATOS_API_URL=${env.QA_API_BASE}/sme-alvo-ms-candidatos
VITE_IMPORTACAO_ARQUIVOS_API_URL=${env.QA_API_BASE}/sme-locus-ms-imp-arquivos
VITE_ADMIN_USUARIOS_API_URL=${env.QA_API_BASE}/sme-locus-ms-admin-usuarios
VITE_ESCOLHAS_API_URL=${env.QA_API_BASE}/sme-alvo-ms-escolha
VITE_AGENDA_API_URL=${env.QA_API_BASE}/sme-alvo-ms-agenda
VITE_RELATORIOS_API_URL=${env.QA_API_BASE}/sme-alvo-ms-relatorios
"""
                    writeFile file: "${frontendDir}/.env", text: envContent.trim()
                }
            }
        }

        stage('Build e push da imagem Docker') {
            when {
                anyOf {
                    branch 'test'
                    branch 'master'
                    branch 'main'
                    branch 'develop'
                    branch 'release'
                    branch 'homolog'
                }
            }
            steps {
                script {
                    frontendDir = fileExists('SME-SIGLA-ALVO-Frontend/package.json') ? 'SME-SIGLA-ALVO-Frontend' : '.'
                    imagename = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/sme-alvo-frontend"
                    dir(frontendDir) {
                        dockerImage = docker.build(imagename, '-f Dockerfile .')
                        docker.withRegistry('https://registry.sme.prefeitura.sp.gov.br', registryCredential) {
                            dockerImage.push()
                        }
                        sh "docker rmi ${imagename} || true"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                def img = "registry.sme.prefeitura.sp.gov.br/${env.branchname}/sme-alvo-frontend"
                sh "docker rmi ${img} || true"
            }
        }
    }
}
