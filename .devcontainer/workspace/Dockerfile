FROM mcr.microsoft.com/playwright:jammy

ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    zsh \
    curl \
    nano \
    nmap \
    unzip \
    gnupg \
    software-properties-common \
    apt-transport-https \
    git \
    lsof \
    bc \
    wget \
    iputils-ping \
    fontconfig \
    jq

# Install Node.js
COPY package.json .
RUN NODE_VERSION=$(cat /package.json | jq -r '.engines.node' | cut -d '.' -f 1 | tr -d '^') \
  && curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf ./package.json

# Install Docker
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add - \
    && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu jammy stable" \
    && apt-get install -y docker-ce docker-ce-cli containerd.io

# Install pnpm and nx
RUN npm install -g pnpm nx ts-node depcheck

COPY .devcontainer/workspace/p10k.zsh .p10k.zsh



# Install Oh My Zsh and Powerlevel10k
RUN curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh | sh - \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/custom/themes/powerlevel10k \
    && sed -i 's/ZSH_THEME=".*"/ZSH_THEME="powerlevel10k\/powerlevel10k"/g' ~/.zshrc \
    && echo 'source ~/.oh-my-zsh/custom/themes/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc \
    && mv .p10k.zsh  ~/.p10k.zsh \
    && echo '[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh' >> ~/.zshrc

# Install grpcurl
RUN curl -fsSL "https://github.com/fullstorydev/grpcurl/releases/download/v1.9.1/grpcurl_1.9.1_linux_x86_64.tar.gz" | tar -xz -C /usr/local/bin

# Install docker-credential-helpers
RUN wget -O docker-credential-pass https://github.com/docker/docker-credential-helpers/releases/download/v0.8.2/docker-credential-pass-v0.8.2.linux-amd64 \
    && chmod +x docker-credential-pass \
    && mv docker-credential-pass /usr/local/bin

# Set default shell
ENV SHELL=/bin/zsh

# Copy entrypoint script and give execution permissions
COPY .devcontainer/workspace/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY .devcontainer/workspace/info.sh /usr/bin/info
RUN chmod +x /usr/bin/info && echo "info" >> ~/.zshrc

# Set entrypoint and command
WORKDIR /ebizbase
ENTRYPOINT ["/entrypoint.sh"]
CMD ["tail", "-f", "/dev/null"]
