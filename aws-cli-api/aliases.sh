function aws-cli-api-ssh-github-init {
  echo 'Copy and paste these commands to init GITHUB'
  echo 'eval "$(ssh-agent -s)"'
	echo 'ssh-add ~/.ssh/sensor_install_dashboard_github_id_ed25519'
}

function aws-cli-api-gitpull-and-update {
	cd ~/hyphae-geodashboard/
	git pull
	cd ~/aws_cli_api/
	cp ~/hyphae-geodashboard/aws-cli-api/*.* .
}

function aws-cli-api-start-in-bg {
	cd ~/aws_cli_api/
	./check_node_running.sh . restart background
}

function aws-cli-api-start {
	cd ~/aws_cli_api/
	./check_node_running.sh . restart
}

function aws-cli-api-stop {
	cd ~/aws_cli_api/
	./check_node_running.sh . stop
}

function aws-cli-api-status {
	cd ~/aws_cli_api/
	./check_node_running.sh .
}
