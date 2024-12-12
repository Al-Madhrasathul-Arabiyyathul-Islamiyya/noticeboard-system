# Noticeboard System

## Requirements

1. **Node.js** (with npm or Yarn)  
   Install Node.js using one of the following:

   - [nvm](https://github.com/nvm-sh/nvm) (recommended for managing multiple Node.js versions)
   - System package manager (e.g., `apt` or `yum`)

2. **Yarn**  
   Install Yarn globally:

   ```bash
   corepack enable
   ```

3. **Nginx**
   Install nginx System package manager

   ```bash
   # example with apt
   sudo apt install nginx
   ```

4. **Backend service**
   A systemd unit file is generated with the deploy script
   Alternative set up persistance with your own methods.

## Deployment Instructions

### Clone the Repository:

```bash
git clone https://your-repo-url.git
cd noticeboard-system
```

### Run the Deployment Script:

```bash
bash deploy.sh
```

### Configure NGINX: After running the script, copy the NGINX config:

```bash
sudo cp ~/noticeboard/noticeboard.conf /etc/nginx/sites-available/noticeboard
sudo ln -s /etc/nginx/sites-available/noticeboard /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

### Access the Applications:

Admin Panel: http://noticeboard.domain.tld
Client App: http://noticeboard.domain.tld/client
API: http://api.noticeboard.domain.tld
