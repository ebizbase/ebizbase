#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to display system information
display_system_info() {
  local os_info=$(lsb_release -d | cut -f2)
  local node_version=$(node -v)
  local pnpm_version=$(pnpm -v)
  local total_memory=$(free -h | grep Mem | awk '{print $2}')
  local used_memory=$(free -h | grep Mem | awk '{print $3}')
  local total_containers=$(docker ps -q | wc -l)
  local total_images=$(docker images -q | wc -l)
  local container_used_memory=$(docker stats --no-stream --format "{{.MemUsage}}" | awk '{sum += $1} END {print sum}')

  echo -e "${YELLOW}"
  echo ""
  echo "eBizeBase Development Container$os_info"
  echo ""
  echo -e "${NC}===============================================${NC}"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Total memory" "$total_memory"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Used memory" "$used_memory"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Total containers" "$total_containers"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Total images" "$total_images"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Container used memory" "$container_used_memory"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Node" "$node_version"
  printf "${MAGENTA}%-25s: %s${NC}\n" "Pnpm" "$pnpm_version"
  echo -e "${NC}===============================================${NC}"
}

# Function to extract domains from a given nginx config file
extract_domains() {
  local file=$1
  grep -v '^\s*#' "$file" | grep -oP 'server_name\s+\K[^;]+' | tr -s ' ' '\n' | sort -u
}

# Function to check if a domain is proxied with HTTP
is_http_proxy_pass() {
  local file=$1
  local domain=$2
  grep -v '^\s*#' "$file" | grep -P "server_name\s+.*$domain" -A 20 | grep -q 'proxy_pass\s\+http://'
}
# Function to display domains from a specific file
display_domains() {
  local file=$1
  local title=$2
  local color=$3
  echo -e "${BLUE}$title${NC}"
  if [ -f "$file" ]; then
    local http_domains=()
    local other_domains=()
    while IFS= read -r domain; do
      if is_http_proxy_pass "$file" "$domain"; then
        http_domains+=("$domain")
      else
        other_domains+=("$domain")
      fi
    done < <(extract_domains "$file")

    for domain in "${http_domains[@]}"; do
      echo -e "${color}$domain ${NC}${BLUE}(Open)\e]8;;http://$domain\a\e]8;;\a${NC}"
    done

    for domain in "${other_domains[@]}"; do
      echo -e "${color}$domain${NC}"
    done
  else
    echo -e "${RED}File not found: $file${NC}"
  fi
}

# Main script execution
display_system_info
display_domains "/ebizbase/.devcontainer/nginx/nginx.conf" "External Services Domains:" "${CYAN}"
echo -e "${NC}===============================================${NC}"
display_domains "/ebizbase/nginx.conf" "Internal Services Domains:" "${GREEN}"
