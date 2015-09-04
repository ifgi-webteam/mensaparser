FROM node:0.10

# Alternative configuration:
#
# WORKDIR /usr/src/app
# RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install

COPY . /usr/src/app/
RUN (cat docs_header.html && /usr/src/app/node_modules/marked/bin/marked /usr/src/app/docs.md) > /usr/src/app/docs/index.html
RUN /usr/src/app/node_modules/highlight.js-cli/bin/hljs --o /usr/src/app/docs/index.html < /usr/src/app/docs/index.html

CMD ["sh", "delaystart.sh"]
