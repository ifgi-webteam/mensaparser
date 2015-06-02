FROM node:0.10

# Alternative configuration:
#
# WORKDIR /usr/src/app
# RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
RUN /usr/src/app/node_modules/marked/bin/marked /usr/src/app/docs.md > /usr/src/app/docs/index.html

CMD ["sh", "delaystart.sh"]
