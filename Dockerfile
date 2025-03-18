FROM nginx

# Copy the built files from the previous stage to the nginx container
COPY ./dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
