# coinlet-dex
Decentralised exchange script - open source

Installation of the DEX on Ubuntu server 14.04 | 16.04

<strong>NODE Installation:</strong>
<p>● Login to the server</p>
<p>● Run the following commands on terminal</p>
<p>● curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -</p>
<p>● sudo apt-get install -y nodejs</p>
<p></p>
<strong>Mongo Installation:</strong>
<p>Import the public key used by the package management system.</p>
<p>The Ubuntu package management tools (i.e. dpkg and apt) ensure package consistency and
authenticity by requiring that distributors sign packages with GPG keys. Issue the following
command to import the MongoDB public GPG Key.</p>
<p>sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4</p>
<p>Create a list file for MongoDB.</p>
<p>Create the /etc/apt/sources.list.d/mongodb-org-4.0.list list file using the command appropriate
for your version of Ubuntu</p>
<p><strong>Ubuntu 14.04</strong></p>
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/4.0 multiverse" | sudo tee/etc/apt/sources.list.d/mongodb-org-4.0.list</p>
<p><strong>Ubuntu 16.04</strong></p>
<p>echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list</p>
<p>Reload local package database.</p>
<p>Issue the following command to reload the local package database</p>
<p>sudo apt-get update</p>
<p>Install the MongoDB packages</p>
<p>Issue the following command</p>
<p>sudo apt-get install -y mongodb-org</p>
<p></p>
<strong>DEX-BACKEND Installation</strong>
<p>● Login to the server</p>
<p>● Paste the dex-back-end code in server</p>
<p>● Run sudo apt install build-essential</p>
<p>● Run the following commands to open the ports.</p>
<p>○ ufw allow 9000</p>
<p>○ ufw allow 22</p>
<p><p>○ ufw allow 80</p>
<p>○ ufw enable</p>
<p>○ If you face a issue while running, run the commands with sudo</p>
<p>○ PS: for amazon ubuntu you need to open the ports using amazon aws console.</p>
<p>● CD into the directory</p>
<p>● Issue npm install</p>
<p>● Configure the fields in config.js</p>
<p>● Run npm start</p>
<p>● Open your_domain_name.com:9000 or your_ip_address:9000 in the browser</p>
<p>● To View admin panel your_domain_name.com:9000/admin/login or your_ip_address:9000/admin/login in the browser</p>
<p>● If everything is fine. Configure the url in dex-front-end config.js</p>
<p>● To run the dex-back-end in the background</p>
<p>○ npm install -g pm2</p>
<p>○ CD into the dex-back-end directory</p>
<p>○ Run pm2 start app.js</p>
<p></p>
<strong>DEX-FRONTEND Installation</strong>
<p>● Login to the server</p>
<p>● Run sudo apt install apache2</p>
<p>● Paste the content of the dex-front-end code in /var/www/html (don't move the folder, just the content alone)</p>
<p>● CD into the /var/www/html</p>
<p>● Configure the your_domain_name.com:9000 or your_ip_address:9000 in 'apiServer' field of config.js</p>
<p>● Configure the other fields in config.js</p>
<p>● Run npm install -g browserify</p>
<p>● Run chmod +x browserify.sh</p>
<p>● Run ./browserify.sh.</p>
<p>● Open your_domain_name.com or your_ip_address in the browser</p>

This repository is as is and no support it provided, contributions are welcomed, I myself will be contributing to this repository too, I do not take responsibility for any losses.
