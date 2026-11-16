FROM node:22.14-alpine as builder
WORKDIR /app

ARG VITE_BASE_PATH=/alvo/
ENV VITE_BASE_PATH=$VITE_BASE_PATH

COPY . ./
RUN echo "Building with VITE_BASE_PATH=${VITE_BASE_PATH}" \
    && export NODE_PATH=src/ \
    && npm install --loglevel verbose \
    && npm list --depth=0 \
    && npm run build 


FROM nginx:alpine
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
