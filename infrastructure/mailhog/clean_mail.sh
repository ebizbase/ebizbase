#!/bin/sh

MAILHOG_API_URL="http://127.0.0.1:8025/api/v2/messages"
DELETE_BEFORE_MINUTES=${DELETE_BEFORE_MINUTES:-10}
INTERVAL_MINUTES=${INTERVAL_MINUTES:-5}

# Hàm để chờ MailHog khởi động
wait_for_mailhog() {
    while true; do
        if curl -s $MAILHOG_API_URL > /dev/null; then
            echo "MailHog is up and running."
            break
        fi
        echo "Waiting for MailHog to start..."
        sleep 5
    done
}

# Hàm để xóa email cũ
delete_old_emails() {
    response=$(curl -s $MAILHOG_API_URL)
    now=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    echo $response | jq -c '.items[]' | while read -r message; do
        id=$(echo $message | jq -r '.ID')
        created=$(echo $message | jq -r '.Created')

        created_time=$(date -u -d "$created" +"%s")
        now_time=$(date -u -d "$now" +"%s")
        diff_minutes=$(( (now_time - created_time) / 60 ))

        if [ $diff_minutes -gt $DELETE_BEFORE_MINUTES ]; then
            delete_url="${MAILHOG_API_URL}/${id}"
            curl -s -X DELETE $delete_url
            echo "Deleted email with ID: $id"
        fi
    done
}

# Chờ MailHog khởi động
wait_for_mailhog

# Chạy hàm xóa email cũ định kỳ
while true; do
    delete_old_emails
    sleep $((INTERVAL_MINUTES * 60))
done
