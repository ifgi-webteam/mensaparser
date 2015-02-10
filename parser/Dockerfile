FROM dockerfile/nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install

CMD ["sh", "delaystart.sh"]