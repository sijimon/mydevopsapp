FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io
RUN usermod -aG docker jenkins
USER jenkins
RUN jenkins-plugin-cli --plugins \
  git \
  workflow-aggregator \
  pipeline-stage-view \
  docker-workflow \
  email-ext \
  mailer \
  credentials-binding \
  ws-cleanup \
  timestamper \
  ant \
  gradle
